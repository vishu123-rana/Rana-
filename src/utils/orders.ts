/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order } from '../types';
import { perfumes } from '../data/perfumes';

const ORDERS_STORAGE_KEY = 'rana_orders';

// Initial sample orders for showcase when local storage is fresh
const SAMPLE_ORDERS: Order[] = [
  {
    id: 'RANA-2026-849201',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    items: [
      { product: perfumes[0], quantity: 1 }, // RANA Noir
      { product: perfumes[5], quantity: 1 }, // RANA Velvet Rose
    ],
    subtotal: 2499,
    discountAmount: 500,
    couponCode: 'WELCOME500',
    gstAmount: 360,
    shippingCharge: 0,
    deliveryOption: 'standard',
    totalAmount: 2359,
    customerInfo: {
      fullName: 'Vinay Partap',
      email: 'partapvinay269@gmail.com',
      phone: '9876543210',
    },
    shippingAddress: {
      houseNo: 'House No. 104, Green Park Avenue',
      street: 'Sector 15, Near City Center',
      city: 'Chandigarh',
      state: 'Punjab',
      pinCode: '160015',
    },
    paymentMethod: 'upi',
    paymentDetails: 'UPI (Google Pay)',
    estimatedDeliveryDate: 'Thursday, Jul 30, 2026',
    status: 'Processing',
  },
  {
    id: 'RANA-2026-610482',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    items: [
      { product: perfumes[1], quantity: 1 }, // RANA Royal Oud
    ],
    subtotal: 1799,
    discountAmount: 360,
    couponCode: 'RANA20',
    gstAmount: 259,
    shippingCharge: 250,
    deliveryOption: 'express',
    totalAmount: 1948,
    customerInfo: {
      fullName: 'Vinay Partap',
      email: 'partapvinay269@gmail.com',
      phone: '9876543210',
    },
    shippingAddress: {
      houseNo: 'Suite 402, Imperial Heights',
      street: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pinCode: '110001',
    },
    paymentMethod: 'card',
    paymentDetails: 'Card ending in •••• 4242',
    estimatedDeliveryDate: 'Wednesday, Jul 29, 2026',
    status: 'Shipped',
  },
  {
    id: 'RANA-2026-382910',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    items: [
      { product: perfumes[2], quantity: 2 }, // RANA Ocean Breeze
    ],
    subtotal: 2398,
    discountAmount: 240,
    couponCode: 'LUXURY10',
    gstAmount: 388,
    shippingCharge: 0,
    deliveryOption: 'standard',
    totalAmount: 2546,
    customerInfo: {
      fullName: 'Vinay Partap',
      email: 'partapvinay269@gmail.com',
      phone: '9876543210',
    },
    shippingAddress: {
      houseNo: 'Villa 12, Palm Meadows',
      street: 'Whitefield Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560066',
    },
    paymentMethod: 'cod',
    paymentDetails: 'Cash on Delivery',
    estimatedDeliveryDate: 'Today, Jul 28, 2026',
    status: 'Out for Delivery',
  },
  {
    id: 'RANA-2026-194028',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    items: [
      { product: perfumes[3], quantity: 1 }, // RANA Intense
      { product: perfumes[4], quantity: 1 }, // RANA Bloom
    ],
    subtotal: 2898,
    discountAmount: 0,
    gstAmount: 521,
    shippingCharge: 0,
    deliveryOption: 'standard',
    totalAmount: 3419,
    customerInfo: {
      fullName: 'Vinay Partap',
      email: 'partapvinay269@gmail.com',
      phone: '9876543210',
    },
    shippingAddress: {
      houseNo: 'Flat 501, Marine Drive Towers',
      street: 'Marine Drive Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400020',
    },
    paymentMethod: 'net_banking',
    paymentDetails: 'Net Banking (HDFC Bank)',
    estimatedDeliveryDate: 'Delivered on Jul 24, 2026',
    status: 'Delivered',
  },
];

import { saveOrderToSupabase, updateOrderStatusInSupabase, fetchOrdersFromSupabase } from './supabase';

/**
 * Get all stored orders from Local Storage
 */
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      // Seed initial sample orders for rich immediate display
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading stored orders:', error);
    return SAMPLE_ORDERS;
  }
}

/**
 * Save a newly placed order to Local Storage and sync to Supabase backend
 */
export function saveOrder(order: Order): void {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('rana_orders_updated', { detail: updated }));
  } catch (error) {
    console.error('Error saving order locally:', error);
  }

  // Push to Supabase backend table
  saveOrderToSupabase(order).then((res) => {
    if (res.success) {
      console.log(`[Supabase] Order ${order.id} committed to Supabase tables.`);
    } else {
      console.info(`[Supabase] Order recorded locally. Supabase note: ${res.error || 'Table pending creation'}`);
    }
  }).catch((err) => {
    console.warn('[Orders] Supabase sync caught error:', err);
  });
}

/**
 * Retrieve a specific order by ID
 */
export function getOrderById(id: string): Order | null {
  const orders = getStoredOrders();
  return orders.find((o) => o.id.toLowerCase().trim() === id.toLowerCase().trim()) || null;
}

/**
 * Update an order's status locally and in Supabase
 */
export function updateOrderStatus(orderId: string, newStatus: Order['status']): Order[] {
  const orders = getStoredOrders();
  const updated = orders.map((o) =>
    o.id.toLowerCase().trim() === orderId.toLowerCase().trim() ? { ...o, status: newStatus } : o
  );
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('rana_orders_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save updated order status locally', err);
  }

  // Update in Supabase
  updateOrderStatusInSupabase(orderId, newStatus).catch((err) => {
    console.warn('[Orders] Supabase status update note:', err);
  });

  return updated;
}

/**
 * Sync orders between Supabase backend and client cache
 */
export async function syncOrdersWithSupabase(): Promise<Order[]> {
  try {
    const remote = await fetchOrdersFromSupabase();
    if (remote && remote.length > 0) {
      const local = getStoredOrders();
      const map = new Map<string, Order>();
      local.forEach((o) => map.set(o.id, o));
      remote.forEach((o) => map.set(o.id, o));
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('[Orders] Failed to sync remote orders:', err);
  }
  return getStoredOrders();
}

