/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  PackageCheck,
  Calendar,
  MapPin,
  ShoppingBag,
  Clock,
  ChevronRight,
  Receipt,
  Truck,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Order } from '../types';
import { getStoredOrders } from '../utils/orders';

interface OrderHistoryPageProps {
  onBackToStore: () => void;
  onSelectOrder: (order: Order) => void;
  onTrackOrder?: (orderId: string) => void;
}

export default function OrderHistoryPage({
  onBackToStore,
  onSelectOrder,
  onTrackOrder,
}: OrderHistoryPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModalOrder, setSelectedModalOrder] = useState<Order | null>(null);

  useEffect(() => {
    const list = getStoredOrders();
    setOrders(list);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#141414] text-white border border-[#2E2E2E] font-mono text-[9px] uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-3 h-3 text-white" />
            {status}
          </span>
        );
      case 'shipped':
      case 'out-for-delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#141414] text-[#E5E5E5] border border-[#2E2E2E] font-mono text-[9px] uppercase tracking-wider font-semibold">
            <Truck className="w-3 h-3 text-[#CCCCCC]" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#111111] text-[#A3A3A3] border border-[#222222] font-mono text-[9px] uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#737373]" />
            {status}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === 'all' ||
      order.orderStatus.toLowerCase().replace(/\s+/g, '-') === activeTab;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.items.some((item) => item.perfumeName.toLowerCase().includes(query)) ||
      order.shippingAddress.city.toLowerCase().includes(query);

    return matchesTab && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] pb-24 select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#1F1F1F] py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-white block leading-none">
              RANA
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#737373] block mt-0.5">
              Client Purchases & Orders
            </span>
          </div>

          <div className="hidden sm:block font-mono text-xs text-[#737373]">
            <span>Orders Logged: {orders.length}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        
        {/* Title Section */}
        <div className="mb-8 pb-6 border-b border-[#1A1A1A] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#888888] font-medium block mb-1">
              Account Dashboard
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-white">
              My Orders
            </h1>
            <p className="font-sans text-xs text-[#8E8E93] font-light mt-1">
              Track active courier dispatches, view digital invoices, and review your signature fragrance acquisitions.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or Perfume..."
              className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#242424] focus:border-white outline-none font-mono text-xs text-white placeholder:text-[#555555] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none font-mono text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border transition-all cursor-pointer uppercase text-[10px] tracking-wider shrink-0 ${
                  isActive
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-[#111111] text-[#888888] border-[#222222] hover:border-[#383838] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-[#0C0C0C] border border-[#1E1E1E] space-y-4">
            <ShoppingBag className="w-10 h-10 text-[#444444] mx-auto stroke-[1]" />
            <h3 className="font-serif text-xl font-light text-white">No Orders Found</h3>
            <p className="font-mono text-xs text-[#737373] max-w-sm mx-auto">
              {searchQuery
                ? `No orders match query "${searchQuery}".`
                : 'You have not placed any orders under this category yet.'}
            </p>
            <button
              onClick={onBackToStore}
              className="py-2.5 px-6 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              Explore Fragrance Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0C0C0C] border border-[#1E1E1E] hover:border-[#333333] transition-all p-6 md:p-8"
              >
                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A1A1A] gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#737373] block">Order Identifier</span>
                    <span className="text-white font-semibold text-sm">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#737373] block">Placed On</span>
                    <span className="text-[#CCCCCC]">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#737373] block">Status</span>
                    <div>{getStatusBadge(order.orderStatus)}</div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#737373] block">Total Amount</span>
                    <span className="text-white font-semibold text-sm">₹{order.pricing.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-[#070707] border border-[#1C1C1C] p-1 flex items-center justify-center shrink-0">
                          <img src={item.image} alt={item.perfumeName} className="max-h-full w-auto object-contain" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-white font-light">{item.perfumeName}</h4>
                          <span className="font-mono text-[9px] text-[#737373]">
                            {item.selectedSize} · Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-white">
                        ₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <span className="text-[#737373] text-[11px]">
                    Destination: {order.shippingAddress.city}, {order.shippingAddress.state}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedModalOrder(order)}
                      className="px-4 py-2 border border-[#2E2E2E] bg-[#141414] hover:bg-white hover:text-black text-white transition-colors cursor-pointer"
                    >
                      View Invoice
                    </button>
                    {onTrackOrder && (
                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="px-4 py-2 bg-white text-black font-semibold hover:bg-[#E5E5E5] transition-colors cursor-pointer"
                      >
                        Track Courier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0E0E0E] border border-[#242424] p-6 sm:p-8 space-y-6 text-[#F5F5F5] font-mono text-xs max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedModalOrder(null)}
                className="absolute right-4 top-4 p-1.5 text-[#888888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#1F1F1F] pb-4">
                <span className="text-[9px] uppercase tracking-widest text-[#737373] block mb-1">
                  Maison RANA Official Invoice
                </span>
                <h3 className="font-serif text-2xl font-light text-white">
                  Order #{selectedModalOrder.id}
                </h3>
                <p className="text-[#737373] text-[11px]">
                  Placed on {new Date(selectedModalOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase text-[#888888] block">Items</span>
                {selectedModalOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span>{item.perfumeName} ({item.selectedSize}) × {item.quantity}</span>
                    <span className="text-white">₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1F1F1F] pt-4 space-y-1.5 text-[#8E8E93]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{selectedModalOrder.pricing.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedModalOrder.pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-white font-semibold">
                    <span>Discount</span>
                    <span>-₹{selectedModalOrder.pricing.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{selectedModalOrder.pricing.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-[#1F1F1F]">
                  <span>Total Amount Paid</span>
                  <span>₹{selectedModalOrder.pricing.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedModalOrder(null)}
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider hover:bg-[#E5E5E5] transition-colors"
              >
                Close View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
