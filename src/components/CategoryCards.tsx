/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CategoryCardsProps {
  onMenSelect: () => void;
  onWomenSelect: () => void;
}

export default function CategoryCards({ onMenSelect, onWomenSelect }: CategoryCardsProps) {
  return (
    <section id="categories" className="py-24 bg-black border-y border-white/5 relative">
      {/* Background radial spotlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-gold-700/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-gold-900/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16 overflow-visible">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A059] block mb-3 font-bold">
            Curated Spheres
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 overflow-visible py-1">
            Signature Collections
          </h2>
          <div className="h-[1px] w-20 bg-[#C5A059] mx-auto" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Men's Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative h-[420px] rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-end p-8 md:p-12 border border-gold-400/10 hover:border-gold-300/30 transition-all duration-500 light-sweep-container"
            onClick={onMenSelect}
          >
            {/* Dark wood abstract background overlay pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(21,28,42,0.6)_0%,_transparent_70%)] group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

            {/* Glowing spot */}
            <div className="absolute bottom-10 left-10 w-44 h-44 bg-blue-900/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative z-20 flex flex-col items-start">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold-300/70 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Noble Woody & Fresh
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight overflow-visible">
                Pour Homme
              </h3>
              <p className="font-sans text-xs text-gold-100/60 max-w-sm mb-6 leading-relaxed">
                Empowering, dry woods, bold spices, and royal leather chords. Meticulously designed for the distinguished masculine spirit.
              </p>
              <div className="flex items-center gap-2 text-xs font-sans text-gold-300 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                <span>Explore Men's</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Women's Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative h-[420px] rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-end p-8 md:p-12 border border-gold-400/10 hover:border-gold-300/30 transition-all duration-500 light-sweep-container"
            onClick={onWomenSelect}
          >
            {/* Delicate roses abstract gradient pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(95,30,42,0.4)_0%,_transparent_70%)] group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

            {/* Glowing spot */}
            <div className="absolute bottom-10 left-10 w-44 h-44 bg-rose-900/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative z-20 flex flex-col items-start">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold-300/70 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Radiant Floral & Sweet
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight overflow-visible">
                Pour Femme
              </h3>
              <p className="font-sans text-xs text-gold-100/60 max-w-sm mb-6 leading-relaxed">
                Elegant velvet roses, fresh blooming orchids, jasmine blossoms, and absolute vanilla pods. Designed for grace, beauty, and absolute allure.
              </p>
              <div className="flex items-center gap-2 text-xs font-sans text-gold-300 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                <span>Explore Women's</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
