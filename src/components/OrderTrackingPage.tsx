/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  PackageCheck,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  X,
  Receipt,
  FileText,
  ShoppingBag,
  Building2,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getOrderById, getStoredOrders } from '../utils/orders';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  onBackToStore: () => void;
  onViewMyOrders: () => void;
}

export default function OrderTrackingPage({
  initialOrderId = '',
  onBackToStore,
  onViewMyOrders,
}: OrderTrackingPageProps) {
  const [searchId, setSearchId] = useState<string>(initialOrderId);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(!!initialOrderId);
  const [copied, setCopied] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    const orders = getStoredOrders();
    setAllOrders(orders);

    if (initialOrderId) {
      const found = getOrderById(initialOrderId);
      if (found) {
        setCurrentOrder(found);
      } else if (orders.length > 0) {
        setCurrentOrder(orders[0]);
        setSearchId(orders[0].id);
      }
    } else if (orders.length > 0) {
      setCurrentOrder(orders[0]);
      setSearchId(orders[0].id);
      setHasSearched(true);
    }
  }, [initialOrderId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;
    setHasSearched(true);
    const found = getOrderById(searchId.trim());
    setCurrentOrder(found);
  };

  const handleCopyTracking = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to map order status to step numbers (1 to 4)
  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
      case 'Preparing':
      case 'Confirmed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 3.5;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = currentOrder ? getStepProgress(currentOrder.status) : 1;

  const steps = [
    {
      step: 1,
      title: 'Order Placed',
      description: 'Order confirmed and payment verified',
      icon: PackageCheck,
    },
    {
      step: 2,
      title: 'Processing',
      description: 'Fragrance maturation & luxury packaging',
      icon: Clock,
    },
    {
      step: 3,
      title: 'Shipped',
      description: 'In transit with courier partner',
      icon: Truck,
    },
    {
      step: 4,
      title: 'Delivered',
      description: 'Arrived safely at destination',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] pb-24 select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-[#181818] py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-2xl font-light tracking-[0.2em] text-white block leading-none">
              RANA
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#888888] font-medium block mt-1">
              Live Order Tracking
            </span>
          </div>

          <button
            onClick={onViewMyOrders}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#A3A3A3] hover:text-white transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">My Orders</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-10 space-y-8">
        
        {/* Title & Search Bar */}
        <div className="bg-[#0B0B0B] border border-[#1E1E1E] p-8 space-y-6 text-center">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#888888] font-medium block mb-1">
              DISPATCH VERIFICATION
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-white">
              Track Your Fragrance
            </h1>
            <p className="font-sans text-xs text-[#888888] max-w-md mx-auto mt-2 font-light">
              Enter your official Order ID to view live dispatch milestones, courier tracking number, and estimated arrival date.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#777777] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. RANA-2026-849201"
                className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#242424] focus:border-white outline-none font-mono text-xs text-white placeholder:text-[#555555] uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-8 bg-white text-black hover:bg-[#E5E5E5] font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer shrink-0"
            >
              Track Order
            </button>
          </form>

          {/* Sample Chips */}
          {allOrders.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
              <span className="text-[#666666] uppercase">Quick Sample IDs:</span>
              {allOrders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchId(o.id);
                    setCurrentOrder(o);
                    setHasSearched(true);
                  }}
                  className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                    currentOrder?.id === o.id
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-[#121212] text-[#888888] border-[#242424] hover:text-white'
                  }`}
                >
                  {o.id}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ORDER TRACKING RESULT CONTENT */}
        {currentOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Top Status Summary Banner */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#888888] font-mono text-xs uppercase tracking-widest">
                  <Receipt className="w-4 h-4 text-white" />
                  <span>Order ID: {currentOrder.id}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-light">
                  Status: <span className="text-white font-normal">{currentOrder.status}</span>
                </h2>
                <p className="font-mono text-xs text-[#737373]">
                  Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-[#141414] border border-[#242424] p-4 font-mono text-xs space-y-1 min-w-[220px]">
                <span className="text-[#888888] uppercase tracking-wider block text-[10px]">
                  Estimated Delivery Date
                </span>
                <p className="text-white font-semibold text-sm">
                  {currentOrder.estimatedDeliveryDate}
                </p>
                <p className="text-[#737373] text-[11px] pt-1 flex items-center justify-between">
                  <span>Courier: Secured Express</span>
                  <button
                    onClick={() => handleCopyTracking('BD-920491820')}
                    className="hover:text-white cursor-pointer inline-flex items-center gap-1 font-semibold text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Track #'}</span>
                  </button>
                </p>
              </div>
            </div>

            {/* PROGRESS TRACKER BAR */}
            <div className="bg-[#0B0B0B] border border-[#1E1E1E] p-6 md:p-10 space-y-8">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
                <h3 className="font-serif text-xl font-light text-white">
                  Dispatch Progress Tracker
                </h3>
                <span className="font-mono text-xs text-[#888888] uppercase tracking-wider">
                  Step {Math.floor(currentStep)} of 4
                </span>
              </div>

              {/* Graphical Step Bar */}
              <div className="relative py-4">
                {/* Horizontal Progress Line Background */}
                <div className="hidden md:block absolute top-1/2 left-8 right-8 h-[1px] bg-[#222222] -translate-y-1/2 z-0" />
                {/* Active Progress Line */}
                <div
                  className="hidden md:block absolute top-1/2 left-8 h-[1px] bg-white -translate-y-1/2 z-0 transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 3) * 100))}%`,
                  }}
                />

                {/* Steps Nodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                  {steps.map((step) => {
                    const isPassed = currentStep >= step.step;
                    const isCurrent = Math.floor(currentStep) === step.step;
                    const IconComponent = step.icon;

                    return (
                      <div
                        key={step.step}
                        className="flex md:flex-col items-center md:text-center gap-4 md:gap-3"
                      >
                        {/* Node Icon Circle */}
                        <div
                          className={`w-12 h-12 flex items-center justify-center shrink-0 border transition-all ${
                            isPassed
                              ? 'bg-white text-black border-white'
                              : 'bg-[#111111] text-[#666666] border-[#222222]'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Title & Desc */}
                        <div className="min-w-0">
                          <h4
                            className={`font-mono text-xs uppercase tracking-wider font-semibold ${
                              isPassed ? 'text-white' : 'text-[#666666]'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="font-sans text-[11px] text-[#737373] mt-0.5 leading-tight font-light">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking Log Timeline */}
              <div className="pt-6 border-t border-[#1A1A1A] space-y-4 font-mono text-xs">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white">
                  Dispatch Activity Log
                </h4>

                <div className="space-y-3 pl-2 border-l border-white/40">
                  <div className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[17px] top-1.5 w-2 h-2 bg-white rounded-full" />
                    <span className="text-white font-semibold">Current Milestone: {currentOrder.status}</span>
                    <p className="text-[#737373] text-[11px]">
                      Package processed at Private Atelier Dispatch Facility. Inspection passed.
                    </p>
                  </div>

                  <div className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[17px] top-1.5 w-2 h-2 bg-[#555555] rounded-full" />
                    <span className="text-[#A3A3A3]">Order Received & Maturation Lock</span>
                    <p className="text-[#666666] text-[11px]">
                      Payment verified via {currentOrder.paymentMethod.toUpperCase()}. Fragrance hand-bottled in black lacquer box.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ORDER ITEMS & ADDRESS BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Items Summary (7 cols) */}
              <div className="md:col-span-7 bg-[#0B0B0B] border border-[#1E1E1E] p-6 space-y-4">
                <h3 className="font-serif text-lg font-light text-white border-b border-[#1A1A1A] pb-3">
                  Ordered Items ({currentOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h3>

                <div className="space-y-3">
                  {currentOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-4 p-3 bg-[#111111] border border-[#1F1F1F]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-16 bg-[#070707] shrink-0 border border-[#222222] p-1 flex items-center justify-center overflow-hidden">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="max-h-full w-auto object-contain"
                            />
                          ) : (
                            <div className="text-white font-serif">
                              R
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <h4 className="font-serif text-sm font-light text-white truncate">
                            {item.product.name}
                          </h4>
                          <span className="font-mono text-[10px] text-[#737373] block">
                            Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-white shrink-0 font-medium">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#1A1A1A] flex justify-between font-serif text-base font-light text-white">
                  <span>Total Amount Paid</span>
                  <span>₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Right Shipping Info (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-[#0B0B0B] border border-[#1E1E1E] p-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-3 text-white uppercase font-medium">
                    <MapPin className="w-4 h-4 text-white" />
                    <span>Shipping Destination</span>
                  </div>
                  <p className="text-white font-semibold">{currentOrder.customerInfo.fullName}</p>
                  <p className="text-[#888888]">{currentOrder.shippingAddress.houseNo}, {currentOrder.shippingAddress.street}</p>
                  <p className="text-[#888888]">{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pinCode}</p>
                  <p className="text-[#666666] pt-1">Phone: {currentOrder.customerInfo.phone}</p>
                </div>

                <div className="bg-[#0B0B0B] border border-[#1E1E1E] p-6 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 border-b border-[#1A1A1A] pb-3 text-white uppercase font-medium">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Need Assistance?</span>
                  </div>
                  <p className="text-[#888888] leading-relaxed font-light">
                    Have questions about your order dispatch or delivery address change? Contact our concierge desk.
                  </p>
                  <p className="text-white pt-1">Email: concierge@ranaperfumes.com</p>
                </div>
              </div>

            </div>
          </motion.div>
        ) : hasSearched ? (
          <div className="bg-[#0B0B0B] border border-[#1E1E1E] p-12 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-[#888888] mx-auto" />
            <h3 className="font-serif text-2xl font-light text-white">Order Not Found</h3>
            <p className="font-sans text-xs text-[#737373] max-w-sm mx-auto font-light">
              We couldn't find an order matching "{searchId}". Please check the Order ID spelling and try again.
            </p>
          </div>
        ) : null}

        {/* BOTTOM NAV BUTTONS */}
        <div className="pt-6 border-t border-[#181818] flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBackToStore}
            className="w-full sm:w-auto py-3.5 px-8 bg-white text-black hover:bg-[#E5E5E5] font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={onViewMyOrders}
            className="w-full sm:w-auto py-3.5 px-8 bg-[#0E0E0E] text-[#A3A3A3] hover:text-white border border-[#242424] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>View All My Orders</span>
          </button>
        </div>

      </main>
    </div>
  );
}
