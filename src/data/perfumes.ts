/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Perfume } from '../types';
import ranaNoirImg from '../assets/images/regenerated_image_1784869021466.png';
import ranaRoyalOudImg from '../assets/images/regenerated_image_1784869208985.png';
import ranaOceanBreezeImg from '../assets/images/regenerated_image_1784869320229.png';
import ranaIntenseImg from '../assets/images/regenerated_image_1784869407630.png';
import ranaBloomImg from '../assets/images/regenerated_image_1784869529047.png';
import ranaVelvetRoseImg from '../assets/images/regenerated_image_1784869624493.png';
import ranaCrystalImg from '../assets/images/regenerated_image_1784869746827.png';
import ranaGoldEssenceImg from '../assets/images/regenerated_image_1784869753135.png';
import ranaOudAlLaylImg from '../assets/images/regenerated_image_1792131373116.png';
import ranaSovereignImperialImg from '../assets/images/Gemini_Generated_Image_e47xoce47xoce47x.png';
import ranaDiscoveryTrioImg from '../assets/images/Gemini_Generated_Image_xducm3xducm3xduc.png';
import ranaRoyalQuintetImg from '../assets/images/Gemini_Generated_Image_6wn1q46wn1q46wn1.png';
import ranaAmberSantalImg from '../assets/images/Gemini_Generated_Image_b2pccqb2pccqb2pc.png';
import ranaBlancCelesteImg from '../assets/images/Gemini_Generated_Image_4z2zao4z2zao4z2z.png';

