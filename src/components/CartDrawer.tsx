/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Check, Plus, Minus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Perfume } from '../types';
import { perfumes } from '../data/perfumes';
import { validateCoupon } from '../utils/discounts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (pId: string, newQty: number, size?: string) => void;
  onRemoveItem: (pId: string, size?: string) => void;
  onCheckout: (discountAmount: number, activeCoupon: string) => void;
  onAddRecommended?: (perfume: Perfume) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onAddRecommended,
}: CartDrawerProps) {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.itemPrice ?? item.product.price) * item.quantity,
    0
  );

  const calculatedDiscount =
    flatDiscount > 0 ? Math.min(flatDiscount, subtotal) : Math.round(subtotal * (discountPercent / 100));

  const gstRate = 0.18;
  const gstAmount = Math.round((subtotal - calculatedDiscount) * gstRate);

  const isShippingFree = subtotal - calculatedDiscount > 1500;
  const shippingCharge = subtotal === 0 ? 0 : isShippingFree ? 0 : 150;

  const grandTotal = Math.max(0, subtotal - calculatedDiscount + gstAmount + shippingCharge);

  const cartIds = cartItems.map((item) => item.product.id);
  const recommendedItems = perfumes.filter((p) => !cartIds.includes(p.id)).slice(0, 2);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a promotion code.');
      return;
    }

    const res = validateCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon.code);
      if (res.coupon.type === 'percentage') {
        setDiscountPercent(res.coupon.discountValue);
        setFlatDiscount(0);
      } else {
        setFlatDiscount(res.coupon.discountValue);
        setDiscountPercent(0);
      }
      setCoupon('');
      setCouponError(null);
    } else {
      setCouponError(res.error || 'Invalid promotion code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setFlatDiscount(0);
    setCouponError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000000]/75 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="w-screen max-w-md bg-[#0D0D0D] border-l border-[#222222] shadow-2xl flex flex-col justify-between text-[#F5F5F5]"
          >
            {/* 1. CART HEADER */}
            <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between bg-[#0A0A0A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#141414] border border-[#242424] flex items-center justify-center text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-light text-white">
                    Your Shopping Bag
                  </h3>
                  <p className="font-mono text-[10px] text-[#737373]">
                    {cartItems.length} {cartItems.length === 1 ? 'Flacon' : 'Flacons'} Selected
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#737373] hover:text-white transition-colors cursor-pointer"
                title="Close Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress alert */}
            <div className="px-6 py-2.5 bg-[#121212] border-b border-[#1F1F1F] text-[10px] font-mono flex items-center justify-between text-[#A3A3A3]">
              <span>Complimentary Courier (Orders &gt; ₹1,500)</span>
              <span className="font-semibold text-white">
                {subtotal > 1500 ? 'Unlocked' : `Add ₹${1500 - subtotal} more`}
              </span>
            </div>

            {/* 2. CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-[#737373]">
                  <ShoppingBag className="w-12 h-12 stroke-[1] text-[#333333]" />
                  <p className="font-serif text-lg text-white font-light">Your Bag Is Empty</p>
                  <p className="font-sans text-xs max-w-xs font-light text-[#8E8E93]">
                    Explore our private archive collections to discover your signature sillage.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer"
                  >
                    CONTINUE EXPLORING
                  </button>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => {
                    const size = item.selectedSize || '100ml';
                    const unitPrice = item.itemPrice ?? item.product.price;

                    return (
                      <motion.div
                        layout
                        key={`${item.product.id}-${size}`}
                        className="p-3.5 bg-[#121212] border border-[#222222] flex gap-3.5 relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-20 bg-[#070707] border border-[#1A1A1A] flex items-center justify-center p-2 shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="max-h-full w-auto object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif text-sm font-normal text-white truncate">
                                {item.product.name}
                              </h4>
                              <p className="font-mono text-[9px] text-[#737373] uppercase">
                                {size} · {item.product.category}
                              </p>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.product.id, size)}
                              className="text-[#666666] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                              title="Remove Flacon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1C1C1C]">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-[#070707] border border-[#262626]">
                              <button
                                onClick={() => onUpdateQty(item.product.id, item.quantity - 1, size)}
                                className="p-1 text-[#888888] hover:text-white cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-semibold px-2.5 text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQty(item.product.id, item.quantity + 1, size)}
                                className="p-1 text-[#888888] hover:text-white cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-mono text-sm font-semibold text-white">
                              ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* RECOMMENDATIONS */}
                  {recommendedItems.length > 0 && (
                    <div className="pt-4 border-t border-[#1C1C1C]">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#888888]">
                          Recommended Additions
                        </span>
                      </div>
                      <div className="space-y-2">
                        {recommendedItems.map((rec) => (
                          <div
                            key={rec.id}
                            className="p-2.5 bg-[#121212] border border-[#222222] flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={rec.image} alt={rec.name} className="w-9 h-9 object-contain shrink-0" />
                              <div className="min-w-0">
                                <h5 className="font-serif text-xs text-white truncate font-light">
                                  {rec.name}
                                </h5>
                                <span className="font-mono text-[9px] text-[#737373]">
                                  ₹{rec.price.toLocaleString('en-IN')} · {rec.category}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (onAddRecommended) onAddRecommended(rec);
                              }}
                              className="px-3 py-1 bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#2E2E2E] text-[9px] font-mono uppercase tracking-wider text-white shrink-0 cursor-pointer transition-colors"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 3. CART FOOTER */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-[#0A0A0A] border-t border-[#1F1F1F] space-y-4">
                {/* Coupon Code Input */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-[#262626] text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-white font-semibold">
                      <Check className="w-3.5 h-3.5 text-white" />
                      Privilege "{appliedCoupon}" ({discountPercent}% OFF)
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[#888888] hover:text-white text-[10px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Privilege code (e.g. BLACK20)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#121212] border border-[#262626] text-xs font-mono text-white placeholder-[#555555] outline-none focus:border-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-white transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] font-mono text-rose-400">{couponError}</p>
                )}

                {/* Subtotal Breakdown */}
                <div className="space-y-1.5 text-xs font-mono text-[#8E8E93] pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {calculatedDiscount > 0 && (
                    <div className="flex justify-between text-white font-semibold">
                      <span>Privilege Discount {discountPercent > 0 ? `(${discountPercent}%)` : ''}</span>
                      <span>-₹{calculatedDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST (18% fine fragrance duty)</span>
                    <span className="text-[#CCCCCC]">₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Express Secured Delivery</span>
                    <span>{shippingCharge === 0 ? 'Complimentary' : `₹${shippingCharge}`}</span>
                  </div>

                  <div className="flex justify-between text-base font-semibold font-mono text-white pt-2 border-t border-[#1C1C1C]">
                    <span>Estimated Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => onCheckout(calculatedDiscount, appliedCoupon || '')}
                    className="w-full py-3.5 px-4 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 bg-transparent hover:bg-[#141414] text-[#A3A3A3] hover:text-white border border-[#262626] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>

                <p className="text-[9px] font-mono text-center text-[#666666] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>256-Bit Encrypted Indian Banking Gateway</span>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
