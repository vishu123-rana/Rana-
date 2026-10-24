/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Order } from '../types';

// Default Supabase project credentials provided by user
export const DEFAULT_SUPABASE_PROJECT_ID = 'jmgphiuxddonqdyeydjs';
export const DEFAULT_SUPABASE_URL = 'https://jmgphiuxddonqdyeydjs.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_KASvUcGrsZjqWMKhZO1anA_0oZjyjxV';

/**
 * Sanitizes and guarantees a valid HTTP/HTTPS URL
 */
export function sanitizeSupabaseUrl(input?: string): string {
  if (!input || typeof input !== 'string') {
    return DEFAULT_SUPABASE_URL;
  }
  let clean = input.trim().replace(/^['"]|['"]$/g, '');
  if (!clean || clean === 'nqrkiqltalershurqasv') {
    return DEFAULT_SUPABASE_URL;
  }

  // If user passed just the project ID e.g. "jmgphiuxddonqdyeydjs"
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}.supabase.co`;
  }

  try {
    const parsed = new URL(clean);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // Ignore URL parse error and fallback
  }

  return DEFAULT_SUPABASE_URL;
}

export function sanitizeSupabaseKey(input?: string): string {
  if (!input || typeof input !== 'string') {
    return DEFAULT_SUPABASE_KEY;
  }
  const clean = input.trim().replace(/^['"]|['"]$/g, '');
  if (!clean || clean.includes('SJwgQ7rLjtmwKZMYuPLTag_A0AptYWI')) {
    return DEFAULT_SUPABASE_KEY;
  }
  return clean;
}

export const SUPABASE_URL = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = sanitizeSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

const projectIdMatch = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/);
export const SUPABASE_PROJECT_ID = projectIdMatch ? projectIdMatch[1] : DEFAULT_SUPABASE_PROJECT_ID;

// Safely initialize Supabase Client with fail-safe fallback
function initSupabaseClient() {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.error('[Supabase] Client creation caught error, using safe fallback client:', err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
}

export const supabase = initSupabaseClient();

export interface SupabaseSyncResult {
  success: boolean;
  tableFound: boolean;
  error?: string;
  data?: any;
}

/**
 * Check if the 'orders' table exists in Supabase
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase.from('orders').select('id').limit(1);

    if (!error) {
      return {
        connected: true,
        tableExists: true,
        message: 'Successfully connected to Supabase "orders" table.',
      };
    }

    if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
      return {
        connected: true,
        tableExists: false,
        message:
          'Connected to Supabase project, but "orders" table is not yet created. Run the SQL schema script in Supabase SQL Editor.',
      };
    }

    return {
      connected: false,
      tableExists: false,
      message: `Supabase error: ${error.message}`,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: err?.message || 'Network error connecting to Supabase.',
    };
  }
}

/**
 * Format and insert an Order into the Supabase 'orders' table
 */
export async function saveOrderToSupabase(order: Order): Promise<SupabaseSyncResult> {
  console.log('[Supabase] Initiating order sync for order:', order.id);

  // Simplified and clean items representation for database storage
  const formattedItems = order.items.map((item) => ({
    perfume_id: item.product.id,
    perfume_name: item.product.name,
    selected_size: item.selectedSize || '100ml',
    quantity: item.quantity,
    unit_price: item.itemPrice ?? item.product.price,
    total_price: (item.itemPrice ?? item.product.price) * item.quantity,
    image: item.product.image || null,
  }));

  // Primary column payload matching standard relational schema
  const primaryPayload = {
    id: order.id,
    created_at: order.createdAt || new Date().toISOString(),
    customer_name: order.customerInfo.fullName,
    customer_email: order.customerInfo.email,
    customer_phone: order.customerInfo.phone,
    house_no: order.shippingAddress.houseNo,
    street: order.shippingAddress.street,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    pincode: order.shippingAddress.pinCode,
    shipping_address: order.shippingAddress,
    items: formattedItems,
    subtotal: order.subtotal,
    discount_amount: order.discountAmount || 0,
    coupon_code: order.couponCode || null,
    gst_amount: order.gstAmount || 0,
    shipping_charge: order.shippingCharge || 0,
    total_amount: order.totalAmount,
    payment_method: order.paymentMethod,
    payment_details: order.paymentDetails || null,
    status: order.status || 'Confirmed',
    delivery_option: order.deliveryOption || 'standard',
    estimated_delivery_date: order.estimatedDeliveryDate || null,
    raw_payload: order,
  };

  try {
    // Attempt 1: Full structured insert into 'orders'
    const { data, error } = await supabase.from('orders').insert([primaryPayload]).select();

    if (!error) {
      console.log('[Supabase] Successfully saved order to Supabase table "orders":', data);
      return { success: true, tableFound: true, data };
    }

    console.warn('[Supabase] Standard insert encountered error:', error);

    // If columns mismatch, try a more flexible fallback payload
    if (error.code !== 'PGRST205' && !error.message?.includes('schema cache')) {
      const simplifiedPayload = {
        id: order.id,
        customer_name: order.customerInfo.fullName,
        customer_email: order.customerInfo.email,
        total_amount: order.totalAmount,
        status: order.status || 'Confirmed',
        shipping_address: order.shippingAddress,
        items: formattedItems,
      };

      const fallbackResult = await supabase
        .from('orders')
        .insert([simplifiedPayload])
        .select();

      if (!fallbackResult.error) {
        console.log('[Supabase] Successfully saved via simplified payload:', fallbackResult.data);
        return { success: true, tableFound: true, data: fallbackResult.data };
      }
    }

    return {
      success: false,
      tableFound: error.code !== 'PGRST205',
      error: error.message || 'Failed to save to Supabase',
    };
  } catch (err: any) {
    console.error('[Supabase] Unexpected exception saving order to Supabase:', err);
    return {
      success: false,
      tableFound: false,
      error: err?.message || String(err),
    };
  }
}

/**
 * Fetch orders from Supabase if table exists
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    // Map Supabase rows back to Order objects
    return data.map((row: any) => {
      if (row.raw_payload) {
        return { ...row.raw_payload, status: row.status || row.raw_payload.status };
      }

      return {
        id: row.id,
        createdAt: row.created_at || new Date().toISOString(),
        items: (row.items || []).map((it: any) => ({
          product: {
            id: it.perfume_id || it.id || 'perfume',
            name: it.perfume_name || it.name || 'RANA Fragrance',
            price: it.unit_price || it.price || 1999,
            gender: 'unisex',
            category: 'Premium',
            rating: 4.9,
            notes: { top: [], heart: [], base: [] },
            ingredients: [],
            description: '',
            image: it.image,
          },
          quantity: it.quantity || 1,
          selectedSize: it.selected_size || '100ml',
          itemPrice: it.unit_price,
        })),
        subtotal: Number(row.subtotal) || Number(row.total_amount) || 0,
        discountAmount: Number(row.discount_amount) || 0,
        couponCode: row.coupon_code,
        gstAmount: Number(row.gst_amount) || 0,
        shippingCharge: Number(row.shipping_charge) || 0,
        deliveryOption: row.delivery_option || 'standard',
        totalAmount: Number(row.total_amount) || 0,
        customerInfo: {
          fullName: row.customer_name || 'Customer',
          email: row.customer_email || '',
          phone: row.customer_phone || '',
        },
        shippingAddress: row.shipping_address || {
          houseNo: row.house_no || '',
          street: row.street || '',
          city: row.city || '',
          state: row.state || '',
          pinCode: row.pincode || '',
        },
        paymentMethod: row.payment_method || 'upi',
        paymentDetails: row.payment_details,
        estimatedDeliveryDate: row.estimated_delivery_date || 'In 3-4 Business Days',
        status: row.status || 'Confirmed',
      } as Order;
    });
  } catch (err) {
    console.error('[Supabase] Error fetching orders:', err);
    return null;
  }
}

/**
 * Update order status in Supabase
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  newStatus: Order['status']
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.warn('[Supabase] Error updating order status in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Exception updating order status in Supabase:', err);
    return false;
  }
}
