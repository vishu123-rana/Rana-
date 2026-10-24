/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Leaf, Compass } from 'lucide-react';
import ranaRoyalOudImg from '../assets/images/regenerated_image_1784869208985.png';
import ranaNoirImg from '../assets/images/regenerated_image_1784869021466.png';
import ranaOceanBreezeImg from '../assets/images/regenerated_image_1784869320229.png';
import ranaVelvetRoseImg from '../assets/images/regenerated_image_1784869624493.png';
import ranaIntenseImg from '../assets/images/regenerated_image_1784869407630.png';
import ranaCrystalImg from '../assets/images/regenerated_image_1784869746827.png';
import ranaGoldEssenceImg from '../assets/images/regenerated_image_1784869753135.png';

interface ShopByFragranceProps {
  onSelectFamily: (familyKey: string) => void;
}

export default function ShopByFragrance({ onSelectFamily }: ShopByFragranceProps) {
  const fragranceFamilies = [
    {
      key: 'Oud',
      name: 'Oud & Woods',
      accent: 'Rare Assam Agarwood',
      desc: 'Deep, resinous agarwood, charred sacred woods, and warm resinous amber.',
      image: ranaRoyalOudImg,
      badge: 'Royal Reserve',
      botanicalColor: 'from-[#191308] to-[#2E200C]',
    },
    {
      key: 'Woody',
      name: 'Woody Chiaroscuro',
      accent: 'Atlas Cedar & Mysore Santal',
      desc: 'Majestic cedarwood, smooth santal cream, and dark patchouli roots.',
      image: ranaNoirImg,
      badge: 'Classic Elegance',
      botanicalColor: 'from-[#121E17] to-[#1C3327]',
    },
    {
      key: 'Fresh',
      name: 'Fresh Aquatic',
      accent: 'Marine Sea Moss & Morning Dew',
      desc: 'Crisp saline breeze, crushed mint, water droplets, and coastal driftwood.',
      image: ranaOceanBreezeImg,
      badge: 'Revitalizing',
      botanicalColor: 'from-[#0B1E24] to-[#14323B]',
    },
    {
      key: 'Floral',
      name: 'Floral Sublime',
      accent: 'Damask Rose & French Jasmine',
      desc: 'Velvet petals, night-blooming white florals, and sweet powdered iris.',
      image: ranaVelvetRoseImg,
      badge: 'Haute Feminine',
      botanicalColor: 'from-[#2A1218] to-[#3B1922]',
    },
    {
      key: 'Oriental',
      name: 'Oriental Spice',
      accent: 'Kashmiri Saffron & Bourbon Vanilla',
      desc: 'Smoky tobacco leaf, dark ambergris, warm clove, and sweet vanilla pods.',
      image: ranaIntenseImg,
      badge: 'Sensual Evening',
      botanicalColor: 'from-[#26150C] to-[#3B1F13]',
    },
    {
      key: 'Citrus',
      name: 'Citrus Zest',
      accent: 'Calabrian Bergamot & Neroli',
      desc: 'Sparkling sun-ripened citrus orchards, bitter orange, and crisp neroli.',
      image: ranaCrystalImg,
      badge: 'Radiant Day',
      botanicalColor: 'from-[#1C200B] to-[#2E3514]',
    },
    {
      key: 'Unisex',
      name: 'Unisex Harmony',
      accent: 'Warm Amber Santal & Musk',
      desc: 'Balanced cashmere woods, mineral salt, golden amber, and soft velvet musk.',
      image: ranaGoldEssenceImg,
      badge: 'Timeless Allure',
      botanicalColor: 'from-[#1C1820] to-[#2E2633]',
    },
  ];

  return (
    <section
      id="fragrance-families"
      className="py-20 lg:py-28 px-4 sm:px-8 lg:px-12 bg-[#F5F2EB] text-[#16221A] border-b border-[#16221A]/10 select-none relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#3B5B47] block mb-2 font-bold">
            Olfactory Families
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-[0.02em] text-[#16221A] mb-4">
            Shop By Fragrance
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#2E3E34]/75 max-w-xl mx-auto font-light leading-relaxed">
            Every fragrance begins with pure botanical taxonomy. Discover our master collections categorized by scent architecture.
          </p>
          <div className="h-[2px] w-20 bg-[#3B5B47]/30 mx-auto mt-4" />
        </div>

        {/* Categories Grid (7 Categories) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fragranceFamilies.map((fam, idx) => (
            <motion.div
              key={fam.key}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => onSelectFamily(fam.key)}
              className={`group rounded-2xl bg-white border border-[#16221A]/10 hover:border-[#3B5B47]/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between p-6 ${
                idx === 6 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#3B5B47] bg-[#FAF8F2] px-2.5 py-0.5 rounded-full font-bold border border-[#16221A]/5">
                    {fam.badge}
                  </span>
                  <span className="font-mono text-[10px] text-[#2E3E34]/60">
                    {fam.key}
                  </span>
                </div>

                {/* Botanical Bottle Image Preview */}
                <div className="relative h-44 rounded-xl bg-[#FAF8F2] flex items-center justify-center p-3 mb-4 overflow-hidden group-hover:bg-[#F2EFE8] transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(125,154,131,0.12)_0%,_transparent_65%)] pointer-events-none" />
                  <img
                    src={fam.image}
                    alt={fam.name}
                    className="max-h-36 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Name & Accent */}
                <h3 className="font-serif text-xl font-bold text-[#16221A] group-hover:text-[#274233] transition-colors leading-snug">
                  {fam.name}
                </h3>
                <span className="font-mono text-[11px] text-[#3B5B47] font-semibold block mt-1">
                  {fam.accent}
                </span>

                {/* Description */}
                <p className="font-sans text-xs text-[#2E3E34]/70 font-light mt-2 leading-relaxed">
                  {fam.desc}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="pt-4 mt-4 border-t border-[#16221A]/10 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#274233] font-bold group-hover:text-[#3B5B47]">
                <span>Discover Scents</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
