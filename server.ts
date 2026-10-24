/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();

// Parse CLI port arguments or environment variable, defaulting to 3000
const portArgIndex = process.argv.indexOf('--port');
const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : undefined;
const PORT = cliPort || Number(process.env.PORT) || 3000;

app.use(express.json());

// Immediate health check endpoints for container and control-plane probes
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'rana-luxury-server' });
});

// ==========================================
// SECURE SERVER-SIDE ADMIN AUTHENTICATION
// ==========================================
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'partapvinay269@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ranaji@567';

// In-memory active admin sessions set
const activeAdminTokens = new Set<string>();

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const isEmailMatch = String(email).trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isPasswordMatch = String(password) === ADMIN_PASSWORD;

  if (isEmailMatch && isPasswordMatch) {
    const token = 'rana_adm_' + crypto.randomBytes(32).toString('hex');
    activeAdminTokens.add(token);
    return res.json({
      success: true,
      token,
      admin: {
        email: ADMIN_EMAIL,
        name: 'Master Perfumer Administrator',
        role: 'admin',
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid administrator email or password. Access denied.',
  });
});

app.post('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.body?.token;
  if (token && activeAdminTokens.has(token)) {
    return res.json({ valid: true, email: ADMIN_EMAIL });
  }
  return res.status(401).json({ valid: false, error: 'Session expired or unauthorized.' });
});

