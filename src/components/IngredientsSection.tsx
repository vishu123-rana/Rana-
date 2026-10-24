/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { ingredients } from '../data/ingredients';
import { Ingredient } from '../types';

interface IngredientsSectionProps {
  onFindPerfumeWithIngredient: (ingName: string) => void;
}

export default function IngredientsSection({ onFindPerfumeWithIngredient }: IngredientsSectionProps) {
  // Ensure the primary 7 requested notes are featured: Oud, Amber, Musk, Vanilla, Rose, Sandalwood, Bergamot
  const priorityOrder = ['Oud', 'Amber', 'Musk', 'Vanilla', 'Rose', 'Sandalwood', 'Bergamot'];
  
  const featuredIngredients = ingredients
    .filter((ing) => priorityOrder.includes(ing.name))
    .sort((a, b) => priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name));

  const [selectedIng, setSelectedIng] = useState<Ingredient>(
    featuredIngredients[0] || ingredients[0]
  );

  return (
    <section
      id="ingredients"
      className="py-24 lg:py-32 bg-[#080808] text-[#F5F5F5] border-b border-[#181818] relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-white/60" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
              SECTION 06 · NOBLE RAW MATERIALS
            </span>
            <span className="w-6 h-[1px] bg-white/60" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white mb-3">
            Fragrance Notes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] max-w-lg mx-auto font-light leading-relaxed">
            Every flacon of RANA Luxury Perfumes is formulated using sustainably harvested botanical
            absolutes, rare aged resins, and noble raw materials from premier global terroirs.
          </p>
        </div>

        {/* 7 Core Notes Horizontal Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {featuredIngredients.map((ing) => {
            const isSelected = selectedIng.id === ing.id;
            return (
              <button
                key={'ing-btn-' + ing.id}
                onClick={() => setSelectedIng(ing)}
                className={`p-4 border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[95px] ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-[#0E0E0E] text-[#8E8E93] border-[#1F1F1F] hover:border-[#383838] hover:text-white'
                }`}
              >
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] opacity-70">
                  {ing.family}
                </span>
                <span className="font-serif text-base sm:text-lg font-normal tracking-[0.02em] my-1">
                  {ing.name}
                </span>
                <span className="w-4 h-[1px] bg-current opacity-40" />
              </button>
            );
          })}
        </div>

        {/* Deep Dive Note Presentation Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={'detail-' + selectedIng.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0D0D0D] border border-[#222222] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Note Identity & Description */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#888888] bg-[#141414] px-3 py-1 border border-[#262626]">
                  Noble Essence · {selectedIng.family} Accord
                </span>
                <span className="font-mono text-xs text-[#666666]">
                  100% Pure Botanical Absolute
                </span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-[0.03em]">
                {selectedIng.name}
              </h3>

              <p className="font-serif italic text-base text-[#D4D4D4] leading-relaxed font-light">
                &ldquo;{selectedIng.description}&rdquo;
              </p>

              <div className="pt-2">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#737373] mb-1">
                  Olfactory Impact & Alchemy
                </span>
                <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed">
                  {selectedIng.benefits}
                </p>
              </div>
            </div>

            {/* Right Action & Discovery */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#1F1F1F] lg:pl-8 space-y-4">
              <div className="space-y-1 text-left lg:text-right">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373] block">
                  Archive Integration
                </span>
                <p className="font-mono text-xs text-white">
                  Prominent in RANA Noir, Oud Nocturne & Sovereign
                </p>
              </div>

              <button
                onClick={() => onFindPerfumeWithIngredient(selectedIng.name)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
              >
                <span>Find Scents With {selectedIng.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
