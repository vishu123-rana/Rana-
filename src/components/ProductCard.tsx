/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Perfume, PerfumeSize } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Perfume;
  onAddToCart: (p: Perfume, qty?: number, size?: PerfumeSize) => void;
  onBuyNow: (p: Perfume, qty?: number, size?: PerfumeSize) => void;
  onQuickView: (p: Perfume) => void;
  onToggleWishlist: (p: Perfume) => void;
  isWishlisted: boolean;
  theme?: 'dark' | 'light';
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onToggleWishlist,
  isWishlisted,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>('100ml');
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Dynamic price calculation based on selected size (20ml, 50ml, 100ml)
  const currentPrice = product.sizes?.[selectedSize] ?? product.price;
  const discountPercent = product.discountPercent || 25;
  const originalPrice = product.originalPrice
    ? Math.round(currentPrice / (1 - discountPercent / 100))
    : Math.round(currentPrice * 1.35);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    onQuickView(product);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-none bg-[#0D0D0D] border border-[#1E1E1E] hover:border-[#383838] transition-all duration-500 flex flex-col justify-between p-5 sm:p-6 shadow-xl cursor-pointer select-none overflow-hidden text-[#F5F5F5]"
    >
      <div>
        {/* 1. TOP HEADER: Fragrance Family, Rating & Wishlist */}
        <div className="flex items-center justify-between mb-4 z-10 relative">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8E8E93] font-medium">
              {product.category}
            </span>
            {product.bestSeller && (
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white bg-[#1F1F1F] px-1.5 py-0.5 border border-[#333333]">
                Bestseller
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#D4D4D4]">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>{product.rating}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`p-1 transition-colors cursor-pointer ${
                isWishlisted
                  ? 'text-rose-400'
                  : 'text-[#666666] hover:text-white'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. REALISTIC PRODUCT IMAGE CONTAINER */}
        <div className="relative h-64 sm:h-72 rounded-none flex items-center justify-center p-4 mb-4 overflow-hidden bg-[#070707] border border-[#181818] group-hover:border-[#282828] transition-colors duration-500">
          {/* Subtle studio glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] pointer-events-none" />

          {/* Primary High-Resolution Flacon Image */}
          <img
            src={product.image}
            alt={product.name}
            className={`max-h-56 sm:max-h-64 w-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] transition-all duration-700 ease-out ${
              isHovered ? 'scale-105 -translate-y-1 brightness-105' : 'scale-100 brightness-100'
            }`}
          />

          {/* Secondary Information Reveal on Hover */}
          <div
            className={`absolute inset-x-2 bottom-2 p-2 backdrop-blur-md transition-all duration-300 flex items-center justify-between text-[10px] font-mono border bg-[#050505]/95 text-[#E5E5E5] border-[#2A2A2A] ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <span className="truncate pr-2 text-[#A3A3A3]">
              Notes: {product.notes.top[0]}, {product.notes.heart[0]}
            </span>
            <span className="shrink-0 text-white font-medium flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Inspect
            </span>
          </div>

          {/* Discount Tag */}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white text-black font-mono text-[8px] uppercase tracking-wider font-bold">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* 3. PRODUCT NAME & FRAGRANCE FAMILY */}
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-light text-white tracking-[0.04em] leading-tight group-hover:text-white transition-colors">
            {product.name}
          </h3>

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8E93] mt-1 font-light">
            {product.accord || `${product.category} Extrait de Parfum`}
          </p>

          {/* Scent Description */}
          <p className="font-sans text-xs font-light line-clamp-2 mt-1.5 mb-3 leading-relaxed text-[#A3A3A3]">
            {product.description}
          </p>
        </div>

        {/* 4. SIZE SELECTOR OPTIONS (20ml, 50ml, 100ml) */}
        <div className="flex items-center gap-1.5 mb-4">
          {(['20ml', '50ml', '100ml'] as PerfumeSize[]).map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSize(size);
              }}
              className={`flex-1 py-1 text-[9px] font-mono uppercase tracking-[0.18em] border transition-all cursor-pointer ${
                selectedSize === size
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-[#111111] text-[#8E8E93] border-[#222222] hover:border-[#444444] hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 5. PRICE & ACTION BUTTONS: Add to Bag */}
      <div className="pt-3 border-t border-[#1C1C1C] flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg sm:text-xl font-semibold text-white">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {originalPrice > currentPrice && (
              <span className="font-mono text-xs text-[#666666] line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="font-mono text-[9px] text-[#777777] uppercase tracking-wider">
            {selectedSize} Extrait
          </span>
        </div>

        {/* Action Button: Add to Bag */}
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 px-3 font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
            justAdded
              ? 'bg-[#1A1A1A] text-white border border-white'
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
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
