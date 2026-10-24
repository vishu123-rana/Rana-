/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: 'admin' | 'customer';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  location?: string;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export type PerfumeCategory = 'Men' | 'Women' | 'Unisex' | 'Oud' | 'Premium' | 'Gift Sets';
export type PerfumeGender = 'men' | 'women' | 'unisex';
export type PerfumeSize = '20ml' | '50ml' | '100ml';

export interface PerfumeSizes {
  '20ml': number;
  '50ml': number;
  '100ml': number;
}

export interface Perfume {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  gender: PerfumeGender;
  category: PerfumeCategory;
  rating: number;
  notes: FragranceNotes;
  ingredients: string[];
  description: string;
  bestSeller?: boolean;
  featured?: boolean;
  image?: string;
  stock?: number;
  sizes?: PerfumeSizes;
  selectedSize?: PerfumeSize;
  longevity?: string;
  accord?: string;
  isActive?: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  benefits: string;
  family: 'Citrus' | 'Floral' | 'Woody' | 'Amber' | 'Fresh' | 'Spicy';
  color: string; // Hex color representing the ingredient aesthetic
}

export interface CartItem {
  product: Perfume;
  quantity: number;
  selectedSize?: PerfumeSize;
  itemPrice?: number;
}

export interface ShippingAddress {
  fullName: string;
  email?: string;
  phone: string;
  houseNo?: string;
  street?: string;
  city: string;
  state: string;
  pinCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
}

export type DeliveryOptionId = 'standard' | 'express';

export interface DeliveryOption {
  id: DeliveryOptionId;
  title: string;
  duration: string;
  price: number;
}

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'cod';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Preparing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  gstAmount: number;
  shippingCharge: number;
  deliveryOption: DeliveryOptionId;
  totalAmount: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullName?: string;
    phone?: string;
    houseNo: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
    addressLine1?: string;
    addressLine2?: string;
    zipCode?: string;
  };
  paymentMethod: PaymentMethod;
  paymentDetails?: string;
  estimatedDeliveryDate: string;
  status: OrderStatus;
}
