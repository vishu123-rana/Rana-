/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
  onViewMyOrders: () => void;
}

export default function OrderConfirmationPage({
  order,
  onContinueShopping,
  onViewMyOrders,
}: OrderConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] py-16 px-6 md:px-12 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0C0C0C] border border-[#1E1E1E] p-8 md:p-12 text-center space-y-4 relative overflow-hidden shadow-2xl"
        >
          <div className="w-14 h-14 bg-[#141414] text-white border border-[#262626] mx-auto flex items-center justify-center shadow-md mb-2">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#888888] font-medium block">
            Maison Order Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-light text-white">
            Thank You for Your Patronage
          </h1>

          <p className="font-mono text-xs text-[#8E8E93] max-w-lg mx-auto leading-relaxed">
            Your flacon requisition <span className="text-white font-semibold">{order.id}</span> is now being prepared in our private cellars for secured courier dispatch.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-[#121212] px-3.5 py-1.5 border border-[#242424]">
              <Calendar className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-[#CCCCCC]">Estimated Delivery: {order.estimatedDeliveryDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#121212] px-3.5 py-1.5 border border-[#242424]">
              <Truck className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-[#CCCCCC]">Status: {order.status}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Details & Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Purchased Items List (7 cols) */}
          <div className="md:col-span-7 bg-[#0C0C0C] border border-[#1E1E1E] p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-4">
              <ShoppingBag className="w-4 h-4 text-white" />
              <h2 className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
                Selected Flacons ({order.items.length})
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item, idx) => {
                const price = item.itemPrice ?? item.product.price;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 bg-[#111111] border border-[#222222]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 bg-[#070707] border border-[#1C1C1C] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                      <div className="truncate">
                        <h3 className="font-serif text-sm font-normal text-white truncate">
                          {item.product.name}
                        </h3>
                        <p className="font-mono text-[9px] text-[#737373]">
                          {item.selectedSize || '100ml'} · Qty: {item.quantity} × ₹{price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white shrink-0">
                      ₹{(price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-[#1C1C1C] space-y-2 font-mono text-xs text-[#8E8E93]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-white font-semibold">
                  <span>Privilege Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (18% duty)</span>
                <span>₹{order.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier</span>
                <span>{order.shippingCharge === 0 ? 'Complimentary' : `₹${order.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#1C1C1C]">
                <span>Total Amount Paid</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Destination & Actions (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery Destination */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-3">
                <MapPin className="w-4 h-4 text-white" />
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
                  Destination
                </h3>
              </div>

              <div className="font-mono text-xs text-[#A3A3A3] space-y-1">
                <p className="text-white font-serif text-sm">{order.customerInfo.fullName}</p>
                <p>{order.shippingAddress.houseNo}, {order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                <p className="pt-2 text-[11px] text-[#737373]">Contact: {order.customerInfo.phone}</p>
                <p className="text-[11px] text-[#737373]">Email: {order.customerInfo.email}</p>
              </div>
            </div>

            {/* Payment & Security */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-6 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-3">
                <Receipt className="w-4 h-4 text-white" />
                <h3 className="uppercase tracking-wider font-semibold text-white text-[11px]">
                  Payment Verification
                </h3>
              </div>
              <div className="flex justify-between text-[#8E8E93]">
                <span>Method</span>
                <span className="text-white uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#8E8E93]">
                <span>Status</span>
                <span className="text-white capitalize">{order.paymentDetails || 'Authorized'}</span>
              </div>
              <div className="flex justify-between items-center text-[#8E8E93] border-t border-[#1C1C1C] pt-2 text-[10px]">
                <span>Backend Database</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Live Sync
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onViewMyOrders}
                className="w-full py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <PackageCheck className="w-4 h-4" />
                <span>View Order History</span>
              </button>

              <button
                onClick={onContinueShopping}
                className="w-full py-3 bg-[#111111] hover:bg-[#1A1A1A] text-[#CCCCCC] hover:text-white border border-[#242424] font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Exploring Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
