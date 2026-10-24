/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Eye, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Droplets } from 'lucide-react';
import { perfumes } from '../data/perfumes';
import { Perfume } from '../types';

interface BotanicalShowcaseProps {
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
}

export default function BotanicalShowcase({
  onQuickView,
  onAddToCart,
}: BotanicalShowcaseProps) {
  // Selected hero product in the asymmetric layout
  const [selectedId, setSelectedId] = useState<string>('rana-royal-oud');

  const featuredList = [
    {
      id: 'rana-royal-oud',
      botanicalHero: 'Aged Assam Agarwood & Wild Frankincense',
      shadowTone: 'Deep Agarwood & Forest Shadow',
      leafNote: 'Smoked Herbal Balsam',
    },
    {
      id: 'rana-noir',
      botanicalHero: 'Calabrian Bergamot & Atlas Cedar Needles',
      shadowTone: 'Wet Slate & Chiaroscuro Foliage',
      leafNote: 'Crisp Citrus Fronds',
    },
    {
      id: 'rana-velvet-rose',
      botanicalHero: 'Turkish Damask Rose & Resinous Amber',
      shadowTone: 'Warm Amber Foliage & Velvet Petals',
      leafNote: 'Floral Dew & Green Stems',
    },
    {
      id: 'rana-intense',
      botanicalHero: 'Cardamom Pods & Aged Tobacco Leaf',
      shadowTone: 'Warm Smoked Spice & Earth',
      leafNote: 'Botanical Resins',
    },
  ];

  const currentHeroPerfume = perfumes.find((p) => p.id === selectedId) || perfumes[1];
  const supportingPerfumes = perfumes.filter((p) => p.id !== selectedId).slice(0, 3);
  const currentDetails = featuredList.find((f) => f.id === selectedId) || featuredList[0];

  return (
    <section
      id="botanical-showcase"
      className="py-20 lg:py-28 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#0E2319] via-[#142B20] to-[#0B1B13] text-[#F7F5EE] border-b border-[#7D9A83]/20 relative overflow-hidden select-none"
    >
      {/* 1. ATMOSPHERIC LEAF SHADOWS & WATER DROPLETS */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(125,154,131,0.15)_0%,_transparent_70%)] pointer-events-none rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(197,160,89,0.08)_0%,_transparent_70%)] pointer-events-none rounded-full blur-3xl" />

      {/* Background botanical foliage silhouettes */}
      <div className="absolute -top-16 -left-16 w-80 h-80 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="#7D9A83" className="w-full h-full filter blur-[2px]">
          <path d="M10,90 Q30,10 90,10 Q60,60 10,90 Z" />
          <path d="M20,95 Q50,30 95,40 Q55,80 20,95 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C3327] border border-[#7D9A83]/30 mb-3">
            <Leaf className="w-3.5 h-3.5 text-[#7D9A83]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A3BCA7] font-semibold">
              Botanical Haute Parfumerie
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.02em] text-[#F7F5EE] mb-4">
            Living Nature & Fine Glass
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#F7F5EE]/70 max-w-xl mx-auto font-light leading-relaxed">
            An asymmetric olfactory study in natural leaves, organic shadows, water reflections, and monumental flacon glass.
          </p>
        </div>

        {/* ======================================================== */}
        {/* ASYMMETRIC COMPOSITION: LARGE PRODUCT + SUPPORTING SMALLER */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: 1 LARGE HERO PRODUCT IMAGE CONTAINER (7 COLS) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-[#091710] border border-[#7D9A83]/30 p-8 sm:p-12 overflow-hidden shadow-2xl group">
              {/* Soft studio light & foliage reflection */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(125,154,131,0.2)_0%,_transparent_65%)] pointer-events-none" />
              
              {/* Natural leaves vector decoration along edge */}
              <div className="absolute top-4 left-4 opacity-30 flex items-center gap-2 text-[#7D9A83] text-xs font-mono">
                <Leaf className="w-4 h-4" />
                <span>{currentDetails.botanicalHero}</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142B20] text-[#A3BCA7] text-[10px] font-mono border border-[#7D9A83]/30">
                <Droplets className="w-3 h-3 text-[#7D9A83]" />
                <span>Cold Extraction</span>
              </div>

              {/* Large Flacon Centered with Natural Shadow & Botanical Reflections */}
              <div className="relative h-80 sm:h-96 my-6 flex items-center justify-center">
                {/* Natural shadow beneath the glass flacon */}
                <div className="absolute -bottom-4 w-52 sm:w-64 h-8 bg-black/70 rounded-full blur-lg" />

                <motion.img
                  key={currentHeroPerfume.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={currentHeroPerfume.image}
                  alt={currentHeroPerfume.name}
                  className="max-h-72 sm:max-h-88 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter brightness-105"
                />
              </div>

              {/* Information Strip & Direct CTAs */}
              <div className="pt-6 border-t border-[#7D9A83]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold text-[#F7F5EE]">
                      {currentHeroPerfume.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1C3327] text-[#A3BCA7] border border-[#7D9A83]/30">
                      {currentHeroPerfume.category}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#F7F5EE]/70 font-light mt-1 max-w-md">
                    {currentHeroPerfume.description}
                  </p>
                  <div className="mt-2 text-xs font-mono text-[#A3BCA7] flex items-center gap-3">
                    <span>Longevity: {currentHeroPerfume.longevity}</span>
                    <span>·</span>
                    <span className="font-bold text-[#F7F5EE]">₹{currentHeroPerfume.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onQuickView(currentHeroPerfume)}
                    className="p-3 rounded-xl bg-[#142B20] hover:bg-[#1C3327] text-[#F7F5EE] border border-[#7D9A83]/40 transition-colors cursor-pointer"
                    title="Inspect Scent"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddToCart(currentHeroPerfume)}
                    className="px-5 py-3 rounded-xl bg-[#274233] hover:bg-[#345543] text-[#F7F5EE] border border-[#7D9A83]/60 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: 3 SUPPORTING SMALLER PRODUCT IMAGES ASYMMETRIC STACK (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7D9A83] font-semibold block mb-1">
              Select Botanical Study:
            </span>

            {featuredList.map((item) => {
              const p = perfumes.find((perf) => perf.id === item.id);
              if (!p) return null;
              const isSelected = selectedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-[#142B20] border-[#7D9A83] shadow-lg shadow-[#142B20]/40'
                      : 'bg-[#0E2319]/70 hover:bg-[#142B20]/50 border-[#7D9A83]/20'
                  }`}
                >
                  {/* Miniature Bottle Container */}
                  <div className="w-16 h-20 rounded-xl bg-[#091710] border border-white/5 flex items-center justify-center p-2 shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-16 w-auto object-contain drop-shadow-md"
                    />
                  </div>

                  {/* Bottle Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-bold text-[#F7F5EE] truncate">
                        {p.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#A3BCA7]">
                        ₹{p.price}
                      </span>
                    </div>

                    <p className="font-mono text-[10px] text-[#7D9A83] truncate mt-0.5">
                      {item.botanicalHero}
                    </p>

                    <p className="font-sans text-[11px] text-[#F7F5EE]/60 font-light truncate mt-1">
                      {p.notes.top.join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="mt-2 p-4 rounded-2xl bg-[#0A1710] border border-[#7D9A83]/20 text-xs font-sans text-[#F7F5EE]/70 font-light flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7D9A83]" />
                Limited harvest batches. Never mass-produced.
              </span>
              <button
                onClick={() => onQuickView(currentHeroPerfume)}
                className="font-mono text-[11px] uppercase tracking-wider text-[#A3BCA7] hover:underline cursor-pointer"
              >
                Inspect Notes
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
