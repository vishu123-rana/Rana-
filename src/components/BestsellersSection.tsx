/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Perfume, PerfumeSize } from '../types';
import ProductCard from './ProductCard';

interface BestsellersSectionProps {
  perfumes: Perfume[];
  onAddToCart: (p: Perfume, qty?: number, size?: PerfumeSize) => void;
  onBuyNow: (p: Perfume, qty?: number, size?: PerfumeSize) => void;
  onQuickView: (p: Perfume) => void;
  onToggleWishlist: (p: Perfume) => void;
  wishlist: Perfume[];
}

export default function BestsellersSection({
  perfumes,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onToggleWishlist,
  wishlist,
}: BestsellersSectionProps) {
  // Filter bestsellers or top rated fragrances
  const bestsellers = perfumes.filter((p) => p.bestSeller || p.rating >= 4.9).slice(0, 4);

  return (
    <section
      id="bestsellers"
      className="py-24 lg:py-32 px-4 sm:px-8 lg:px-12 bg-[#0B0B0B] text-[#F5F5F5] border-b border-[#181818] select-none relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-white/60" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
              SECTION 03 · MAISON PROVENANCE
            </span>
            <span className="w-6 h-[1px] bg-white/60" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white mb-3">
            Best Sellers
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] max-w-lg mx-auto font-light leading-relaxed">
            The most celebrated formulations in the RANA archive, cherished for exceptional sillage,
            circadian longevity, and timeless distinction.
          </p>
        </div>

        {/* Large Premium Bestseller Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((perfume) => (
            <ProductCard
              key={`bestseller-${perfume.id}`}
              product={perfume}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.some((w) => w.id === perfume.id)}
              theme="dark"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
