/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, Landmark, Truck, CheckCircle, Loader2, Sparkles, ReceiptText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, ShippingAddress, PaymentMethod, User, Order } from '../types';
import { saveOrder } from '../utils/orders';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountAmount: number;
  couponCode: string;
  onOrderSuccess: () => void;
  currentUser?: User | null;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  couponCode,
  onOrderSuccess,
  currentUser,
}: CheckoutModalProps) {
  // Shipping form state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    phone: currentUser?.phone || '',
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser, isOpen]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Checkout result states
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => acc + (item.itemPrice ?? item.product.price) * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const isShippingFree = subtotal - discountAmount > 1500 || couponCode === 'BLACK20' || couponCode === 'RANA20';
  const shippingCharge = subtotal === 0 ? 0 : isShippingFree ? 0 : 150;
  const grandTotal = subtotal - discountAmount + gstAmount + shippingCharge;

  // Form submission handler
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.zipCode || !address.phone) {
      alert('Please fill out all delivery fields first.');
      return;
    }

    const recordOrder = (id: string, method: PaymentMethod, details: string) => {
      const newOrder: Order = {
        id,
        createdAt: new Date().toISOString(),
        items: cartItems,
        subtotal,
        discountAmount,
        couponCode: couponCode || undefined,
        gstAmount,
        shippingCharge,
        deliveryOption: 'standard',
        totalAmount: grandTotal,
        customerInfo: {
          fullName: address.fullName,
          email: currentUser?.email || 'customer@ranaluxury.com',
          phone: address.phone,
        },
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          houseNo: address.addressLine1 || '',
          street: address.addressLine2 || address.addressLine1 || '',
          city: address.city,
          state: address.state,
          pinCode: address.zipCode || '',
        },
        paymentMethod: method,
        paymentDetails: details,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
        status: 'Confirmed',
      };
      saveOrder(newOrder);
    };

    if (paymentMethod === 'cod') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const generatedId = `RANA-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedId);
        recordOrder(generatedId, 'cod', 'Cash on Delivery (Pending)');
        setIsCompleted(true);
      }, 1400);
    } else {
      setRazorpayMethod(paymentMethod === 'upi' ? 'upi' : 'card');
      setShowRazorpay(true);
    }
  };

  const handleRazorpayPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowRazorpay(false);
      const generatedId = `RANA-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      const details =
        razorpayMethod === 'upi' ? `UPI (${upiId || 'Verified'})` : `Card ending in •••• ${cardNumber.slice(-4) || '4242'}`;
      const newOrder: Order = {
        id: generatedId,
        createdAt: new Date().toISOString(),
        items: cartItems,
        subtotal,
        discountAmount,
        couponCode: couponCode || undefined,
        gstAmount,
        shippingCharge,
        deliveryOption: 'standard',
        totalAmount: grandTotal,
        customerInfo: {
          fullName: address.fullName,
          email: currentUser?.email || 'customer@ranaluxury.com',
          phone: address.phone,
        },
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          houseNo: address.addressLine1 || '',
          street: address.addressLine2 || address.addressLine1 || '',
          city: address.city,
          state: address.state,
          pinCode: address.zipCode || '',
        },
        paymentMethod: razorpayMethod,
        paymentDetails: details,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
        status: 'Confirmed',
      };
      saveOrder(newOrder);
      setIsCompleted(true);
    }, 1500);
  };

  const handleFinish = () => {
    onOrderSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#0D0D0D] border border-[#242424] max-w-4xl w-full p-6 sm:p-8 z-10 text-[#F5F5F5] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        {!isCompleted && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-[#141414] hover:bg-white hover:text-black text-white border border-[#2B2B2B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        {!isCompleted && (
          <div className="mb-8 border-b border-[#1A1A1A] pb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#888888] font-medium block mb-1">
              Secure Haute Parfumerie Gateway
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-white">
              Complete Your Order
            </h2>
          </div>
        )}

        {/* If the order is successfully placed */}
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 flex flex-col items-center gap-5"
          >
            <div className="p-4 bg-[#141414] border border-[#2A2A2A] text-white">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-white">
              Fragrance Secured
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#A3A3A3] max-w-md leading-relaxed font-light">
              Your luxury order is currently being prepared in our private cellars. Digital invoice and tracking credentials have been generated.
            </p>

            {/* Receipt card */}
            <div className="w-full max-w-sm p-5 bg-[#121212] border border-[#222222] space-y-3.5 text-left font-mono">
              <div className="flex justify-between text-xs border-b border-[#1C1C1C] pb-2.5">
                <span className="text-[#737373]">Tracking ID</span>
                <span className="text-white font-semibold">{orderId}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#1C1C1C] pb-2.5">
                <span className="text-[#737373]">Recipient</span>
                <span className="text-white">{address.fullName}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#1C1C1C] pb-2.5">
                <span className="text-[#737373]">Total Charged</span>
                <span className="text-white font-semibold">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[#1C1C1C] pb-2.5">
                <span className="text-[#737373]">Expected Courier</span>
                <span className="text-white">Within 3 to 4 working days</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-[#737373]">Backend Sync</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Backend Connected
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="mt-4 px-8 py-3.5 bg-white hover:bg-[#E5E5E5] text-black text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer transition-colors"
            >
              Return to Boutique
            </button>
          </motion.div>
        ) : (
          /* Main Form Layout (2 columns) */
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form details (Column 1) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-4 flex items-center gap-2 font-mono">
                  <Truck className="w-4 h-4 text-white" />
                  1. Secure Shipping Destination
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-[9px] uppercase tracking-wider text-[#888888] mb-1.5 font-mono">
                      Recipient Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Vinay Partap"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#242424] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                    />
                  </div>

                  {/* Address Line */}
                  <div className="md:col-span-2">
                    <label className="block text-[9px] uppercase tracking-wider text-[#888888] mb-1.5 font-mono">
                      Delivery Address *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Suite / Street / Apartment"
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#242424] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#888888] mb-1.5 font-mono">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Mumbai / Delhi"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#242424] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#888888] mb-1.5 font-mono">
                      State *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Maharashtra"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#242424] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                    />
                  </div>

                  {/* Postal code */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#888888] mb-1.5 font-mono">
                      PIN Code *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="400001"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#242424] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#888888] mb-1.5 font-mono">
                      Contact Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#242424] text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#555555]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment selection */}
              <div className="pt-4 border-t border-[#1C1C1C]">
                <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-4 flex items-center gap-2 font-mono">
                  <CreditCard className="w-4 h-4 text-white" />
                  2. Payment Method
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 border text-center transition-all cursor-pointer font-mono text-[10px] uppercase tracking-wider ${
                      paymentMethod === 'upi'
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-[#121212] text-[#888888] border-[#242424] hover:border-[#444444]'
                    }`}
                  >
                    UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border text-center transition-all cursor-pointer font-mono text-[10px] uppercase tracking-wider ${
                      paymentMethod === 'card'
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-[#121212] text-[#888888] border-[#242424] hover:border-[#444444]'
                    }`}
                  >
                    Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 border text-center transition-all cursor-pointer font-mono text-[10px] uppercase tracking-wider ${
                      paymentMethod === 'cod'
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-[#121212] text-[#888888] border-[#242424] hover:border-[#444444]'
                    }`}
                  >
                    COD
                  </button>
                </div>
              </div>
            </div>

            {/* Order summary (Column 2) */}
            <div className="lg:col-span-5 bg-[#080808] border border-[#1E1E1E] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-4 font-mono">
                  Summary
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs font-mono">
                      <div className="truncate pr-2">
                        <span className="text-white block truncate">{item.product.name}</span>
                        <span className="text-[9px] text-[#737373]">
                          {item.selectedSize || '100ml'} × {item.quantity}
                        </span>
                      </div>
                      <span className="text-white shrink-0">
                        ₹{((item.itemPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-[#1C1C1C] space-y-2 text-xs font-mono text-[#8E8E93]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-white font-semibold">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-[#1C1C1C]">
                    <span>Total Amount</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Authorizing...
                    </span>
                  ) : (
                    <span>Authorize Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Razorpay Simulation Dialog */}
        {showRazorpay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#111111] border border-[#2B2B2B] max-w-md w-full p-6 text-white font-mono space-y-4"
            >
              <div className="flex justify-between items-center border-b border-[#222222] pb-3">
                <span className="text-xs uppercase tracking-widest text-[#A3A3A3]">Maison Secure Gateway</span>
                <button onClick={() => setShowRazorpay(false)} className="text-[#888888] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#CCCCCC]">
                Complete your authorization of ₹{grandTotal.toLocaleString('en-IN')}
              </p>

              <form onSubmit={handleRazorpayPayment} className="space-y-3">
                {razorpayMethod === 'upi' ? (
                  <div>
                    <label className="text-[10px] uppercase text-[#888888] block mb-1">Enter UPI VPA ID</label>
                    <input
                      required
                      type="text"
                      placeholder="username@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2E2E2E] text-xs text-white focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] uppercase text-[#888888] block mb-1">Card Number</label>
                      <input
                        required
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2E2E2E] text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="px-3 py-2 bg-[#0A0A0A] border border-[#2E2E2E] text-xs text-white focus:outline-none"
                      />
                      <input
                        required
                        type="password"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="px-3 py-2 bg-[#0A0A0A] border border-[#2E2E2E] text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors mt-2"
                >
                  {isProcessing ? 'Processing Transaction...' : 'Pay Securely'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
