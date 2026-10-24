/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { Perfume, PerfumeSize } from '../types';

interface NewArrivalsProps {
  perfumes: Perfume[];
  onQuickView: (p: Perfume) => void;
  onAddToCart: (p: Perfume, qty?: number, size?: PerfumeSize) => void;
  onExploreCatalog: () => void;
}

export default function NewArrivalsSection({
  perfumes,
  onQuickView,
  onAddToCart,
  onExploreCatalog,
}: NewArrivalsProps) {
  // Select newest formulations / recent releases
  const newArrivals = perfumes.filter((p) => p.featured || p.id.includes('sovereign') || p.id.includes('breeze') || p.id.includes('bloom')).slice(0, 3);
  const displayArrivals = newArrivals.length >= 2 ? newArrivals : perfumes.slice(2, 5);

  return (
    <section
      id="new-arrivals"
      className="py-24 lg:py-32 px-4 sm:px-8 lg:px-12 bg-[#050505] text-[#F5F5F5] border-b border-[#181818] select-none relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#1A1A1A]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-white/60" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
                SECTION 04 · RECENT FORMULATIONS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white">
              New Arrivals
            </h2>
          </div>

          <button
            onClick={onExploreCatalog}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#CCCCCC] hover:text-white transition-colors group cursor-pointer"
          >
            <span>View Complete Archive</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Editorial Product Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {displayArrivals.map((item, idx) => (
            <motion.div
              key={'new-' + item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-[#0B0B0B] border border-[#1E1E1E] hover:border-[#383838] transition-all duration-500 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8E8E93]">
                    {item.category}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white bg-[#1A1A1A] px-2 py-0.5 border border-[#2E2E2E]">
                    New Release
                  </span>
                </div>

                {/* Large Editorial Flacon Image */}
                <div
                  onClick={() => onQuickView(item)}
                  className="relative h-72 sm:h-80 flex items-center justify-center p-4 mb-6 bg-[#070707] border border-[#141414] group-hover:border-[#262626] cursor-pointer overflow-hidden transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-64 sm:max-h-72 w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04)_0%,_transparent_65%)] pointer-events-none" />
                </div>

                {/* Fragrance Details */}
                <h3 className="font-serif text-2xl font-light text-white tracking-[0.03em] mb-1">
                  {item.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373] mb-3">
                  {item.accord || `${item.category} Extrait`}
                </p>
                <p className="font-sans text-xs text-[#A3A3A3] font-light line-clamp-2 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Bottom Price & Quick Actions */}
              <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#737373] block">
                    Starting At
                  </span>
                  <span className="font-mono text-base font-semibold text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(item)}
                    className="p-2.5 border border-[#262626] bg-[#111111] text-[#A3A3A3] hover:text-white hover:border-[#444444] transition-colors cursor-pointer"
                    title="Inspect Fragrance"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(item, 1, '100ml')}
                    className="px-4 py-2.5 bg-white hover:bg-[#E5E5E5] text-black font-mono text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
