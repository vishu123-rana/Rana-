/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, ShoppingBag, Sparkles, ShieldCheck, Heart, Clock, Droplets, Check } from 'lucide-react';
import { Perfume, PerfumeSize } from '../types';

interface SignatureFragranceProps {
  perfumes: Perfume[];
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, qty?: number, size?: PerfumeSize) => void;
  onToggleWishlist: (perfume: Perfume) => void;
  isWishlisted: boolean;
}

export default function SignatureFragrance({
  perfumes,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: SignatureFragranceProps) {
  // Flagship 4 Featured perfumes
  const featuredIds = ['rana-noir', 'rana-royal-oud', 'rana-intense', 'rana-sovereign-imperial'];
  const featuredPerfumes = perfumes.filter((p) => featuredIds.includes(p.id));
  const fallbackList = featuredPerfumes.length >= 3 ? featuredPerfumes : perfumes.slice(0, 4);

  const [activeId, setActiveId] = useState<string>(fallbackList[0]?.id || 'rana-noir');
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>('100ml');
  const [justAdded, setJustAdded] = useState(false);

  const currentProduct = fallbackList.find((p) => p.id === activeId) || fallbackList[0];
  const currentPrice = currentProduct.sizes?.[selectedSize] ?? currentProduct.price;
  const discountPercent = currentProduct.discountPercent || 25;
  const originalPrice = currentProduct.originalPrice
    ? Math.round(currentPrice / (1 - discountPercent / 100))
    : Math.round(currentPrice * 1.35);

  const handleAdd = () => {
    onAddToCart(currentProduct, 1, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section
      id="featured-fragrances"
      className="py-24 lg:py-32 bg-[#070707] text-[#F5F5F5] relative overflow-hidden border-b border-[#181818]"
    >
      {/* Editorial Watermark */}
      <div className="absolute right-4 top-10 font-serif text-[120px] lg:text-[220px] font-black text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter">
        RANA
      </div>

      {/* Atmospheric lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_0%,_transparent_70%)] pointer-events-none rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header & Fragrance Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#1F1F1F]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-white/60" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
                SECTION 01 · MAISON SELECTION
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white">
              Featured Fragrances
            </h2>
          </div>

          {/* Featured Fragrance Tab Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0D0D0D] p-1 border border-[#222222]">
            {fallbackList.map((item) => {
              const isSelected = item.id === activeId;
              return (
                <button
                  key={'tab-' + item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`px-4 py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {item.name.replace('RANA ', '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Editorial Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Flacon Showcase */}
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square bg-[#0B0B0B] border border-[#1F1F1F] flex items-center justify-center p-8 sm:p-12 overflow-hidden shadow-2xl group">
              {/* Radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_65%)] pointer-events-none" />

              {/* Reserve Badge */}
              <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#A3A3A3] bg-[#141414] px-3 py-1 border border-[#2A2A2A]">
                Limited Extraction · Pure Parfum
              </div>

              {/* Dominant Flacon */}
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="max-h-72 sm:max-h-96 w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="w-48 sm:w-64 h-3 bg-black rounded-full blur-md -mt-2 opacity-80" />
              </div>

              {/* Quick Inspect Button */}
              <button
                onClick={() => onQuickView(currentProduct)}
                className="absolute bottom-4 right-4 p-3 bg-[#141414] hover:bg-white hover:text-black text-white border border-[#2B2B2B] shadow-lg transition-all cursor-pointer"
                title="Inspect Flacon"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Quality Certifications */}
            <div className="flex items-center justify-between w-full max-w-lg mt-4 px-1 font-mono text-[9px] text-[#737373] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#A3A3A3]" /> Grasse Distillation
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#A3A3A3]" /> 180-Day Maturation
              </span>
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3 h-3 text-[#A3A3A3]" /> 35% Pure Extrait
              </span>
            </div>
          </motion.div>

          {/* RIGHT: Fragrance Architecture & Purchase Box */}
          <motion.div
            key={`${currentProduct.id}-details`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col"
          >
            {/* Category & Rating */}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-0.5 bg-[#141414] border border-[#262626] font-mono text-[9px] uppercase tracking-[0.25em] text-[#CCCCCC]">
                {currentProduct.category} Collection
              </span>
              <span className="font-mono text-xs text-[#888888] tracking-wider">
                ★ {currentProduct.rating} / 5.0 (Client Approved)
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white mb-4">
              {currentProduct.name}
            </h3>

            {/* Quote / Description */}
            <p className="font-serif italic text-base sm:text-lg text-[#CCCCCC] mb-4 leading-relaxed border-l border-white/40 pl-4 font-light">
              &ldquo;{currentProduct.description}&rdquo;
            </p>

            {/* Olfactory Notes Architecture */}
            <div className="bg-[#0B0B0B] border border-[#1F1F1F] p-5 mb-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-[0.2em]">
                  Fragrance Family
                </span>
                <span className="font-sans text-xs text-white font-medium">
                  {currentProduct.accord || `${currentProduct.category} Extrait de Parfum`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="font-mono text-[9px] text-[#777777] uppercase tracking-widest block mb-1">
                    Top Notes
                  </span>
                  <p className="font-sans text-xs text-[#E5E5E5]">
                    {currentProduct.notes.top.join(', ')}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[9px] text-[#777777] uppercase tracking-widest block mb-1">
                    Heart Notes
                  </span>
                  <p className="font-sans text-xs text-[#E5E5E5]">
                    {currentProduct.notes.heart.join(', ')}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[9px] text-[#777777] uppercase tracking-widest block mb-1">
                    Base Notes
                  </span>
                  <p className="font-sans text-xs text-[#E5E5E5]">
                    {currentProduct.notes.base.join(', ')}
                  </p>
                </div>
              </div>

              {/* Longevity meter */}
              <div className="pt-3 border-t border-[#1A1A1A] flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#888888]">
                <span>Longevity Metric</span>
                <span className="text-white font-semibold">{currentProduct.longevity || '20+ Hours'}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] text-[#777777] uppercase tracking-[0.2em]">
                Select Size:
              </span>
              {(['20ml', '50ml', '100ml'] as PerfumeSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-[#111111] text-[#888888] border-[#262626] hover:border-[#444444]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#777777] block">
                  Price ({selectedSize})
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-white">
                    ₹{currentPrice.toLocaleString('en-IN')}
                  </span>
                  {originalPrice > currentPrice && (
                    <span className="font-mono text-xs text-[#666666] line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleWishlist(currentProduct)}
                  className={`p-3 border border-[#2B2B2B] bg-[#111111] hover:text-white transition-colors cursor-pointer ${
                    isWishlisted ? 'text-rose-400' : 'text-[#888888]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleAdd}
                  className={`flex-1 sm:flex-none px-7 py-3 font-mono text-xs uppercase tracking-[0.22em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    justAdded
                      ? 'bg-[#222222] text-white border border-white'
                      : 'bg-white text-black hover:bg-[#E5E5E5] border border-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-black" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