export const perfumes: Perfume[] = [
  // ==========================================
  // 1. MEN'S COLLECTION
  // ==========================================
  {
    id: 'rana-noir',
    name: 'RANA Noir',
    price: 1899,
    originalPrice: 2699,
    discountPercent: 30,
    gender: 'men',
    category: 'Men',
    rating: 4.9,
    image: ranaNoirImg,
    notes: {
      top: ['Calabrian Bergamot', 'Sicilian Lemon', 'Crushed Black Pepper'],
      heart: ['French Lavender', 'Night Blooming Jasmine', 'Atlas Cedarwood'],
      base: ['Mysore Sandalwood', 'Smoked Amber', 'Velvet Cashmere Musk'],
    },
    ingredients: ['Bergamot', 'Lavender', 'Sandalwood', 'Amber', 'Musk', 'Cedarwood'],
    description:
      'Bold, masculine, and unapologetically commanding. RANA Noir opens with sharp citrus and crackling black pepper, evolving into an intoxicating heart of French lavender before settling into an enduring base of warm smoked amber and creamy Mysore sandalwood.',
    bestSeller: true,
    featured: true,
    stock: 42,
    longevity: '18+ Hours',
    accord: 'Woody Chiaroscuro',
    sizes: {
      '20ml': 699,
      '50ml': 1299,
      '100ml': 1899,
    },
  },
  {
    id: 'rana-intense',
    name: 'RANA Intense',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 28,
    gender: 'men',
    category: 'Men',
    rating: 4.9,
    image: ranaIntenseImg,
    notes: {
      top: ['Kashmiri Saffron', 'Cardamom Pods', 'Smoked Mandarin'],
      heart: ['Cuban Tobacco Leaf', 'Bourbon Vanilla', 'Roasted Tonka Bean'],
      base: ['Russian Leather', 'Golden Ambergris', 'Smoked Cedar'],
    },
    ingredients: ['Tobacco', 'Vanilla', 'Leather', 'Amber', 'Tonka Bean', 'Saffron', 'Cedarwood'],
    description:
      'A magnetic evening fragrance designed for the modern gentleman who leaves an indelible impression. Rich Cuban tobacco, warm dark vanilla, and burnished leather meld into an opulent aura of raw confidence and seductive power.',
    bestSeller: false,
    featured: true,
    stock: 28,
    longevity: '24 Hours',
    accord: 'Smoky Amber Leather',
    sizes: {
      '20ml': 899,
      '50ml': 1699,
      '100ml': 2499,
    },
  },
  {
    id: 'rana-ocean-breeze',
    name: 'RANA Ocean Breeze',
    price: 1599,
    originalPrice: 2299,
    discountPercent: 30,
    gender: 'men',
    category: 'Men',
    rating: 4.8,
    image: ranaOceanBreezeImg,
    notes: {
      top: ['Atlantic Sea Salt', 'Sparkling Yuzu', 'Crushed Wild Mint'],
      heart: ['Coastal Lavender', 'Sea Fennel', 'Mineral Calone'],
      base: ['Sun-Bleached Driftwood', 'White Amber', 'Crisp Musk'],
    },
    ingredients: ['Sea Salt', 'Lemon', 'Mint', 'Cedarwood', 'Musk', 'Lavender'],
    description:
      'An invigorating marine masterpiece capturing the untamed vitality of deep ocean currents. Crisp sea spray and frosted mint awaken the senses, drying down into clean sun-drenched coastal woods.',
    bestSeller: false,
    stock: 35,
    longevity: '14 Hours',
    accord: 'Aquatic Mineral',
    sizes: {
      '20ml': 599,
      '50ml': 1099,
      '100ml': 1599,
    },
  },

  // ==========================================
  // 2. WOMEN'S COLLECTION
  // ==========================================
  {
    id: 'rana-velvet-rose',
    name: 'RANA Velvet Rose',
    price: 1999,
    originalPrice: 2899,
    discountPercent: 31,
    gender: 'women',
    category: 'Women',
    rating: 4.9,
    image: ranaVelvetRoseImg,
    notes: {
      top: ['Kashmiri Saffron', 'Pink Peony', 'Wild Raspberry'],
      heart: ['Damask Turkish Rose', 'Sambac Jasmine', 'Spiced Praline'],
      base: ['Madagascar Vanilla', 'Radiant Amber', 'Silk Musk'],
    },
    ingredients: ['Rose', 'Musk', 'Amber', 'Vanilla', 'Saffron', 'Jasmine'],
    description:
      'An intoxicating ode to aristocratic femininity. Thousands of hand-harvested Turkish rose petals wrapped in molten spiced saffron and creamy Madagascar vanilla, draped in soft crimson velvet.',
    bestSeller: true,
    featured: true,
    stock: 50,
    longevity: '20+ Hours',
    accord: 'Opulent Floral Amber',
    sizes: {
      '20ml': 749,
      '50ml': 1399,
      '100ml': 1999,
    },
  },
  {
    id: 'rana-bloom',
    name: 'RANA Bloom',
    price: 1499,
    originalPrice: 2099,
    discountPercent: 28,
    gender: 'women',
    category: 'Women',
    rating: 4.7,
    image: ranaBloomImg,
    notes: {
      top: ['Italian Bergamot', 'Crisp White Pear', 'Dewy Green Leaves'],
      heart: ['Centifolia Rose', 'Star Jasmine', 'White Casablanca Lily'],
      base: ['Sheer Vanilla Bourbon', 'Powdery Musk', 'Light Sandalwood'],
    },
    ingredients: ['Rose', 'Jasmine', 'Vanilla', 'Musk', 'Bergamot'],
    description:
      'Luminous, youthful, and poetically graceful. Like stepping into a royal botanical conservatory at dawn, fresh white lilies and jasmine petals unfurl over a soft cloud of warm spun vanilla.',
    bestSeller: false,
    stock: 38,
    longevity: '16 Hours',
    accord: 'Fresh Floral Elegance',
    sizes: {
      '20ml': 549,
      '50ml': 999,
      '100ml': 1499,
    },
  },
  {
    id: 'rana-crystal',
    name: 'RANA Crystal',
    price: 2199,
    originalPrice: 3099,
    discountPercent: 29,
    gender: 'women',
    category: 'Women',
    rating: 4.8,
    image: ranaCrystalImg,
    notes: {
      top: ['Anjou Pear', 'Chilled Melon', 'Freesia Blossoms'],
      heart: ['Night Orchid', 'Grasse Jasmine', 'Valley Lily'],
      base: ['White Cashmere Musk', 'Tahitian Vanilla', 'Blonde Cedar'],
    },
    ingredients: ['Jasmine', 'Musk', 'Vanilla', 'Cedarwood'],
    description:
      'Pristine clarity captured in a faceted flacon. RANA Crystal sparkles with translucent orchard fruits and rare night orchid, trailing into an ethereal veil of white cashmere musk.',
    bestSeller: false,
    stock: 26,
    longevity: '18 Hours',
    accord: 'Crystalline Floral Wood',
    sizes: {
      '20ml': 799,
      '50ml': 1499,
      '100ml': 2199,
    },
  },

  // ==========================================
  // 3. UNISEX COLLECTION
  // ==========================================
  {
    id: 'rana-amber-santal',
    name: 'RANA Amber Santal',
    price: 2299,
    originalPrice: 3199,
    discountPercent: 28,
    gender: 'unisex',
    category: 'Unisex',
    rating: 4.9,
    image: ranaAmberSantalImg,
    notes: {
      top: ['Pink Peppercorn', 'Bergamot Zest', 'Spiced Nutmeg'],
      heart: ['Mysore Sandalwood Heart', 'Labdanum Resin', 'Smoked Cinnamon'],
      base: ['Golden Ambergris', 'Dark Vanilla Bean', 'Clean Musk'],
    },
    ingredients: ['Sandalwood', 'Amber', 'Pink Pepper', 'Vanilla', 'Musk', 'Nutmeg'],
    description:
      'A seamless equilibrium of warmth, sacred woods, and golden amber resins. Transcending conventional gender lines, Amber Santal reacts to the natural warmth of your skin to radiate an intimate, hypnotic sillage.',
    bestSeller: true,
    featured: true,
    stock: 32,
    longevity: '22 Hours',
    accord: 'Sacred Woody Amber',
    sizes: {
      '20ml': 849,
      '50ml': 1599,
      '100ml': 2299,
    },
  },
  {
    id: 'rana-blanc-celeste',
    name: 'RANA Blanc Céleste',
    price: 1999,
    originalPrice: 2799,
    discountPercent: 28,
    gender: 'unisex',
    category: 'Unisex',
    rating: 4.8,
    image: ranaBlancCelesteImg,
    notes: {
      top: ['Tunisian Neroli', 'Petitgrain', 'White Aldehydes'],
      heart: ['Florentine Orris', 'Cotton Flower', 'Orange Blossom'],
      base: ['White Cedar', 'Ambroxan Crystals', 'Airy White Musk'],
    },
    ingredients: ['Neroli', 'Orris', 'Orange Blossom', 'Cedar', 'Ambroxan'],
    description:
      'Pure minimalist luxury. Blanc Céleste captures the pristine crispness of freshly pressed Egyptian linen under alpine sunlight, warmed by Florentine orris root and modern amber crystals.',
    bestSeller: false,
    stock: 24,
    longevity: '16 Hours',
    accord: 'Luminous Solar Clean',
    sizes: {
      '20ml': 749,
      '50ml': 1399,
      '100ml': 1999,
    },
  },

  // ==========================================
  // 4. OUD COLLECTION
  // ==========================================
  {
    id: 'rana-royal-oud',
    name: 'RANA Royal Oud',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 28,
    gender: 'men',
    category: 'Oud',
    rating: 5.0,
    image: ranaRoyalOudImg,
    notes: {
      top: ['Royal Saffron', 'Sweet Nutmeg', 'Bergamot'],
      heart: ['Turkish Damask Rose', 'Indonesian Patchouli', 'Dry Cedar'],
      base: ['Cambodian Agarwood (Oud)', 'Haitian Vetiver', 'Warm Amber'],
    },
    ingredients: ['Oud', 'Rose', 'Patchouli', 'Vetiver', 'Amber', 'Musk', 'Saffron'],
    description:
      'The crown jewel of traditional Middle Eastern haute perfumery. Distilled from century-old sustainably harvested Cambodian agarwood, counterbalanced by velvety Turkish rose and spicy golden saffron.',
    bestSeller: true,
    featured: true,
    stock: 40,
    longevity: '24+ Hours',
    accord: 'Majestic Royal Oud',
    sizes: {
      '20ml': 949,
      '50ml': 1799,
      '100ml': 2499,
    },
  },
  {
    id: 'rana-oud-al-layl',
    name: 'RANA Oud Al-Layl',
    price: 3299,
    originalPrice: 4499,
    discountPercent: 26,
    gender: 'unisex',
    category: 'Oud',
    rating: 4.9,
    image: ranaOudAlLaylImg,
    notes: {
      top: ['Smoked Frankincense', 'Black Cardamom', 'Bitter Almond'],
      heart: ['Aged Assam Oud Extract', 'Leather Accords', 'Cistus Labdanum'],
      base: ['Dark Animalic Amber', 'Birch Tar', 'Smoky Guaiac Wood'],
    },
    ingredients: ['Oud', 'Frankincense', 'Leather', 'Amber', 'Cardamom', 'Guaiac Wood'],
    description:
      'Oud of the Night. An uncompromising, dark, and enigmatic elixir crafted with aged wild Assam agarwood. Intense smoke, dry woods, and ritualistic resins combine to create an aura of supreme mystique.',
    bestSeller: false,
    stock: 18,
    longevity: '28 Hours',
    accord: 'Dark Smoked Agarwood',
    sizes: {
      '20ml': 1299,
      '50ml': 2299,
      '100ml': 3299,
    },
  },

  // ==========================================
  // 5. PREMIUM COLLECTION
  // ==========================================
  {
    id: 'rana-gold-essence',
    name: 'RANA Gold Essence',
    price: 2999,
    originalPrice: 4299,
    discountPercent: 30,
    gender: 'women',
    category: 'Premium',
    rating: 5.0,
    image: ranaGoldEssenceImg,
    notes: {
      top: ['Kashmiri Mogra Saffron', 'Blood Mandarin', 'Italian Neroli'],
      heart: ['Night Blooming Sambac Jasmine', 'Taif Rose Absolue', 'Caramelized Benzoin'],
      base: ['24K Liquid Amber', 'Mysore Sandalwood Oil', 'Smoked Bourbon Vanilla'],
    },
    ingredients: ['Saffron', 'Amber', 'Sandalwood', 'Oud', 'Vanilla', 'Jasmine', 'Rose'],
    description:
      'Liquid gold captured in a bottle. RANA Gold Essence is our ultra-luxury private reserve formulation featuring double-distilled Kashmiri saffron and golden amber that leaves an unforgettable aristocratic trail.',
    bestSeller: true,
    featured: true,
    stock: 22,
    longevity: '24 Hours',
    accord: 'Golden Oriental Luxury',
    sizes: {
      '20ml': 1199,
      '50ml': 2099,
      '100ml': 2999,
    },
  },
  {
    id: 'rana-sovereign-imperial',
    name: 'RANA Sovereign Imperial',
    price: 3699,
    originalPrice: 4999,
    discountPercent: 26,
    gender: 'unisex',
    category: 'Premium',
    rating: 4.9,
    image: ranaSovereignImperialImg,
    notes: {
      top: ['Black Truffle', 'Ylang Ylang Extra', 'Bergamot'],
      heart: ['Florentine Iris Concrete', 'Black Orchid', 'Lotus Wood'],
      base: ['Patchouli Coeur', 'Sandalwood Royale', 'Dark Vetiver', 'Ambergris'],
    },
    ingredients: ['Iris', 'Black Truffle', 'Orchid', 'Sandalwood', 'Ambergris', 'Vetiver'],
    description:
      'The zenith of perfumery art. Hand-extracted Florentine iris concrete, among the most expensive natural raw materials in the world, layered with earthy black truffle and rare woods for sovereign distinction.',
    bestSeller: false,
    stock: 14,
    longevity: '26 Hours',
    accord: 'Imperial Aristocratic Wood',
    sizes: {
      '20ml': 1399,
      '50ml': 2599,
      '100ml': 3699,
    },
  },

  // ==========================================
  // 6. GIFT SETS
  // ==========================================
  {
    id: 'rana-discovery-trio',
    name: 'RANA Discovery Trio (3x20ml)',
    price: 1999,
    originalPrice: 2899,
    discountPercent: 31,
    gender: 'unisex',
    category: 'Gift Sets',
    rating: 4.9,
    image: ranaDiscoveryTrioImg,
    notes: {
      top: ['Bergamot', 'Saffron', 'Pear'],
      heart: ['Turkish Rose', 'French Lavender', 'Night Jasmine'],
      base: ['Mysore Sandalwood', 'Cambodian Oud', 'Ambergris'],
    },
    ingredients: ['Sandalwood', 'Oud', 'Rose', 'Amber', 'Saffron', 'Lavender'],
    description:
      'The quintessential RANA discovery experience. Presented in an opulent midnight navy presentation coffret with intricate gold arabesque filigree, containing three 20ml jewel-flacons: Oud Al-Layl (Ruby), Royal Blue (Sapphire), and Sovereign Imperial (Emerald).',
    bestSeller: true,
    featured: true,
    stock: 30,
    longevity: '20+ Hours Each',
    accord: 'Curated Haute Coffret',
    sizes: {
      '20ml': 1999,
      '50ml': 1999,
      '100ml': 1999,
    },
  },
  {
    id: 'rana-royal-quintet',
    name: 'RANA Royal Quintet Gift Set (5x15ml)',
    price: 3499,
    originalPrice: 4999,
    discountPercent: 30,
    gender: 'unisex',
    category: 'Gift Sets',
    rating: 5.0,
    image: ranaRoyalQuintetImg,
    notes: {
      top: ['Saffron', 'Sea Salt', 'Bergamot', 'Pink Pepper', 'Ylang Ylang'],
      heart: ['Assam Oud', 'Taif Rose', 'Lavender', 'Orris', 'Tobacco'],
      base: ['Ambergris', 'Sandalwood', 'Leather', 'Vanilla', 'Vetiver'],
    },
    ingredients: ['Oud', 'Rose', 'Sandalwood', 'Amber', 'Saffron', 'Leather', 'Vanilla'],
    description:
      'The definitive connoisseur gift. An opulent royal navy presentation coffret with ornate gilded arabesque filigree, presenting five 15ml jewel flacons crowned with sculpted brass caps: Oud Al-Layl (Ruby Red), Sovereign Imperial (Emerald Green), Royal Blue (Sapphire), Majestic Amber (Golden Amber), and Imperial Amethyst (Royal Violet).',
    bestSeller: false,
    stock: 15,
    longevity: '24 Hours Each',
    accord: 'Grand Prestige Coffret',
    sizes: {
      '20ml': 3499,
      '50ml': 3499,
      '100ml': 3499,
    },
  },
];
