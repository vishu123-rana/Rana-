/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Check,
  Zap,
  Share2,
  Plus,
  Minus,
  Droplets,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Perfume, PerfumeSize } from '../types';
import { perfumes as allMaisonPerfumes } from '../data/perfumes';

interface QuickViewModalProps {
  product: Perfume | null;
  onClose: () => void;
  onAddToCart: (p: Perfume, qty: number, size: PerfumeSize) => void;
  onBuyNow: (p: Perfume, qty: number, size: PerfumeSize) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Perfume) => void;
  onSelectComplementary?: (p: Perfume) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onSelectComplementary,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>('100ml');
  const [activeTab, setActiveTab] = useState<'story' | 'notes' | 'profile' | 'reviews'>('story');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedSize('100ml');
      setActiveTab('story');
    }
  }, [product?.id]);

  if (!product) return null;

  const currentPrice = product.sizes?.[selectedSize] ?? product.price;
  const discountPercent = product.discountPercent || 25;
  const originalPrice = product.originalPrice
    ? Math.round(currentPrice / (1 - discountPercent / 100))
    : Math.round(currentPrice * 1.35);

  const getWhenToWear = (p: Perfume) => {
    if (p.category === 'Oud' || p.id === 'rana-intense') return 'Evening, Black Tie & Nocturnal Receptions';
    if (p.id === 'rana-ocean-breeze' || p.category === 'Unisex') return 'Daytime, Coastal Breeze & Executive Office';
    if (p.category === 'Women') return 'Romantic Evenings, High Tea & Autumn Gatherings';
    return 'All-Day Signature, Business & Intimate Dinners';
  };

  const getSillage = (p: Perfume) => {
    if (p.category === 'Oud' || p.id === 'rana-intense' || p.category === 'Premium') {
      return 'Opulent & Enveloping (6-8 ft aura)';
    }
    return 'Refined & Magnetic (3-5 ft aura)';
  };

  const getHowItSmells = (p: Perfume) => {
    if (p.category === 'Oud') {
      return 'Dark, resinous and balsamic. A warm opening of smoked saffron that deepens into aged Assam agarwood, ending in an enduring trail of crystalline ambergris.';
    }
    if (p.category === 'Women') {
      return 'Velvety, luminous and seductive. Dewy Damask rose petals kissed with Madagascar vanilla, balanced by clean Atlas cedar and white cashmere.';
    }
    if (p.category === 'Men') {
      return 'Crisp, commanding and smoky. Sharp Calabrian bergamot gives way to aromatic French lavender and dark Cuban tobacco, drying down to Mysore sandalwood.';
    }
    return 'Clean, serene and transcendent. Creamy santal meets solar neroli and sheer skin musk for an understated aristocratic signature.';
  };

  const complementaryFragrances = allMaisonPerfumes
    .filter((p) => p.id !== product.id && (p.category !== product.category || p.bestSeller))
    .slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#000000]/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#0D0D0D] border border-[#242424] shadow-[0_30px_90px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col md:flex-row overflow-hidden z-10 text-[#F5F5F5]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 bg-[#141414] hover:bg-white hover:text-black text-white border border-[#2B2B2B] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* LEFT COLUMN: LARGE REALISTIC PRODUCT IMAGE CONTAINER */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#1F1F1F] bg-[#070707] relative">
            {/* Top Tag & Family */}
            <div className="self-start flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#CCCCCC] px-2.5 py-0.5 bg-[#141414] border border-[#282828]">
                {product.category} Collection
              </span>
              <span className="font-mono text-[9px] text-[#777777]">
                · 35% Pure Extrait
              </span>
            </div>

            {/* Bottle Showcase */}
            <div className="relative w-full h-72 sm:h-96 flex items-center justify-center my-4 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_0%,_transparent_65%)] pointer-events-none" />

              <div className="absolute -bottom-2 w-48 sm:w-56 h-4 bg-black rounded-full blur-md opacity-90" />

              <img
                src={product.image}
                alt={product.name}
                className="max-h-64 sm:max-h-84 w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] filter brightness-100 transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Quality Assurances */}
            <div className="w-full pt-4 border-t border-[#1A1A1A] flex items-center justify-around text-[9px] font-mono uppercase tracking-wider text-[#737373]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A3A3A3]" />
                100% Authentic Extrait
              </span>
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#A3A3A3]" />
                Artisanal Distillation
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: INFORMATION & ARCHITECTURE */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-none text-[#F5F5F5] bg-[#0D0D0D]">
            <div>
              {/* Top rating and actions */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#E5E5E5]">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-white text-white" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">{product.rating}</span>
                  <span className="text-[#666666]">· Connoisseur Choice</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
                    title="Share Fragrance Link"
                  >
                    {copiedShare ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      isWishlisted ? 'text-rose-400' : 'text-[#777777] hover:text-white'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Name & Family */}
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white mb-1">
                {product.name}
              </h2>

              <p className="font-mono text-xs text-[#8E8E93] uppercase tracking-wider mb-4">
                {product.accord || `${product.category} Extrait de Parfum`}
              </p>

              {/* Price & Discount Display */}
              <div className="flex items-baseline gap-3 mb-5 p-3 bg-[#121212] border border-[#222222]">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-white">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="font-mono text-sm text-[#666666] line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Section Tabs */}
              <div className="flex items-center gap-4 border-b border-[#1F1F1F] mb-4 pb-2 text-xs font-mono uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'story'
                      ? 'text-white border-b-2 border-white font-semibold'
                      : 'text-[#666666] hover:text-[#B3B3B3]'
                  }`}
                >
                  Story
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'notes'
                      ? 'text-white border-b-2 border-white font-semibold'
                      : 'text-[#666666] hover:text-[#B3B3B3]'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'profile'
                      ? 'text-white border-b-2 border-white font-semibold'
                      : 'text-[#666666] hover:text-[#B3B3B3]'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-white border-b-2 border-white font-semibold'
                      : 'text-[#666666] hover:text-[#B3B3B3]'
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* Tab 1: STORY */}
              {activeTab === 'story' && (
                <div className="space-y-4">
                  <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
                    {product.description}
                  </p>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#888888] block mb-2 font-medium">
                      Select Flacon Volume:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['20ml', '50ml', '100ml'] as PerfumeSize[]).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2 px-3 font-mono text-xs uppercase tracking-wider border transition-all cursor-pointer text-center ${
                            selectedSize === sz
                              ? 'bg-white text-black border-white font-semibold'
                              : 'bg-[#121212] text-[#888888] border-[#242424] hover:border-[#444444] hover:text-white'
                          }`}
                        >
                          <div>{sz}</div>
                          <div className={`text-[10px] mt-0.5 ${selectedSize === sz ? 'text-black/80' : 'text-[#666666]'}`}>
                            ₹{(product.sizes?.[sz] ?? product.price).toLocaleString('en-IN')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-3 p-4 bg-[#111111] border border-[#222222]">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#737373] block">
                      Top Notes (First 15 Minutes)
                    </span>
                    <p className="font-sans text-xs text-white mt-0.5 font-light">
                      {product.notes.top.join(' · ')}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1C1C1C]">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#737373] block">
                      Heart Notes (Hours 1 - 6)
                    </span>
                    <p className="font-sans text-xs text-white mt-0.5 font-light">
                      {product.notes.heart.join(' · ')}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1C1C1C]">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#737373] block">
                      Base Notes (Enduring Drydown)
                    </span>
                    <p className="font-sans text-xs text-white mt-0.5 font-light">
                      {product.notes.base.join(' · ')}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1C1C1C]">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#737373] block">
                      Raw Ingredients
                    </span>
                    <p className="font-sans text-[11px] text-[#A3A3A3] mt-0.5 font-light">
                      {product.ingredients.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-3 p-4 bg-[#111111] border border-[#222222] text-xs">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#737373] block">
                      Olfactory Character
                    </span>
                    <p className="font-sans text-xs text-[#A3A3A3] mt-0.5 leading-relaxed font-light">
                      {getHowItSmells(product)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C1C1C]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#737373] block">
                      Occasion
                    </span>
                    <p className="font-sans text-xs text-white mt-0.5 font-light">
                      {getWhenToWear(product)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1C1C1C]">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#737373] block">
                        Longevity
                      </span>
                      <p className="font-sans text-xs text-white mt-0.5 font-semibold">
                        {product.longevity || '20+ Hours on skin'}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#737373] block">
                        Sillage
                      </span>
                      <p className="font-sans text-xs text-white mt-0.5 font-semibold">
                        {getSillage(product)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  <div className="p-3 bg-[#111111] border border-[#222222]">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 text-white">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3 h-3 fill-white text-white" />
                        ))}
                      </div>
                      <span className="font-mono text-[9px] text-[#777777]">Verified Connoisseur</span>
                    </div>
                    <h4 className="font-serif text-xs font-normal text-white">
                      Sensational drydown & immaculate presence
                    </h4>
                    <p className="font-sans text-[11px] text-[#A3A3A3] mt-1 font-light leading-relaxed">
                      "The pure botanical extraits in {product.name} are immediately evident. It evolves seamlessly from morning until late into the night."
                    </p>
                    <div className="font-mono text-[9px] text-[#888888] mt-1.5 flex items-center gap-1">
                      <Check className="w-3 h-3 text-white" />
                      <span>Arjun Singhal · Verified Buyer</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mt-5 mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#888888]">
                  Quantity:
                </span>
                <div className="flex items-center bg-[#121212] border border-[#262626]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#888888] hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-semibold px-3 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="p-2 text-[#888888] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Complementary Pairings */}
              <div className="pt-4 border-t border-[#1C1C1C] mb-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#737373] block mb-2">
                  Complete Your Scent · Olfactory Pairing
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {complementaryFragrances.map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => {
                        if (onSelectComplementary) onSelectComplementary(comp);
                      }}
                      className="p-2 bg-[#111111] border border-[#222222] hover:border-[#444444] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <img src={comp.image} alt={comp.name} className="w-8 h-8 object-contain" />
                      <div className="truncate">
                        <span className="font-serif text-xs text-white block truncate font-light">
                          {comp.name}
                        </span>
                        <span className="font-mono text-[9px] text-[#888888] block">
                          ₹{comp.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#1C1C1C] flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onAddToCart(product, quantity, selectedSize);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Add to Bag (₹{(currentPrice * quantity).toLocaleString('en-IN')})</span>
              </button>

              <button
                onClick={() => {
                  onBuyNow(product, quantity, selectedSize);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-[#141414] hover:bg-[#202020] text-white border border-[#2E2E2E] font-mono text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Instant Checkout</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
