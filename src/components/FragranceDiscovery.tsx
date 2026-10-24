/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RotateCcw, ShoppingBag, Eye } from 'lucide-react';
import { Perfume, PerfumeSize } from '../types';

interface FragranceDiscoveryProps {
  perfumes: Perfume[];
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, qty?: number, size?: PerfumeSize) => void;
}

type MoodOption = 'Fresh' | 'Elegant' | 'Sensual' | 'Mysterious' | 'Warm' | 'Powerful';
type OccasionOption = 'Everyday' | 'Office' | 'Evening' | 'Date Night' | 'Special Occasion';
type NoteOption = 'Oud' | 'Rose' | 'Vanilla' | 'Citrus' | 'Woody' | 'Amber' | 'Musk';

export default function FragranceDiscovery({
  perfumes,
  onQuickView,
  onAddToCart,
}: FragranceDiscoveryProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionOption | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<NoteOption[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const moods: { label: MoodOption; desc: string }[] = [
    { label: 'Fresh', desc: 'Crisp bergamot, ocean breeze, sparkling sea salt' },
    { label: 'Elegant', desc: 'Refined lavender, sheer iris, royal woods' },
    { label: 'Sensual', desc: 'Velvet damask rose, bourbon vanilla, cashmere' },
    { label: 'Mysterious', desc: 'Smoky midnight oud, dark incense, saffron' },
    { label: 'Warm', desc: 'Golden ambergris, sandalwood, roasted tonka' },
    { label: 'Powerful', desc: 'Russian leather, Assam agarwood, spiced tobacco' },
  ];

  const occasions: { label: OccasionOption; desc: string }[] = [
    { label: 'Everyday', desc: 'Effortless, clean and versatile signature' },
    { label: 'Office', desc: 'Polished, non-intrusive and sophisticated' },
    { label: 'Evening', desc: 'Deep, enveloping projection that commands respect' },
    { label: 'Date Night', desc: 'Intimate, warm and irresistibly alluring' },
    { label: 'Special Occasion', desc: 'Regal, opulent and unforgettable' },
  ];

  const noteChoices: { label: NoteOption; family: string }[] = [
    { label: 'Oud', family: 'Rare Agarwood Absolutes' },
    { label: 'Rose', family: 'Turkish Damask & Centifolia' },
    { label: 'Vanilla', family: 'Madagascar Bourbon Bean' },
    { label: 'Citrus', family: 'Calabrian Bergamot & Lemon' },
    { label: 'Woody', family: 'Mysore Sandalwood & Cedar' },
    { label: 'Amber', family: 'Warm Ambergris & Resins' },
    { label: 'Musk', family: 'Velvet Cashmere Musk' },
  ];

  const toggleNote = (note: NoteOption) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(selectedNotes.filter((n) => n !== note));
    } else {
      if (selectedNotes.length < 3) {
        setSelectedNotes([...selectedNotes, note]);
      }
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setSelectedOccasion(null);
    setSelectedNotes([]);
    setCurrentStep(1);
  };

  const recommendations = useMemo(() => {
    if (!selectedMood && !selectedOccasion && selectedNotes.length === 0) {
      return perfumes.slice(0, 3);
    }

    const scored = perfumes.map((perfume) => {
      let score = 0;
      if (selectedMood === 'Mysterious' && (perfume.category === 'Oud' || perfume.name.includes('Noir'))) score += 5;
      if (selectedMood === 'Powerful' && (perfume.id.includes('intense') || perfume.id.includes('sovereign'))) score += 5;
      if (selectedMood === 'Sensual' && (perfume.name.includes('Rose') || perfume.category === 'Women')) score += 5;
      if (selectedMood === 'Fresh' && perfume.notes.top.some((n) => n.toLowerCase().includes('bergamot'))) score += 4;
      if (selectedMood === 'Warm' && perfume.ingredients.includes('Amber')) score += 4;

      selectedNotes.forEach((note) => {
        if (perfume.ingredients.includes(note)) score += 3;
      });

      return { perfume, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((item) => item.perfume);
  }, [perfumes, selectedMood, selectedOccasion, selectedNotes]);

  return (
    <section id="discovery" className="py-24 bg-[#050505] text-[#F5F5F5] border-b border-[#181818] relative select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-white/60" />
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#888888]">
              BESPOKE SCENT FINDER
            </span>
            <span className="w-6 h-[1px] bg-white/60" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-3">
            Fragrance Discovery
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] max-w-md mx-auto font-light leading-relaxed">
            Answer three refined questions to reveal your ideal RANA extrait signature.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 font-mono text-[10px] uppercase tracking-wider">
            {['1. Aura', '2. Occasion', '3. Notes', '4. Signature'].map((step, idx) => (
              <span
                key={step}
                className={`px-3 py-1 border transition-all ${
                  currentStep === idx + 1
                    ? 'bg-white text-black border-white font-semibold'
                    : currentStep > idx + 1
                    ? 'bg-[#141414] text-white border-[#2A2A2A]'
                    : 'bg-[#0A0A0A] text-[#666666] border-[#1C1C1C]'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* STEP 1: MOOD */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((item) => {
                const isSelected = selectedMood === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedMood(item.label)}
                    className={`p-5 text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'bg-[#0D0D0D] border-[#1F1F1F] text-[#CCCCCC] hover:border-[#383838]'
                    }`}
                  >
                    <span className="font-serif text-lg font-light block mb-1">
                      {item.label}
                    </span>
                    <span className="font-sans text-[11px] opacity-75 font-light leading-relaxed block">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center pt-4">
              <button
                disabled={!selectedMood}
                onClick={() => setCurrentStep(2)}
                className={`px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                  selectedMood
                    ? 'bg-white text-black hover:bg-[#E5E5E5] cursor-pointer'
                    : 'bg-[#141414] text-[#555555] border border-[#222222] cursor-not-allowed'
                }`}
              >
                NEXT: SELECT OCCASION
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: OCCASION */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {occasions.map((item) => {
                const isSelected = selectedOccasion === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedOccasion(item.label)}
                    className={`p-5 text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'bg-[#0D0D0D] border-[#1F1F1F] text-[#CCCCCC] hover:border-[#383838]'
                    }`}
                  >
                    <span className="font-serif text-lg font-light block mb-1">
                      {item.label}
                    </span>
                    <span className="font-sans text-[11px] opacity-75 font-light leading-relaxed block">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3.5 border border-[#262626] text-[#A3A3A3] hover:text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                BACK
              </button>
              <button
                disabled={!selectedOccasion}
                onClick={() => setCurrentStep(3)}
                className={`px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                  selectedOccasion
                    ? 'bg-white text-black hover:bg-[#E5E5E5] cursor-pointer'
                    : 'bg-[#141414] text-[#555555] border border-[#222222] cursor-not-allowed'
                }`}
              >
                NEXT: PREFERRED ACCORDS
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: NOTES */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {noteChoices.map((item) => {
                const isSelected = selectedNotes.includes(item.label);
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleNote(item.label)}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'bg-[#0D0D0D] border-[#1F1F1F] text-[#CCCCCC] hover:border-[#383838]'
                    }`}
                  >
                    <span className="font-serif text-base font-light block mb-1">
                      {item.label}
                    </span>
                    <span className="font-mono text-[9px] opacity-70 block">
                      {item.family}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3.5 border border-[#262626] text-[#A3A3A3] hover:text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                BACK
              </button>
              <button
                disabled={selectedNotes.length === 0}
                onClick={() => setCurrentStep(4)}
                className={`px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all ${
                  selectedNotes.length > 0
                    ? 'bg-white text-black hover:bg-[#E5E5E5] cursor-pointer'
                    : 'bg-[#141414] text-[#555555] border border-[#222222] cursor-not-allowed'
                }`}
              >
                REVEAL MY SIGNATURE
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: RESULTS */}
        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#888888] block">
                  Tailored Olfactory Matches
                </span>
                <p className="font-mono text-xs text-white mt-1">
                  {selectedMood} · {selectedOccasion} · {selectedNotes.join(', ')}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#262626] text-xs font-mono text-[#CCCCCC] hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((perfume, idx) => (
                <div
                  key={perfume.id}
                  className="bg-[#0C0C0C] border border-[#1E1E1E] hover:border-[#383838] p-6 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#A3A3A3] bg-[#141414] px-2 py-0.5 border border-[#242424]">
                        {idx === 0 ? 'Primary Match' : 'Harmonic Scent'}
                      </span>
                      <span className="font-mono text-xs text-white">★ {perfume.rating}</span>
                    </div>

                    <div
                      onClick={() => onQuickView(perfume)}
                      className="h-56 bg-[#070707] border border-[#141414] flex items-center justify-center p-4 mb-4 cursor-pointer"
                    >
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="max-h-48 w-auto object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                      />
                    </div>

                    <h4 className="font-serif text-xl font-light text-white mb-1">
                      {perfume.name}
                    </h4>
                    <p className="font-mono text-[10px] text-[#737373] uppercase tracking-wider mb-2">
                      {perfume.category} · {perfume.accord}
                    </p>
                    <p className="font-sans text-xs text-[#A3A3A3] font-light line-clamp-2 mb-4">
                      {perfume.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-white">
                      ₹{perfume.price.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuickView(perfume)}
                        className="p-2 border border-[#262626] text-[#A3A3A3] hover:text-white cursor-pointer"
                        title="Inspect"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAddToCart(perfume, 1, '100ml')}
                        className="px-4 py-2 bg-white text-black font-mono text-[10px] uppercase font-semibold hover:bg-[#E5E5E5] cursor-pointer"
                      >
                        Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
