/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Compass, Sparkles, Heart, Target, Eye, Users, ArrowLeft, Feather } from 'lucide-react';
import { perfumes } from '../data/perfumes';

interface AboutPageProps {
  onBackToStore: () => void;
  onExploreCatalog?: () => void;
}

export default function AboutPage({ onBackToStore, onExploreCatalog }: AboutPageProps) {
  const credentials = [
    {
      icon: <Compass className="w-5 h-5 text-white" />,
      title: 'Global Sourcing',
      desc: 'Madagascar bourbon vanilla, Grasse centifolia, Calabrian bergamot, and wild Assam oud responsibly acquired.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: '35% Extrait Longevity',
      desc: 'Our formulations boast 35% pure fragrance concentrate, ensuring sillage exceeding 24 hours on skin.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-white" />,
      title: '90-Day Cold Maceration',
      desc: 'Hand-blended in small-batch micro-runs, patiently matured to reach molecular equilibrium and dark depth.',
    },
    {
      icon: <Heart className="w-5 h-5 text-white" />,
      title: 'Cruelty-Free & Vegan',
      desc: 'Strictly cruelty-free, sustainable, vegan, and crafted without synthetic colorants or industrial fillers.',
    },
  ];

  const teamMembers = [
    {
      name: 'Devendra Rana',
      role: 'Founder & Chief Scent Architect',
      image: perfumes[1].image,
      bio: 'Visionary nose with 18+ years in luxury fine fragrances, bridging ancient Eastern distillation heritage with French haute perfumery.',
    },
    {
      name: 'Elena Vance',
      role: 'Master Perfumer & Olfactory Artist',
      image: perfumes[7].image,
      bio: 'Trained in Grasse, France. Specialist in aged agarwood (Oud) extraction and complex smoky heart orchestration.',
    },
    {
      name: 'Dr. Aamir Khan',
      role: 'Head of Botanical Sourcing & R&D',
      image: perfumes[2].image,
      bio: 'Ethnobotanist leading our sustainable raw material partnerships across Kashmir, Mysore, and Madagascar.',
    },
    {
      name: 'Sophia Kapoor',
      role: 'Creative Director & Brand Curator',
      image: perfumes[5].image,
      bio: 'Crafts the sensory visual identity and bespoke dark luxury presentation of RANA packaging across global ateliers.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans pb-24 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_0%,_transparent_70%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(255,255,255,0.02)_0%,_transparent_70%)] rounded-full blur-3xl pointer-events-none" />

      {/* HEADER NAVIGATION BAR */}
      <div className="border-b border-[#181818] bg-[#050505]/95 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="px-4 py-2 bg-[#0E0E0E] hover:bg-[#161616] text-[#A3A3A3] hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border border-[#242424]"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span>Back to Boutique</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-2xl font-light tracking-[0.2em] text-white">RANA</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-[#888888] block">
              HAUTE PARFUMERIE
            </span>
          </div>

          {onExploreCatalog && (
            <button
              onClick={onExploreCatalog}
              className="hidden sm:flex px-4 py-2 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer items-center gap-2"
            >
              <span>Explore Collection</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 space-y-20">
        {/* HERO TITLE */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#888888] font-medium block">
            THE WORLD OF RANA
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight text-white leading-tight">
            An Atelier Heritage of <br />
            <span className="text-[#A3A3A3] italic">
              Molecular Scentistry
            </span>
          </h1>
          <div className="h-[1px] w-24 bg-white/40 mx-auto my-4" />
          <p className="text-sm md:text-base text-[#888888] font-light leading-relaxed">
            RANA Perfumes is an artisanal fragrance house creating haute perfumery using rare, responsibly harvested ingredients from around the world. Every formulation is scientifically balanced and artistically assembled.
          </p>
        </div>

        {/* BRAND STORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#0B0B0B] border border-[#1E1E1E] p-6 sm:p-10">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-[#888888]">
              <Feather className="w-5 h-5 text-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3]">Our Brand Story</span>
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-light text-white leading-snug">
              Crafted in Limited Batches. Born from Pure Passion.
            </h2>
            <p className="text-xs md:text-sm text-[#888888] leading-relaxed font-light">
              Founded with an ambition to redefine luxury fragrance standards, RANA merges centuries-old artisanal distillation heritage with modern French molecular perfumery techniques.
            </p>
            <p className="text-xs md:text-sm text-[#888888] leading-relaxed font-light">
              Unlike mass-produced synthetic sprays, each RANA bottle undergoes a 90-day cold maturation process, yielding intense depth, seamless sillage, and extraordinary skin longevity.
            </p>
            <div className="p-4 bg-[#111111] border border-[#222222]">
              <p className="font-serif text-xs md:text-sm text-white italic">
                "A true luxury scent is an invisible coat of armor — a signature that introduces you before you speak, and lingers long after you leave."
              </p>
              <p className="text-[10px] font-mono text-[#737373] mt-2 uppercase tracking-wider font-semibold">
                — Devendra Rana, Founder
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center">
              <img
                src={perfumes[1].image}
                alt="RANA Heritage Bottle"
                className="w-full h-56 object-contain drop-shadow-2xl"
              />
            </div>
            <div className="p-6 bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center mt-6">
              <img
                src={perfumes[7].image}
                alt="RANA Essence"
                className="w-full h-56 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* MISSION & VISION SECTION */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#888888]">
              CORE PILLARS
            </span>
            <h2 className="font-serif text-3xl font-light text-white">Mission & Vision</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MISSION CARD */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 bg-[#0B0B0B] border border-[#1E1E1E] space-y-4"
            >
              <div className="w-12 h-12 bg-[#141414] border border-[#262626] flex items-center justify-center text-white">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-white">Our Mission</h3>
              <p className="text-xs md:text-sm text-[#888888] leading-relaxed font-light">
                To democratize haute artisanal perfumery across the globe by offering uncompromising Extraits de Parfum with 35% pure oil concentration, ethically sourced raw ingredients, and transparent pricing.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-[#A3A3A3] font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white" />
                  <span>100% Pure Non-Diluted Perfume Concentrate</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white" />
                  <span>Direct Ethical Sourcing from Local Harvesters</span>
                </li>
              </ul>
            </motion.div>

            {/* VISION CARD */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 bg-[#0B0B0B] border border-[#1E1E1E] space-y-4"
            >
              <div className="w-12 h-12 bg-[#141414] border border-[#262626] flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-white">Our Vision</h3>
              <p className="text-xs md:text-sm text-[#888888] leading-relaxed font-light">
                To become the world's most distinguished dark luxury fragrance house known for scientific elegance, sustainable botanical preservation, and bespoke olfactory consultations.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-[#A3A3A3] font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white" />
                  <span>Eco-Friendly Glass & Recyclable Packaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white" />
                  <span>Pioneering Next-Gen AI Olfactory Personalization</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* ARTISANAL VALUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((cred, i) => (
            <div
              key={i}
              className="p-6 bg-[#0B0B0B] border border-[#1E1E1E] space-y-3 hover:border-[#333333] transition-colors"
            >
              <div className="p-3 bg-[#141414] border border-[#242424] w-fit">{cred.icon}</div>
              <h4 className="font-serif text-base font-light text-white">{cred.title}</h4>
              <p className="text-xs text-[#888888] font-light leading-relaxed">{cred.desc}</p>
            </div>
          ))}
        </div>

        {/* TEAM SECTION */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#888888]">
              <Users className="w-5 h-5 text-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3]">The Scent Masters</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white">Meet Our Artisans & Leadership</h2>
            <p className="text-xs text-[#888888] font-light max-w-xl mx-auto">
              Our diverse team of master perfumers, botanists, and creative designers craft each formula with mathematical precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-[#0B0B0B] border border-[#1E1E1E] overflow-hidden group hover:border-[#383838] transition-all"
              >
                <div className="h-56 bg-[#070707] overflow-hidden relative flex items-center justify-center p-4 border-b border-[#1A1A1A]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg font-light text-white">
                    {member.name}
                  </h3>
                  <p className="font-mono text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#777777] font-light leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="p-8 md:p-12 bg-[#0B0B0B] border border-[#1E1E1E] text-white text-center space-y-6">
          <h2 className="font-serif text-2xl md:text-4xl font-light text-white">
            Experience the Heritage of RANA
          </h2>
          <p className="text-xs md:text-sm text-[#888888] max-w-2xl mx-auto font-light">
            Discover your individual signature perfume or let our AI Scent Concierge recommend a custom scent profile tailored to your personality.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onBackToStore}
              className="px-8 py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-semibold font-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Shop Fragrances
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
