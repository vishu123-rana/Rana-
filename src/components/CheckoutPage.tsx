/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Landmark,
  Truck,
  Sparkles,
  ShoppingBag,
  Tag,
  Check,
  AlertCircle,
  Clock,
  Lock,
  User as UserIcon,
  MapPin,
  X,
} from 'lucide-react';
import { CartItem, DeliveryOptionId, PaymentMethod, User, Order } from '../types';
import { saveOrder } from '../utils/orders';
import { validateCoupon } from '../utils/discounts';

interface CheckoutPageProps {
  cartItems: CartItem[];
  currentUser?: User | null;
  initialDiscountAmount?: number;
  initialCouponCode?: string;
  onBackToStore: () => void;
  onOrderPlaced: (order: Order) => void;
}

export default function CheckoutPage({
  cartItems,
  currentUser,
  initialDiscountAmount = 0,
  initialCouponCode = '',
  onBackToStore,
  onOrderPlaced,
}: CheckoutPageProps) {
  // Customer Info State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Shipping Address State
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Delivery Option State
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionId>('standard');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'vpa'>('gpay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Coupon Code State
  const [couponCode, setCouponCode] = useState(initialCouponCode);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(
    initialCouponCode ? initialCouponCode : null
  );
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(
    initialCouponCode === 'BLACK20' || initialCouponCode === 'RANA20' ? 20 : 0
  );
  const [couponFlatDiscount, setCouponFlatDiscount] = useState<number>(
    initialCouponCode === 'WELCOME500' ? 500 : 0
  );
  const [couponError, setCouponError] = useState<string | null>(null);

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync current user info when loaded
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.itemPrice ?? item.product.price) * item.quantity,
    0
  );

  let calculatedDiscount = 0;
  if (couponFlatDiscount > 0) {
    calculatedDiscount = Math.min(couponFlatDiscount, subtotal);
  } else if (couponDiscountPercent > 0) {
    calculatedDiscount = Math.round(subtotal * (couponDiscountPercent / 100));
  } else if (initialDiscountAmount > 0) {
    calculatedDiscount = initialDiscountAmount;
  }

  const gstAmount = Math.round((subtotal - calculatedDiscount) * 0.18);
  const isFreeStandardShipping = subtotal - calculatedDiscount >= 1500;
  const standardShippingCost = isFreeStandardShipping ? 0 : 99;
  const expressShippingCost = 250;
  const shippingCharge =
    deliveryOption === 'express' ? expressShippingCost : standardShippingCost;

  const grandTotal = Math.max(0, subtotal - calculatedDiscount + gstAmount + shippingCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a privilege code.');
      return;
    }

    const result = validateCoupon(code, subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon.code);
      if (result.coupon.type === 'percentage') {
        setCouponDiscountPercent(result.coupon.discountValue);
        setCouponFlatDiscount(0);
      } else {
        setCouponFlatDiscount(result.coupon.discountValue);
        setCouponDiscountPercent(0);
      }
      setCouponError(null);
    } else {
      setCouponError(result.error || 'Invalid privilege code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setCouponFlatDiscount(0);
    setCouponCode('');
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!phone.trim()) {
      errs.phone = 'Contact number is required';
    } else if (!/^[0-9+ -]{10,14}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit number';
    }

    if (!houseNo.trim()) errs.houseNo = 'House / Flat / Suite number is required';
    if (!street.trim()) errs.street = 'Street address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State / Province is required';
    if (!pinCode.trim()) {
      errs.pinCode = 'Postal PIN code is required';
    } else if (!/^[0-9]{6}$/.test(pinCode.trim())) {
      errs.pinCode = 'PIN code must be 6 digits';
    }

    if (paymentMethod === 'upi') {
      if (upiApp === 'vpa' && !upiId.trim()) {
        errs.upiId = 'Please enter your UPI VPA ID';
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        errs.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!cardName.trim()) errs.cardName = 'Name on card is required';
      if (!cardExpiry.trim()) errs.cardExpiry = 'Expiry date (MM/YY) is required';
      if (!cardCvv.trim() || cardCvv.length < 3) errs.cardCvv = 'Valid CVV is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const generatedOrderId = `RANA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: generatedOrderId,
      createdAt: new Date().toISOString(),
      items: cartItems,
      subtotal,
      discountAmount: calculatedDiscount,
      couponCode: appliedCoupon || undefined,
      gstAmount,
      shippingCharge,
      deliveryOption,
      totalAmount: grandTotal,
      customerInfo: {
        fullName,
        email,
        phone,
      },
      shippingAddress: {
        houseNo,
        street,
        city,
        state,
        pinCode,
      },
      paymentMethod,
      paymentDetails: paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Prepaid (Authorized)',
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
      status: 'Confirmed',
    };

    saveOrder(newOrder);

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 1200);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5] py-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="p-5 bg-[#0D0D0D] border border-[#222222] mb-4">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-serif text-3xl font-light text-white mb-2">Your Bag is Empty</h2>
        <p className="font-mono text-xs text-[#8E8E93] max-w-sm mb-6">
          Please add your preferred luxury fragrances to your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={onBackToStore}
          className="py-3 px-8 bg-white text-black hover:bg-[#E5E5E5] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#1F1F1F] py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#A3A3A3] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-white block leading-none">
              RANA
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#737373] block mt-0.5">
              Secure Checkout
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#737373]">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="mb-8 pb-6 border-b border-[#1A1A1A]">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888888] font-medium block mb-1">
            Order Placement
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-white">
            Delivery & Payment Details
          </h1>
        </div>

        {/* Global Error Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-8 p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-1">Please correct the highlighted fields:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-300">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. CUSTOMER INFORMATION */}
            <section className="bg-[#0C0C0C] border border-[#1E1E1E] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-white" />
                  <h2 className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
                    1. Customer Information
                  </h2>
                </div>
                {currentUser && (
                  <span className="font-mono text-[9px] bg-[#141414] text-[#A3A3A3] px-2 py-0.5 border border-[#262626]">
                    Logged in as {currentUser.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="Lord / Lady ..."
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.fullName ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.fullName}</span>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="connoisseur@rana.luxury"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.email}</span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    Contact Phone (For Courier Dispatch) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.phone ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.phone}</span>
                  )}
                </div>
              </div>
            </section>

            {/* 2. SHIPPING ADDRESS */}
            <section className="bg-[#0C0C0C] border border-[#1E1E1E] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-4">
                <MapPin className="w-4 h-4 text-white" />
                <h2 className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
                  2. Shipping Destination
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    House / Flat / Suite / Villa *
                  </label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => {
                      setHouseNo(e.target.value);
                      if (errors.houseNo) setErrors((prev) => ({ ...prev, houseNo: '' }));
                    }}
                    placeholder="Suite 401, Royal Crescent"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.houseNo ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.houseNo && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.houseNo}</span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value);
                      if (errors.street) setErrors((prev) => ({ ...prev, street: '' }));
                    }}
                    placeholder="Marine Drive, Nariman Point"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.street ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.street && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.street}</span>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    placeholder="Mumbai / New Delhi"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.city ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.city && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
                    }}
                    placeholder="Maharashtra"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.state ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.state && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.state}</span>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => {
                      setPinCode(e.target.value.replace(/\D/g, ''));
                      if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: '' }));
                    }}
                    placeholder="400021"
                    className={`w-full px-3.5 py-2.5 bg-[#121212] border text-xs font-mono text-white focus:outline-none ${
                      errors.pinCode ? 'border-red-500' : 'border-[#262626] focus:border-white'
                    }`}
                  />
                  {errors.pinCode && (
                    <span className="text-[10px] font-mono text-red-400 mt-1 block">{errors.pinCode}</span>
                  )}
                </div>
              </div>
            </section>

            {/* 3. PAYMENT METHOD */}
            <section className="bg-[#0C0C0C] border border-[#1E1E1E] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-4">
                <CreditCard className="w-4 h-4 text-white" />
                <h2 className="font-mono text-xs uppercase tracking-wider font-semibold text-white">
                  3. Payment Method
                </h2>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR' },
                  { id: 'card', label: 'Credit / Debit' },
                  { id: 'net_banking', label: 'Net Banking' },
                  { id: 'cod', label: 'Cash on Delivery' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`py-3 px-2 border text-center font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-[#121212] text-[#888888] border-[#242424] hover:border-[#444444] hover:text-white'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Details */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-[#121212] border border-[#222222] space-y-3 font-mono text-xs">
                  <span className="text-white block font-semibold">Instant UPI Payment</span>
                  <p className="text-[#8E8E93] text-[11px]">
                    Scan QR or approve payment request on your UPI app (Google Pay, PhonePe, Paytm, CRED).
                  </p>
                  <input
                    type="text"
                    placeholder="yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-white focus:outline-none focus:border-white"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#121212] border border-[#222222] space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[#888888] text-[10px] uppercase mb-1">Card Number *</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#888888] text-[10px] uppercase mb-1">Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-white focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888888] text-[10px] uppercase mb-1">CVV *</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'net_banking' && (
                <div className="p-4 bg-[#121212] border border-[#222222] space-y-2 font-mono text-xs">
                  <label className="block text-[#888888] text-[10px] uppercase">Select Financial Institution:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-white focus:outline-none"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#121212] border border-[#222222] font-mono text-xs space-y-1">
                  <span className="font-semibold text-white block">Cash / UPI on Delivery</span>
                  <p className="text-[#8E8E93] text-[11px]">
                    Pay seamlessly upon courier delivery to your residential or office address.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary & Placement (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-[#0C0C0C] border border-[#1E1E1E] p-6 md:p-8 space-y-6">
              <h2 className="font-serif text-2xl font-light text-white border-b border-[#1A1A1A] pb-4">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 p-2.5 bg-[#121212] border border-[#1F1F1F]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-12 bg-[#070707] border border-[#1C1C1C] overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-serif text-xs font-normal text-white block truncate">
                          {item.product.name}
                        </span>
                        <span className="font-mono text-[9px] text-[#737373] block">
                          {item.selectedSize || '100ml'} · Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white shrink-0">
                      ₹{((item.itemPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="border-t border-b border-[#1A1A1A] py-4 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#888888] block">
                  Privilege Code
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-[#282828] text-xs font-mono">
                    <span className="text-white font-semibold">{appliedCoupon} Applied</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[#888888] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BLACK20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#121212] border border-[#262626] text-xs font-mono text-white placeholder-[#555555] focus:outline-none focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#2E2E2E] font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <span className="text-[10px] font-mono text-red-400 block">{couponError}</span>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 font-mono text-xs text-[#8E8E93]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {calculatedDiscount > 0 && (
                  <div className="flex justify-between text-white font-semibold">
                    <span>Privilege Discount</span>
                    <span>-₹{calculatedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (18% duty)</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Courier</span>
                  <span>{shippingCharge === 0 ? 'Complimentary' : `₹${shippingCharge}`}</span>
                </div>

                <div className="flex justify-between border-t border-[#1C1C1C] pt-3 text-base font-semibold text-white">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isSubmitting ? (
                  <span>Processing Flacon Order...</span>
                ) : (
                  <>
                    <span>Place Order</span>
                    <span>|</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 font-mono text-[9px] text-[#666666]">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Maison Certified Authentic · Insured Delivery</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
