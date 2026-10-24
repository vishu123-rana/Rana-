/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SiteContent {
  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    subheading: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
  about: {
    heading: string;
    subheading: string;
    storyParagraph1: string;
    storyParagraph2: string;
    statsOilConcentration: string;
    statsLongevity: string;
    statsOrigin: string;
  };
  contact: {
    conciergeEmail: string;
    phone: string;
    atelierAddress: string;
    workingHours: string;
  };
  support: {
    deliveryPledge: string;
    macerationGuarantee: string;
    returnsPledge: string;
  };
  footer: {
    brandMotto: string;
    copyrightText: string;
  };
}

const SITE_CONTENT_STORAGE_KEY = 'rana_site_content';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  announcement: {
    enabled: true,
    text: 'Complimentary Pan-India Express Delivery & Deluxe 5ml Vial on orders above ₹1,500.',
    badge: 'EXCLUSIVE ATELIER ALLOCATION',
  },
  hero: {
    eyebrow: 'Maison de Haute Parfumerie · India',
    heading: 'Luxury In Every Single Drop.',
    subheading:
      'Indulge your senses in artisanal perfumes crafted with 35% pure extrait concentration, rare aged agarwood oud, and noble Grasse absolutes.',
    primaryBtnText: "Explore Men's Collection",
    secondaryBtnText: "Explore Women's Collection",
  },
  about: {
    heading: 'The Alchemy of Indian Royalty & Grasse Distillation',
    subheading: 'Where ancient Indian perfume heritage meets contemporary French perfumery discipline.',
    storyParagraph1:
      'Founded with a profound reverence for India’s thousand-year perfume tradition, Maison RANA crafts olfactory masterworks for discerning connoisseurs worldwide.',
    storyParagraph2:
      'Every bottle undergoes a mandatory 90-day cold-maturation process to unveil velvet richness, majestic projection, and a memory-making sillage.',
    statsOilConcentration: '35% Pure Extrait',
    statsLongevity: '18-24 Hours Persistence',
    statsOrigin: 'Handcrafted in New Delhi',
  },
  contact: {
    conciergeEmail: 'concierge@ranaperfumes.com',
    phone: '+91 (11) 4892-0199',
    atelierAddress: 'Atelier RANA, Heritage Boulevard, New Delhi, India',
    workingHours: 'Mon - Sat: 10:00 AM - 8:00 PM IST',
  },
  support: {
    deliveryPledge: 'Insured express pan-India courier delivered in 2-4 business days.',
    macerationGuarantee: 'Authentic pure formulation guaranteed without harsh chemical fillers.',
    returnsPledge: '7-day seamless exchange guarantee for unopened bespoke boxes.',
  },
  footer: {
    brandMotto: 'Maison de Haute Parfumerie. Formulated with 35% pure extrait concentration and noble Grasse absolutes.',
    copyrightText: '© 2026 RANA LUXURY PERFUMES. All Rights Reserved.',
  },
};

export function getStoredSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      announcement: { ...DEFAULT_SITE_CONTENT.announcement, ...(parsed.announcement || {}) },
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      support: { ...DEFAULT_SITE_CONTENT.support, ...(parsed.support || {}) },
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
    };
  } catch (err) {
    console.error('Error reading site content:', err);
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveStoredSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('rana_site_content_updated', { detail: content }));
  } catch (err) {
    console.error('Error saving site content:', err);
  }
}

export function resetStoredSiteContent(): SiteContent {
  saveStoredSiteContent(DEFAULT_SITE_CONTENT);
  return DEFAULT_SITE_CONTENT;
}
