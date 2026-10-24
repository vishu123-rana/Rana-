/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Eye,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { Perfume } from '../types';
import { perfumes } from '../data/perfumes';

// High-resolution realistic luxury dark flacon images
import ranaNoirImg from '../assets/images/regenerated_image_1784869021466.png';
import ranaRoyalOudImg from '../assets/images/regenerated_image_1784869208985.png';
import ranaIntenseImg from '../assets/images/regenerated_image_1784869407630.png';
import ranaImperialImg from '../assets/images/Gemini_Generated_Image_e47xoce47xoce47x.png';

interface HeroProps {
  onExploreClick: () => void;
  onShopNowClick: () => void;
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
}

interface HeroSlide {
  indexStr: string;
  id: string;
  perfumeId: string;
  name: string;
  displayTitle: string;
  subtitle: string;
  leftHeadline: string;
  leftDescription: string;
  rightQuote: string;
  price: number;
  originalPrice: number;
  image: string;
  notes: string[];
  longevity: string;
  accord: string;
  accentGlow: string;
}

export default function Hero({
  onExploreClick,
  onShopNowClick,
  onQuickView,
  onAddToCart,
}: HeroProps) {
  // 4 Signature Hero Fragrances for the Dark Cinematic Campaign
  const slides: HeroSlide[] = [
    {
      indexStr: '01',
      id: 'rana-black',
      perfumeId: 'rana-noir',
      name: 'RANA BLACK',
      displayTitle: 'RANA BLACK',
      subtitle: 'EXTRAIT DE PARFUM · 35% CONCENTRATION',
      leftHeadline: 'RANA BLACK',
      leftDescription: 'A bold fragrance crafted for those who leave a lasting impression.',
      rightQuote:
        'Deep intensity. Timeless character. A signature fragrance designed for modern confidence.',
      price: 1899,
      originalPrice: 2699,
      image: ranaNoirImg,
      notes: ['Calabrian Bergamot', 'French Lavender', 'Smoked Amber', 'Mysore Sandalwood'],
      longevity: '18+ Hours Longevity',
      accord: 'Woody Chiaroscuro',
      accentGlow: 'rgba(255, 255, 255, 0.08)',
    },
    {
      indexStr: '02',
      id: 'rana-oud',
      perfumeId: 'rana-royal-oud',
      name: 'RANA OUD',
      displayTitle: 'RANA OUD',
      subtitle: 'ROYAL AGARWOOD & AMBER NOCTURNE',
      leftHeadline: 'RANA OUD',
      leftDescription: 'A nocturnal masterpiece born of aged Cambodian agarwood and dark resin.',
      rightQuote:
        'Rare woods distilled in darkness. Regal, enigmatic, and commanding an unforgettable sillage.',
      price: 2999,
      originalPrice: 4299,
      image: ranaRoyalOudImg,
      notes: ['Cambodian Agarwood', 'Taif Rose Petals', 'Smoked Ambergris', 'Dry Birch'],
      longevity: '24+ Hours Longevity',
      accord: 'Smoked Precious Oud',
      accentGlow: 'rgba(212, 175, 55, 0.07)',
    },
    {
      indexStr: '03',
      id: 'rana-noir-intense',
      perfumeId: 'rana-intense',
      name: 'NOIR INTENSE',
      displayTitle: 'RANA NOIR',
      subtitle: 'SMOKED TOBACCO & SPICED LEATHER',
      leftHeadline: 'RANA NOIR',
      leftDescription: 'A magnetic evening formulation created for the clandestine and the bold.',
      rightQuote:
        'Smoked Cuban tobacco leaf entwined with dark bourbon vanilla and burnished Russian leather.',
      price: 2499,
      originalPrice: 3499,
      image: ranaIntenseImg,
      notes: ['Kashmiri Saffron', 'Cuban Tobacco', 'Bourbon Vanilla', 'Russian Leather'],
      longevity: '20+ Hours Longevity',
      accord: 'Spiced Velvet Leather',
      accentGlow: 'rgba(255, 255, 255, 0.07)',
    },
    {
      indexStr: '04',
      id: 'rana-signature',
      perfumeId: 'rana-sovereign-imperial',
      name: 'SIGNATURE ÉLIXIR',
      displayTitle: 'RANA SIGNATURE',
      subtitle: 'MAISON ATELIER MASTERWORK',
      leftHeadline: 'RANA SIGNATURE',
      leftDescription: 'The pinnacle of our fragrance atelier, hand-blended in private Grasse cellars.',
      rightQuote:
        'Opulent black amber and powdered orris butter form an immortal tribute to distinction.',
      price: 3499,
      originalPrice: 4999,
      image: ranaImperialImg,
      notes: ['Florentine Orris', 'Imperial Black Amber', 'White Cedar', 'Bourbon Musk'],
      longevity: '24+ Hours Longevity',
      accord: 'Imperial Ambergris',
      accentGlow: 'rgba(255, 255, 255, 0.09)',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  // Resolve matching perfume object from catalog
  const matchingPerfume =
    perfumes.find((p) => p.id === currentSlide.perfumeId) || perfumes[0];

  // Automatic slow cinematic transition (can be paused or manually overridden)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-10 sm:pb-12 px-4 sm:px-8 lg:px-16 bg-[#050505] text-[#F5F5F5] overflow-hidden select-none border-b border-[#1A1A1A]"
    >
      {/* ======================================================== */}
      {/* 1. CINEMATIC ATMOSPHERIC BACKDROP & SUBTLE STUDIO GLOW   */}
      {/* ======================================================== */}
      {/* Subtle radial illumination centered behind the flacon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] lg:w-[1100px] h-[650px] sm:h-[850px] lg:h-[1100px] bg-[radial-gradient(circle,_rgba(255,255,255,0.06)_0%,_rgba(20,20,20,0.4)_45%,_rgba(5,5,5,0)_75%)] pointer-events-none rounded-full blur-2xl" />

      {/* Subtle top ambient vignette */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#000000] via-[#050505]/70 to-transparent pointer-events-none" />

      {/* Minimal grid lines for subtle editorial architectural texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* ======================================================== */}
      {/* 2. MASSIVE OVERLAPPING TYPOGRAPHY IN LOWER/MID SECTION   */}
      {/* Bold, high-fashion campaign scale typography             */}
      {/* ======================================================== */}
      <div className="absolute top-[48%] sm:top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-10 select-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id + '-typography'}
            initial={{ opacity: 0, y: 30, letterSpacing: '0.12em' }}
            animate={{ opacity: 0.18, y: 0, letterSpacing: '0.22em' }}
            exit={{ opacity: 0, y: -25, letterSpacing: '0.28em' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-black uppercase text-[#FFFFFF] text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[12vw] leading-none whitespace-nowrap drop-shadow-2xl"
          >
            {currentSlide.displayTitle}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN HERO COMPOSITION                                 */}
      {/* Central photorealistic bottle with side editorial text   */}
      {/* ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto py-6 sm:py-10">
        
        {/* Top Campaign Bar: Monogram & Subtitle */}
        <div className="text-center mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-[#242424] bg-[#0B0B0B]/80 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#A3A3A3] font-medium">
              HAUTE PARFUMERIE · PRIVATE ARCHIVE
            </span>
          </motion.div>
        </div>

        {/* 3-Column Hero Grid: Left Text Block | Center Realistic Bottle | Right Text Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* ==================================================== */}
          {/* LEFT INFORMATION BLOCK                               */}
          {/* ==================================================== */}
          <div className="lg:col-span-3 flex flex-col items-start text-left order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-left'}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="space-y-4 max-w-xs"
              >
                {/* Slide index & collection name */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs tracking-widest text-[#737373]">
                    {currentSlide.indexStr}
                  </span>
                  <span className="h-[1px] w-6 bg-[#333333]" />
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[#A3A3A3] uppercase">
                    Maison Edition
                  </span>
                </div>

                {/* Fragrance Name */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FFFFFF] tracking-[0.04em] leading-[1.05]">
                  {currentSlide.leftHeadline}
                </h1>

                {/* Left Description */}
                <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
                  {currentSlide.leftDescription}
                </p>

                {/* Accord & Price */}
                <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between w-full">
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                      Concentration
                    </span>
                    <span className="font-mono text-xs text-[#E5E5E5]">
                      Extrait 35%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                      Price
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">
                      ₹{currentSlide.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Button: EXPLORE NOW */}
                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={() => onQuickView(matchingPerfume)}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-none border border-white/80 bg-white text-[#050505] text-[11px] font-mono uppercase tracking-[0.22em] font-semibold hover:bg-transparent hover:text-white hover:border-white transition-all duration-300 cursor-pointer shadow-lg shadow-white/5"
                  >
                    <span>EXPLORE NOW</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onAddToCart(matchingPerfume)}
                    className="p-2.5 rounded-none border border-[#333333] bg-[#0E0E0E] text-[#D4D4D4] hover:text-white hover:border-white transition-all duration-200 cursor-pointer"
                    title="Add to Shopping Bag"
                    aria-label="Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ==================================================== */}
          {/* CENTER: LARGE REALISTIC PERFUME FLACON               */}
          {/* Glossy glass, detailed cap, studio reflections       */}
          {/* ==================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative order-1 lg:order-2 my-4 sm:my-0">
            {/* Ambient Flacon Glow Behind Glass */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 sm:w-80 h-80 sm:h-96 rounded-full bg-white/[0.04] blur-3xl" />
            </div>

            {/* Bottle Container with Smooth Cinematic Reveal */}
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[460px] aspect-[4/5] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id + '-flacon'}
                  initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full flex items-center justify-center cursor-pointer group"
                  onClick={() => onQuickView(matchingPerfume)}
                >
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />

                  {/* Subtle Studio Glass Reflection highlight overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40 pointer-events-none" />

                  {/* Interactive Quick View Cue on hover */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#050505]/90 border border-[#333333] text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5E5E5] backdrop-blur-md">
                      <Eye className="w-3 h-3" /> Quick Inspect Flacon
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Studio Pedestal / Ground Shadow */}
            <div className="w-64 sm:w-80 h-4 bg-[radial-gradient(ellipse,_rgba(0,0,0,0.95)_0%,_rgba(0,0,0,0)_75%)] blur-md mt-2" />
          </div>

          {/* ==================================================== */}
          {/* RIGHT INFORMATION BLOCK                              */}
          {/* ==================================================== */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end text-left lg:text-right order-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-right'}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="space-y-4 max-w-xs"
              >
                {/* Editorial Quote Block */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#737373] block">
                    Olfactory Narrative
                  </span>
                  <blockquote className="font-serif italic text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-light">
                    &ldquo;{currentSlide.rightQuote}&rdquo;
                  </blockquote>
                </div>

                {/* Fragrance Notes Highlights */}
                <div className="pt-3 border-t border-[#1F1F1F] space-y-1.5">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-[#737373]">
                    Dominant Chords
                  </span>
                  <div className="flex flex-wrap lg:justify-end gap-1.5">
                    {currentSlide.notes.map((note) => (
                      <span
                        key={note}
                        className="font-mono text-[10px] text-[#A3A3A3] bg-[#111111] px-2 py-0.5 border border-[#222222]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA BUTTON: EXPLORE COLLECTION */}
                <div className="pt-2">
                  <button
                    onClick={onExploreClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none border border-[#333333] hover:border-white bg-[#0A0A0A] hover:bg-[#151515] text-white text-[11px] font-mono uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM BAR: SOCIAL MEDIA · SLIDER · MINI PREVIEWS     */}
      {/* ======================================================== */}
      <div className="relative z-30 max-w-7xl mx-auto w-full pt-4 border-t border-[#171717] flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* ==================================================== */}
        {/* LEFT: MINIMAL WHITE SOCIAL MEDIA ICONS               */}
        {/* ==================================================== */}
        <div className="flex items-center gap-5 order-2 md:order-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555555] hidden sm:inline">
            Connect
          </span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888888] hover:text-white transition-colors duration-200"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888888] hover:text-white transition-colors duration-200"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888888] hover:text-white transition-colors duration-200"
            aria-label="X / Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        {/* ==================================================== */}
        {/* CENTER: HERO SLIDER CONTROLS (01 · 02 · 03 · 04)     */}
        {/* ==================================================== */}
        <div className="flex items-center gap-3 order-1 md:order-2">
          <button
            onClick={handlePrev}
            className="p-1.5 text-[#737373] hover:text-white transition-colors cursor-pointer"
            aria-label="Previous Fragrance"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-widest transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'text-white border-b border-white font-semibold'
                    : 'text-[#666666] hover:text-[#B3B3B3]'
                }`}
              >
                <span>{s.indexStr}</span>
                <span className="hidden sm:inline text-[9px] uppercase tracking-wider opacity-80">
                  {s.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-1.5 text-[#737373] hover:text-white transition-colors cursor-pointer"
            aria-label="Next Fragrance"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ==================================================== */}
        {/* RIGHT: FLOATING MINIATURE PRODUCT PREVIEW CARDS      */}
        {/* Clicking a miniature switches the main hero product! */}
        {/* ==================================================== */}
        <div className="flex items-center gap-2.5 order-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#555555] hidden lg:inline mr-1">
            Archive Flacons
          </span>
          {slides.map((slide, sIdx) => {
            const isActive = currentIndex === sIdx;
            return (
              <button
                key={'mini-' + slide.id}
                onClick={() => setCurrentIndex(sIdx)}
                className={`relative group w-12 sm:w-14 h-14 sm:h-16 p-1.5 rounded-none border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border-white bg-[#1A1A1A] shadow-md shadow-white/5'
                    : 'border-[#262626] bg-[#0E0E0E] hover:border-[#555555] opacity-60 hover:opacity-100'
                }`}
                title={`Switch to ${slide.name}`}
              >
                <img
                  src={slide.image}
                  alt={slide.name}
                  className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                />
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
