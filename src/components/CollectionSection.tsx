/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShoppingBag, Eye, Heart, Star, Sparkles } from 'lucide-react';
import { Perfume, PerfumeCategory, PerfumeSize } from '../types';

interface CollectionSectionProps {
  perfumes: Perfume[];
  onShopCollection: (category: PerfumeCategory) => void;
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, qty?: number, size?: PerfumeSize) => void;
  onToggleWishlist?: (perfume: Perfume) => void;
  wishlist?: Perfume[];
}

export default function CollectionSection({
  perfumes,
  onShopCollection,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlist = [],
}: CollectionSectionProps) {
  const categories: { label: string; key: PerfumeCategory; count: number }[] = [
    { label: "All Curations", key: 'Premium', count: perfumes.length },
    { label: "Men's", key: 'Men', count: perfumes.filter((p) => p.category === 'Men').length },
    { label: "Women's", key: 'Women', count: perfumes.filter((p) => p.category === 'Women').length },
    { label: 'Unisex', key: 'Unisex', count: perfumes.filter((p) => p.category === 'Unisex').length },
    { label: 'Oud', key: 'Oud', count: perfumes.filter((p) => p.category === 'Oud').length },
    { label: 'Gift Sets', key: 'Gift Sets', count: perfumes.filter((p) => p.category === 'Gift Sets').length },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('All Curations');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PerfumeSize>>({});

  // Display curated perfumes for the featured collection
  const displayedPerfumes =
    activeCategory === 'All Curations'
      ? perfumes.slice(0, 8)
      : perfumes.filter((p) => p.category === activeCategory);

  const handleSizeChange = (pId: string, size: PerfumeSize, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [pId]: size }));
  };

  return (
    <section
      id="collections"
      className="py-20 lg:py-28 px-4 sm:px-8 lg:px-12 bg-[#FAF8F2] text-[#16221A] border-b border-[#16221A]/10 select-none relative overflow-hidden"
    >
      {/* Subtle organic watermark in warm ivory background */}
      <div className="absolute top-10 right-10 w-96 h-96 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" fill="#16221A" className="w-full h-full">
          <circle cx="100" cy="100" r="80" stroke="#16221A" strokeWidth="2" fill="none" />
          <path d="M100 20 L100 180 M20 100 L180 100" stroke="#16221A" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* SECTION HEADER: "Exclusive Scents" / "Luxury Collections" */}
        {/* ======================================================== */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#3B5B47] block mb-2 font-bold">
            Exclusive Scents
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.02em] text-[#16221A] mb-4">
            Luxury Collections
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#2E3E34]/75 max-w-xl mx-auto font-light leading-relaxed">
            Distilled from botanical extractions and aged agarwoods. Each flacon is hand-inspected and sealed in our Indian atelier.
          </p>
          <div className="h-[2px] w-20 bg-[#3B5B47]/30 mx-auto mt-4" />
        </div>

        {/* ======================================================== */}
        {/* CATEGORY SELECTOR TABS: Warm ivory styling with olive accents */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-[#FAF8F2] bg-[#274233] font-bold shadow-md shadow-[#274233]/25 scale-105'
                    : 'text-[#2E3E34] bg-white hover:bg-[#F2EFE8] border border-[#16221A]/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`ml-1.5 text-[10px] ${isActive ? 'text-[#A3BCA7]' : 'text-[#7D9A83]'}`}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* INDIVIDUAL PRODUCT CARDS GRID: WARM IVORY/CREAM BACKGROUND */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayedPerfumes.map((perfume) => {
            const currentSize: PerfumeSize = selectedSizes[perfume.id] || '100ml';
            const price = perfume.sizes?.[currentSize] ?? perfume.price;
            const discountPercent = perfume.discountPercent || 28;
            const originalPrice = perfume.originalPrice
              ? Math.round(price / (1 - discountPercent / 100))
              : Math.round(price * 1.35);

            const isWishlisted = wishlist.some((w) => w.id === perfume.id);

            return (
              <motion.div
                key={perfume.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => onQuickView(perfume)}
                className="group bg-white rounded-2xl border border-[#16221A]/10 hover:border-[#3B5B47]/40 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                {/* Header: Category & Wishlist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#3B5B47] bg-[#FAF8F2] px-2.5 py-1 rounded-full font-bold border border-[#16221A]/5">
                      {perfume.category}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWishlist) onToggleWishlist(perfume);
                      }}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isWishlisted
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-[#16221A]/35 hover:text-[#16221A] hover:bg-black/5'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Realistic Perfume Product Image with Soft Shadows & Rounded Container */}
                  <div className="relative h-56 rounded-xl bg-[#F7F5EE] flex items-center justify-center p-3 mb-4 overflow-hidden group-hover:bg-[#F2EFE8] transition-colors">
                    {/* Soft botanical glow backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(125,154,131,0.15)_0%,_transparent_70%)] pointer-events-none" />

                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="max-h-48 w-auto object-contain drop-shadow-[0_12px_16px_rgba(22,34,26,0.2)] group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick View Floating Hint */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#274233] text-white p-1.5 rounded-lg shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-serif text-lg font-bold text-[#16221A] group-hover:text-[#274233] transition-colors leading-snug">
                    {perfume.name}
                  </h3>

                  {/* Short Fragrance Notes / Accords */}
                  <p className="font-sans text-[11px] text-[#2E3E34]/70 line-clamp-1 mt-1 font-light">
                    {perfume.notes.top[0]} · {perfume.notes.heart[0]} · {perfume.notes.base[0]}
                  </p>

                  {/* Size Selector: 20ml, 50ml, 100ml */}
                  <div className="flex items-center gap-1.5 mt-3 mb-4">
                    {(['20ml', '50ml', '100ml'] as PerfumeSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={(e) => handleSizeChange(perfume.id, sz, e)}
                        className={`flex-1 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                          currentSize === sz
                            ? 'bg-[#274233] text-white border-[#274233] font-bold shadow-xs'
                            : 'bg-[#FAF8F2] text-[#2E3E34] border-[#16221A]/10 hover:border-[#16221A]/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer: Price, Discount & Add to Cart button */}
                <div className="pt-3 border-t border-[#16221A]/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-base font-bold text-[#16221A]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {discountPercent > 0 && (
                        <span className="font-mono text-[10px] text-[#2E3E34]/50 line-through">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {discountPercent > 0 && (
                      <span className="font-mono text-[9px] text-[#3B5B47] font-semibold block">
                        Save {discountPercent}% Off
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(perfume, 1, currentSize);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#274233] hover:bg-[#345543] text-[#FAF8F2] font-mono text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Add to Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Link: "Shop All Collections" */}
        <div className="text-center mt-12">
          <button
            onClick={() => onShopCollection('Men')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#274233] text-[#274233] hover:text-white border border-[#274233]/40 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>EXPLORE FULL ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