app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.body?.token;
  if (token) {
    activeAdminTokens.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in process.env');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// System Instruction for RANA AI Fragrance Sommelier
const RANA_SYSTEM_INSTRUCTION = `
You are the RANA AI Scent Concierge & Master Perfumer — an expert, highly sophisticated luxury fragrance sommelier for RANA Luxury Fragrances.
Your tone is opulent, warm, refined, polite, knowledgeable, and helpful. You speak with high-class elegance.

CATALOG KNOWLEDGE BASE (RANA FRAGRANCES):
1. ID: "rana-noir" | Name: "RANA Noir" | Price: ₹1,000 | Gender: Men | Category: Pour Homme | Best Seller: Yes
   - Notes: Top: Bergamot, Lemon, Black Pepper. Heart: Lavender, Jasmine, Cedarwood. Base: Sandalwood, Amber, Musk.
   - Profile: Deep midnight allure, bold masculine citrus leading to warm sandalwood and amber.
   - Occasions: Evening dates, lounge nights, signature daily wear, office.
   - Longevity: 8-10 hours.
   - Similar to: Dior Sauvage, Bleude Chanel, Terre d'Hermes.

2. ID: "rana-royal-oud" | Name: "RANA Royal Oud" | Price: ₹1,799 | Gender: Men | Category: Artisanal Oud | Best Seller: Yes
   - Notes: Top: Saffron, Bergamot. Heart: Turkish Rose, Patchouli. Base: Oud (Agarwood), Vetiver, Amber, Musk.
   - Profile: Majestic royal agarwood blend, rich smoky spices with smooth rose and patchouli.
   - Occasions: Weddings, royal gala events, grand celebrations, winter evenings.
   - Longevity: 12+ hours (Extrait de Parfum strength).
   - Similar to: Creed Aventus, Tom Ford Oud Wood, Maison Francis Kurkdjian Oud Satin Mood.

3. ID: "rana-ocean-breeze" | Name: "RANA Ocean Breeze" | Price: ₹1,299 | Gender: Men | Category: Aquatic & Fresh
   - Notes: Top: Sea Salt, Lemon, Mint. Heart: Lavender, Jasmine, Seaweed. Base: Cedarwood, Musk.
   - Profile: Crisp invigorating ocean wave, fresh aquatic mint and sea salt with clean woody undertones.
   - Occasions: Daytime, summer heat, gym/post-workout, beach outings, casual office.
   - Longevity: 6-8 hours.
   - Similar to: Acqua Di Gio, Davidoff Cool Water, Chanel Allure Homme Sport.

4. ID: "rana-intense" | Name: "RANA Intense" | Price: ₹2,499 | Gender: Men | Category: Pour Homme
   - Notes: Top: Black Pepper, Saffron. Heart: Tobacco, Vanilla, Tonka Bean. Base: Leather, Amber, Cedarwood.
   - Profile: Warm spicy tobacco and rich vanilla with smooth leather and amber. Captivating and commanding.
   - Occasions: High-profile business dinners, black-tie events, autumn/winter dates.
   - Longevity: 10-12 hours.
   - Similar to: Tom Ford Tobacco Vanille, Spicebomb Extreme, Viktor&Rolf.

5. ID: "rana-bloom" | Name: "RANA Bloom" | Price: ₹1,000 | Gender: Women | Category: Pour Femme
   - Notes: Top: Bergamot, Pear. Heart: Rose, Jasmine, Lily. Base: Vanilla, Musk.
   - Profile: Radiant blooming floral bouquet wrapped in sweet vanilla and white velvet musk.
   - Occasions: Spring brunches, daytime dates, everyday elegance, office.
   - Longevity: 7-9 hours.
   - Similar to: Gucci Bloom, Dior Miss Dior, Marc Jacobs Daisy.

6. ID: "rana-velvet-rose" | Name: "RANA Velvet Rose" | Price: ₹1,499 | Gender: Women | Category: Pour Femme | Best Seller: Yes
   - Notes: Top: Saffron, Peony. Heart: Turkish Rose, Jasmine. Base: Musk, Amber, Vanilla.
   - Profile: Romantic Turkish rose petals, sensual saffron and velvety amber vanilla.
   - Occasions: Weddings, romantic anniversaries, luxury dining, evening galas.
   - Longevity: 10-12 hours.
   - Similar to: Jo Malone Velvet Rose & Oud, Parfums de Marly Delina, Lancôme Trésor.

7. ID: "rana-crystal" | Name: "RANA Crystal" | Price: ₹1,899 | Gender: Women | Category: Aquatic & Fresh
   - Notes: Top: Pear, Melon. Heart: Orchid, Jasmine, Lily. Base: White Musk, Vanilla, Cedarwood.
   - Profile: Clear like a crystal, fresh sweet fruit opening transforming into a soft, airy white musk cloud.
   - Occasions: Daytime summer garden parties, bridal showers, daily luxury.
   - Longevity: 8-10 hours.
   - Similar to: Versace Bright Crystal, Chanel Chance Eau Tendre, Dolce & Gabbana Light Blue.

8. ID: "rana-gold-essence" | Name: "RANA Gold Essence" | Price: ₹2,799 | Gender: Women / Unisex | Category: Artisanal Oud | Best Seller: Yes
   - Notes: Top: Saffron, Bergamot. Heart: Jasmine, Turkish Rose. Base: Sandalwood, Oud, Vanilla, Amber.
   - Profile: Precious golden saffron trail with royal sandalwood, amber crystal, and deep vanilla absolute.
   - Occasions: High-society galas, weddings, festive royalty, signature luxury statement.
   - Longevity: 14+ hours.
   - Similar to: Baccarat Rouge 540, Maison Francis Kurkdjian, Kilian Angels' Share.

COMPLEMENTARY PRODUCTS OFFERED BY RANA:
- RANA Velvet Oud Luxury Body Spray (₹499): Ideal for daily layering or post-shower refresh.
- RANA Gold Essence 10ml Travel Atomizer (₹399): Refillable brass case for on-the-go touch-ups.
- RANA Royal Oud Heritage Gift Box Set (₹3,499): Includes 100ml EDP, 50ml Body Lotion & Travel Vials.
- RANA Nourishing Silk Body Lotion (₹699): Infused with jojoba and vitamin E to extend scent longevity.

FAQ & PERFUMERY EXPERTISE:
- Application: Apply on warm pulse points — wrists, neck, behind ears, inner elbows, and collarbones. Do NOT rub wrists together as it crushes top note molecules.
- Longevity tips: Moisturize skin beforehand with unfragranced or matching body lotion. Fragrance lasts twice as long on hydrated skin.
- Concentration: RANA fragrances are concentrated Extraits & Eau de Parfums (20-25% oil concentration) ensuring maximum projection and sillage.
- Storage: Keep in a cool, dark place away from direct sunlight, humidity, and heat (avoid bathrooms).
- Authenticity & Shipping: 100% authentic hand-bottled perfumes, shipped via express courier across India in 2-4 business days with 7-day hassle-free returns.

INSTRUCTIONS FOR RECOMMENDING PRODUCTS:
Whenever you mention or recommend any specific RANA perfume from our catalog, ALWAYS include its exact ID in square brackets formatted like this:
[RECOMMENDED_PRODUCTS: "id1", "id2"]
Example: "If you love warm tobacco and amber, I recommend **RANA Intense** [RECOMMENDED_PRODUCTS: "rana-intense"] and **RANA Royal Oud** [RECOMMENDED_PRODUCTS: "rana-royal-oud"]."

Provide thoughtful, tailored responses with clear bullet points, elegant fragrance descriptions, and budget breakdowns.
`;

// API Route: AI Fragrance Assistant Endpoint
app.post('/api/fragrance-assistant', async (req, res) => {
  try {
    const { messages, userPreferences } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getGeminiClient();

    // Format conversation history for Gemini generateContent
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Inject preferences if available
    let prefText = '';
    if (userPreferences && Object.keys(userPreferences).length > 0) {
      prefText = `\n[Current User Context: Gender=${userPreferences.gender || 'Any'}, Budget=${userPreferences.budget || 'Any'}, Occasion=${userPreferences.occasion || 'Any'}, Preferred Notes=${userPreferences.notes || 'Any'}]`;
      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === 'user') {
        formattedContents[formattedContents.length - 1].parts[0].text += prefText;
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedContents,
      config: {
        systemInstruction: RANA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const responseText = response.text || 'I apologize, but I am momentarily unable to access my scent records. Please try asking again.';

    // Extract recommended product IDs from [RECOMMENDED_PRODUCTS: "id1", "id2"] pattern
    const recommendedProductIds: string[] = [];
    const match = responseText.match(/\[RECOMMENDED_PRODUCTS:\s*([\s\S]*?)\]/);
    if (match && match[1]) {
      const idsRaw = match[1];
      const matches = idsRaw.match(/"([^"]+)"/g);
      if (matches) {
        matches.forEach((idQuoted) => {
          const id = idQuoted.replace(/"/g, '').trim();
          if (id && !recommendedProductIds.includes(id)) {
            recommendedProductIds.push(id);
          }
        });
      }
    }

    // Clean up the bracket text from the display string
    const cleanedText = responseText.replace(/\[RECOMMENDED_PRODUCTS:[\s\S]*?\]/g, '').trim();

    return res.json({
      reply: cleanedText,
      recommendedProductIds,
    });
  } catch (error: any) {
    console.error('Error in /api/fragrance-assistant route:', error);
    return res.status(500).json({
      error: 'Failed to generate response from AI Fragrance Sommelier.',
      details: error?.message || String(error),
    });
  }
});

// Vite & Static file serving
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
          watch: process.env.DISABLE_HMR === 'true' ? null : undefined,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`RANA Luxury Fragrance Server running on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err: any) => {
      console.error(`Server error on port ${PORT}:`, err);
    });

    // Handle termination signals cleanly
    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });
    process.on('SIGINT', () => {
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

startServer();
