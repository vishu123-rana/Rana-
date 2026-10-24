/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Truck, Headphones } from 'lucide-react';

export default function AboutSection() {
  const trustPillars = [
    {
      icon: <ShieldCheck className="w-4 h-4 text-white" />,
      title: 'AUTHENTIC EXTRAITS',
      desc: '100% genuine formulations with 35% pure oil concentration, bottled and sealed in private Grasse ateliers.',
    },
    {
      icon: <Lock className="w-4 h-4 text-white" />,
      title: 'SECURE TRANSACTION',
      desc: 'Encrypted bank-grade payments supporting UPI, Cards, NetBanking, and discreet Cash on Delivery.',
    },
    {
      icon: <Truck className="w-4 h-4 text-white" />,
      title: 'DISCREET COURIER',
      desc: 'Air delivery in temperature-stabilized luxury black presentation boxes with numbered seals.',
    },
    {
      icon: <Headphones className="w-4 h-4 text-white" />,
      title: 'PRIVATE CONCIERGE',
      desc: 'Bespoke fragrance advisory, concierge scent matching, and dedicated connoisseur support.',
    },
  ];

  return (
    <section
      id="about"
      className="py-24 lg:py-32 bg-[#050505] text-[#F5F5F5] border-b border-[#181818] relative overflow-hidden select-none"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_0%,_transparent_70%)] rounded-full blur-[120px] pointer-events-none" />

      {/* Atmospheric watermark */}
      <div className="absolute -left-10 top-8 font-serif text-[180px] lg:text-[240px] font-black text-white/[0.015] pointer-events-none select-none tracking-tight">
        RANA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* BRAND STORY EDITORIAL HEADER */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-white/60" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
              SECTION 05 · BRAND PHILOSOPHY
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[0.03em] text-white leading-[1.05] mb-6">
            The Art of Fragrance
          </h2>

          <p className="font-serif italic text-lg sm:text-xl text-[#D4D4D4] leading-relaxed mb-6 border-l border-white/50 pl-4 font-light">
            &ldquo;True luxury is quiet, uncompromising, and commanding. A fragrance should never shout; it should seduce and endure.&rdquo;
          </p>

          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-light mb-4">
            At <strong>Maison RANA</strong>, fragrance formulation is approached not as industrial assembly, but as slow architectural sculpture. Every creation originates from the world’s most reclusive terroirs: wild Assamese agarwood matured over decades, Turkish Damask roses hand-picked before dawn, and Calabrian bergamot married with velvet Mysore sandalwood.
          </p>

          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] leading-relaxed font-light">
            Each blend is allowed to rest undisturbed for six months in climate-controlled dark rooms. This patience ensures delicate volatile aldehydes fuse seamlessly with dense resinous absolutes, resulting in a rich 35% extrait concentration that unfolds in cinematic chapters on warm skin.
          </p>
        </div>

        {/* TRUST PILLARS */}
        <div className="mt-16 pt-12 border-t border-[#1A1A1A]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#737373] block mb-2">
              The Maison RANA Standard
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
              Pillars of Distinction
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-[#0B0B0B] border border-[#1E1E1E] hover:border-[#383838] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 bg-[#141414] border border-[#242424] flex items-center justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-2">
                    {pillar.title}
                  </h4>
                  <p className="font-sans text-xs text-[#8E8E93] font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
