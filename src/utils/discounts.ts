/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CouponOffer {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  description: string;
  isActive: boolean;
  isCombo?: boolean;
  isFeaturedDeal?: boolean;
  validUntil?: string;
  createdAt: string;
}

const DISCOUNTS_STORAGE_KEY = 'rana_discounts';

export const INITIAL_DISCOUNTS: CouponOffer[] = [
  {
    id: 'disc-black20',
    code: 'BLACK20',
    type: 'percentage',
    discountValue: 20,
    minOrderValue: 0,
    description: 'Exclusive 20% Black Tier Privilege on all luxury Extraits',
    isActive: true,
    isFeaturedDeal: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'disc-rana20',
    code: 'RANA20',
    type: 'percentage',
    discountValue: 20,
    minOrderValue: 0,
    description: 'Maison 20% Patron Privilege for connoisseurs',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'disc-welcome500',
    code: 'WELCOME500',
    type: 'fixed',
    discountValue: 500,
    minOrderValue: 1500,
    description: 'Flat ₹500 welcome gift on first order above ₹1,500',
    isActive: true,
    isFeaturedDeal: true,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'disc-oud15',
    code: 'OUD15',
    type: 'percentage',
    discountValue: 15,
    minOrderValue: 1200,
    description: '15% Off on Royal Agarwood & Amber Artisanal Collection',
    isActive: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'disc-combo800',
    code: 'ROYALCOMBO',
    type: 'fixed',
    discountValue: 800,
    minOrderValue: 2499,
    description: '₹800 savings on multi-flacon luxury gift pairings',
    isActive: true,
    isCombo: true,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
];

/**
 * Retrieve all discount offers from storage
 */
export function getStoredDiscounts(): CouponOffer[] {
  try {
    const raw = localStorage.getItem(DISCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_DISCOUNTS));
      return INITIAL_DISCOUNTS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading discounts:', error);
    return INITIAL_DISCOUNTS;
  }
}

/**
 * Persist discount offers array to storage
 */
export function saveStoredDiscounts(discounts: CouponOffer[]): void {
  try {
    localStorage.setItem(DISCOUNTS_STORAGE_KEY, JSON.stringify(discounts));
    window.dispatchEvent(new CustomEvent('rana_discounts_updated', { detail: discounts }));
  } catch (error) {
    console.error('Error saving discounts:', error);
  }
}

/**
 * Add a new discount coupon
 */
export function addDiscount(newCoupon: Omit<CouponOffer, 'id' | 'createdAt'>): CouponOffer {
  const current = getStoredDiscounts();
  const created: CouponOffer = {
    ...newCoupon,
    code: newCoupon.code.trim().toUpperCase(),
    id: `disc-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [created, ...current.filter((c) => c.code !== created.code)];
  saveStoredDiscounts(updated);
  return created;
}

/**
 * Update an existing discount coupon
 */
export function updateDiscount(id: string, updates: Partial<CouponOffer>): CouponOffer[] {
  const current = getStoredDiscounts();
  const updated = current.map((c) =>
    c.id === id
      ? {
          ...c,
          ...updates,
          code: updates.code ? updates.code.trim().toUpperCase() : c.code,
        }
      : c
  );
  saveStoredDiscounts(updated);
  return updated;
}

/**
 * Toggle active state of a discount coupon
 */
export function toggleDiscountActive(id: string): CouponOffer[] {
  const current = getStoredDiscounts();
  const updated = current.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
  saveStoredDiscounts(updated);
  return updated;
}

/**
 * Delete a discount coupon
 */
export function deleteDiscount(id: string): CouponOffer[] {
  const current = getStoredDiscounts();
  const updated = current.filter((c) => c.id !== id);
  saveStoredDiscounts(updated);
  return updated;
}

/**
 * Validate and calculate discount for an entered coupon code
 */
export function validateCoupon(
  code: string,
  subtotal: number
): {
  valid: boolean;
  discountAmount: number;
  discountPercent?: number;
  coupon?: CouponOffer;
  error?: string;
} {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discountAmount: 0, error: 'Please enter a coupon code.' };
  }

  const coupons = getStoredDiscounts();
  const match = coupons.find((c) => c.code === normalized);

  if (!match) {
    return { valid: false, discountAmount: 0, error: `Privilege code "${normalized}" is invalid.` };
  }

  if (!match.isActive) {
    return { valid: false, discountAmount: 0, error: `Privilege code "${normalized}" is currently inactive.` };
  }

  if (match.minOrderValue && subtotal < match.minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Privilege code requires minimum bag value of ₹${match.minOrderValue.toLocaleString('en-IN')}.`,
    };
  }

  let discountAmount = 0;
  let discountPercent: number | undefined;

  if (match.type === 'percentage') {
    discountPercent = match.discountValue;
    discountAmount = Math.round(subtotal * (match.discountValue / 100));
  } else {
    discountAmount = Math.min(match.discountValue, subtotal);
  }

  return {
    valid: true,
    discountAmount,
    discountPercent,
    coupon: match,
  };
}
