/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FlagshipPerfume {
  id: string;
  shortName: string;
  accent: string;
  gender: 'men' | 'women';
  tag: string;
  notes: { top: string; heart: string; base: string };
  longevity: string;
  sillage: string;
  accord: string;
}

export interface HeroContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  flagshipTitle: string;
  bottleShowcaseTitle: string;
  flagships: FlagshipPerfume[];
}

export const DEFAULT_HERO_CONTENT: HeroContent = {
  eyebrow: 'The Fine Fragrance Collection',
  heading: 'Luxury In Every Single Drop.',
  subheading:
    'Indulge your senses in premium fragrances crafted in India. Blending the rarest, hand-picked absolutes to express elegance, confidence, and enduring aura.',
  primaryBtnText: "Shop Men's Collection",
  secondaryBtnText: "Shop Women's Collection",
  flagshipTitle: 'Flagship Olfactory Selector',
  bottleShowcaseTitle: 'Interactive 3D Scent Flask',
  flagships: [
    {
      id: 'rana-royal-oud',
      shortName: 'Royal Oud',
      accent: '#c5a059',
      gender: 'men',
      tag: 'Oud & Saffron',
      notes: { top: 'Saffron', heart: 'Turkish Rose', base: 'Agarwood Oud' },
      longevity: '24 Hours Persistence',
      sillage: 'Enveloping Sillage',
      accord: 'Woody Oriental',
    },
    {
      id: 'rana-noir',
      shortName: 'RANA Noir',
      accent: '#1a1a1a',
      gender: 'men',
      tag: 'Bergamot & Amber',
      notes: { top: 'Calabrian Bergamot', heart: 'French Lavender', base: 'Amber & Sandalwood' },
      longevity: '16 Hours Persistence',
      sillage: 'Magnetic Aura',
      accord: 'Aromatic Citrus',
    },
    {
      id: 'rana-gold-essence',
      shortName: 'Gold Essence',
      accent: '#d5aa55',
      gender: 'women',
      tag: 'Extrait De Parfum',
      notes: { top: 'Italian Bergamot', heart: 'Damask Rose', base: 'Golden Amber Resin' },
      longevity: '24+ Hours Extrait',
      sillage: 'Room-Filling Radiance',
      accord: 'Warm Amber',
    },
    {
      id: 'rana-velvet-rose',
      shortName: 'Velvet Rose',
      accent: '#9e2a2b',
      gender: 'women',
      tag: 'Rose & Peony',
      notes: { top: 'Saffron Peony', heart: 'Turkish Rose Absolute', base: 'Smoky Amber' },
      longevity: '18 Hours Persistence',
      sillage: 'Graceful Trail',
      accord: 'Floral Oriental',
    },
    {
      id: 'rana-ocean-breeze',
      shortName: 'Ocean Breeze',
      accent: '#3a7ca5',
      gender: 'men',
      tag: 'Marine Citrus',
      notes: { top: 'Sea Salt & Mint', heart: 'Jasmine Absolute', base: 'Cedarwood & Musk' },
      longevity: '12 Hours Persistence',
      sillage: 'Fresh Aquatic Wave',
      accord: 'Aquatic Citrus',
    },
  ],
};

const STORAGE_KEY = 'rana_hero_content';

export function getStoredHeroContent(): HeroContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HERO_CONTENT,
      ...parsed,
      flagships: parsed.flagships || DEFAULT_HERO_CONTENT.flagships,
    };
  } catch {
    return DEFAULT_HERO_CONTENT;
  }
}

export function saveHeroContent(content: HeroContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('rana_hero_updated', { detail: content }));
  } catch (e) {
    console.error('Failed to save hero content:', e);
  }
}

export function resetHeroContent(): HeroContent {
  saveHeroContent(DEFAULT_HERO_CONTENT);
  return DEFAULT_HERO_CONTENT;
}
