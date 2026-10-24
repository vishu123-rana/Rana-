/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PerfumeCategory } from '../types';

interface CollectionStoryProps {
  onSelectCategory: (category: PerfumeCategory | 'all' | 'Gift Sets') => void;
}

export default function CollectionStory({ onSelectCategory }: CollectionStoryProps) {
  const collections = [
    {
      id: 'rana-men',
      name: 'MEN',
      tagline: 'Chiaroscuro & Aristocratic Woods',
      category: 'Men' as PerfumeCategory,
      badge: 'Commanding Aura',
      notes: 'Calabrian Bergamot · Atlas Cedar · Smoked Leather',
      description:
        'Architectural, decisive, and magnetically structured. Conceived for those who move through the world with quiet authority.',
      subtleNumber: '01',
    },
    {
      id: 'rana-women',
      name: 'WOMEN',
      tagline: 'L’Élégance Céleste',
      category: 'Women' as PerfumeCategory,
      badge: 'Velvet Florals',
      notes: 'Damask Rose · Night-Blooming Jasmine · White Musk',
      description:
        'A lyrical study in high-fashion femininity. Petals plucked at dawn, macerated in crystalline ambroxan and dark amber.',
      subtleNumber: '02',
    },
    {
      id: 'rana-unisex',
      name: 'UNISEX',
      tagline: 'Sensory Equilibrium',
      category: 'Unisex' as PerfumeCategory,
      badge: 'Modern Minimalism',
      notes: 'Mysore Sandalwood · Sparkling Bergamot · White Amber',
      description:
        'Transcending traditional boundaries. An intimate dialogue between crisp mineral air and creamy precious woods.',
      subtleNumber: '03',
    },
    {
      id: 'oud-collection',
      name: 'OUD',
      tagline: 'Crown Agarwood Reserves',
      category: 'Oud' as PerfumeCategory,
      badge: 'Nocturnal Opulence',
      notes: 'Cambodian Wild Oud · Dark Incense · Smoked Saffron',
      description:
        'Distilled from decades-aged Aquilaria heartwood. Deep, hypnotic, and commanding over 24 hours of projection.',
      subtleNumber: '04',
    },
    {
      id: 'signature-collection',
      name: 'SIGNATURE',
      tagline: 'Grand Extraits de Parfum',
      category: 'Premium' as PerfumeCategory,
      badge: '35% Oil Concentration',
      notes: 'Rare Resin Absolutes · Florentine Orris · Black Amber',
      description:
        'The zenith of our maison’s art. Hand-filled in obsidian crystal flacons with numbered atelier certificates.',
      subtleNumber: '05',
    },
    {
      id: 'limited-edition',
      name: 'LIMITED EDITION',
      tagline: 'Numbered Coffret Presentations',
      category: 'Gift Sets' as any,
      badge: 'Collector Presentation',
      notes: 'Micro-Batch Extraits & Arabesque Presentation Coffrets',
      description:
        'The pinnacle collector’s tribute. Exclusive numbered seasonal extraits bottled in jewel glass with sculpted caps.',
      subtleNumber: '06',
    },
  ];

  return (
    <section
      id="collections"
      className="py-24 lg:py-32 bg-[#050505] text-[#F5F5F5] border-b border-[#181818] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-white/60" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
              SECTION 02 · ARCHIVE REPERTOIRE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white mb-4">
            The RANA Collection
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
            Six distinct olfactory territories. Each formulation is blended with natural essences
            at 35% extrait concentration, offering unparalleled longevity, sillage, and distinction.
          </p>
        </div>

        {/* 6 Collection Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((coll, idx) => (
            <motion.div
              key={coll.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => onSelectCategory(coll.category)}
              className="group relative bg-[#0C0C0C] border border-[#1E1E1E] hover:border-[#383838] p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 overflow-hidden"
            >
              {/* Subtle architectural number watermark */}
              <div className="absolute top-4 right-4 font-mono text-3xl font-light text-[#222222] group-hover:text-[#383838] transition-colors pointer-events-none select-none">
                {coll.subtleNumber}
              </div>

              <div>
                {/* Badge */}
                <span className="inline-block font-mono text-[9px] uppercase tracking-[0.25em] text-[#8E8E93] bg-[#141414] px-2.5 py-0.5 border border-[#262626] mb-4">
                  {coll.badge}
                </span>

                {/* Collection Name */}
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-[0.05em] mb-1 group-hover:text-white transition-colors">
                  {coll.name}
                </h3>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373] mb-4">
                  {coll.tagline}
                </p>

                {/* Narrative */}
                <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed mb-6">
                  {coll.description}
                </p>
              </div>

              {/* Notes & Explore Arrow */}
              <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#737373] truncate max-w-[75%]">
                  {coll.notes}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
