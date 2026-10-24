/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Copy, Check, Sparkles, Compass, Eye, ShoppingBag } from 'lucide-react';
import Bottle3D from './Bottle3D';
import { perfumes } from '../data/perfumes';
import { Perfume } from '../types';

interface PhotorealisticShowcaseProps {
  onQuickView: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
}

type PhotorealisticPresetKey =
  | 'rana-noir'
  | 'rana-royal-oud'
  | 'rana-ocean-breeze'
  | 'rana-intense'
  | 'rana-bloom'
  | 'rana-velvet-rose'
  | 'rana-crystal'
  | 'rana-gold-essence';

export default function PhotorealisticShowcase({
  onQuickView,
  onAddToCart,
}: PhotorealisticShowcaseProps) {
  const [activePresetKey, setActivePresetKey] = useState<PhotorealisticPresetKey>('rana-noir');
  const [copied, setCopied] = useState(false);
  const [isCapOff, setIsCapOff] = useState(true);
  const [sweepTrigger, setSweepTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

  const flagshipData = {
    'rana-noir': {
      perfumeId: 'rana-noir',
      title: 'RANA NOIR',
      subtitle: 'The Absolute Black Hero',
      tag: 'Obsidian & Shadow',
      theme: 'noir' as const,
      accentColor: '#38bdf8',
      surface: 'Dark Wet Slate Surface with Edge Reflections',
      background: 'Velvety Deep-Teal Draped Fabric',
      lighting: 'Chiaroscuro Edge Lighting & Brushed Gold Cap Accent',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA NOIR perfume. The glass bottle is custom-made from flawless, heavy obsidian-black polished crystal, giving it a deep, obsidian-like sheen that absorbs light. The central label is a polished brass plate, finely etched with the word "RANA" in a minimalist serif font and "NOIR" below it. The heavy metal cap is brushed gold with a machined texture. The bottle is presented in 3/4 view, resting on a dark, wet slate surface that provides a perfect reflection. The background is a velvety, deep-teal fabric draped in elegant folds. Dramatic chiaroscuro lighting catches the edges of the glass and the metallic elements. The image is clean, sharp, and luxurious.',
    },
    'rana-royal-oud': {
      perfumeId: 'rana-royal-oud',
      title: 'RANA ROYAL OUD',
      subtitle: 'The Rich Amber & Gold',
      tag: 'Royal Agarwood',
      theme: 'royal-oud' as const,
      accentColor: '#f59e0b',
      surface: 'Rare Polished Agarwood Block with Intricate Grain',
      background: 'Deep Chocolate-Brown Silk Drapes',
      lighting: 'Warm Golden Rim-Lighting & Viscous Amber Glow',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA ROYAL OUD perfume. The clear crystal glass bottle is filled with a rich, dark amber, slightly viscous perfume oil, which appears warm. The central label is a polished brass plate, finely etched with "RANA" in a minimalist serif font and "ROYAL OUD" below it. The heavy, polished gold cap is shaped with subtle, geometric facets to catch the light like a jewel. The bottle sits on a block of rare, polished Agarwood (Oud wood), which has intricate grain patterns. The background is a soft-focus drape of deep, rich chocolate-brown silk. Warm, golden rim-lighting defines the shape of the bottle, creating a sophisticated glow. The overall mood is affluent and exotic.',
    },
    'rana-ocean-breeze': {
      perfumeId: 'rana-ocean-breeze',
      title: 'RANA OCEAN BREEZE',
      subtitle: 'The Cool Cyan Aquatic',
      tag: 'Fresh Aquatic',
      theme: 'ocean-breeze' as const,
      accentColor: '#06b6d4',
      surface: 'Grey Sea Glass & Weathered White Ocean Pebble',
      background: 'Sun-Dappled Blue & Sand Bokeh',
      lighting: 'Crisp Natural Daylight & Fine Water Droplet Dusting',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA OCEAN BREEZE perfume. The clear crystal glass bottle is filled with a perfectly clear, vibrant aquatic cyan blue liquid, evoking deep ocean water. The central label is a polished brass plate, finely etched with "RANA" in a minimalist serif font and "OCEAN BREEZE" below it. The heavy metal cap is polished gold with a textured rim. The bottle is presented in an elevated position, partially resting on a smooth, weathered piece of grey sea glass and a small, perfectly white, rounded ocean pebble. Subtle, small water droplets and a fine salt-like dusting are visible on the surface of the bottle and surrounding glass. The background is a soft, sun-dappled blend of blue and sand tones, completely out of focus (bokeh). Cool, crisp, natural daylight highlights the transparency and color of the liquid. The composition is fresh and invigorating.',
    },
    'rana-intense': {
      perfumeId: 'rana-intense',
      title: 'RANA INTENSE',
      subtitle: 'The Deepest, Warmest Spicy',
      tag: 'Burgundy & Tobacco',
      theme: 'intense' as const,
      accentColor: '#f43f5e',
      surface: 'Highly Polished Dark Wood Surface',
      background: 'Rich Coppery-Brown & Charcoal Drapes',
      lighting: 'Low-Key Warm Rim-Light & Molasses Amber Depth',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA INTENSE perfume. The clear crystal glass bottle is filled with a very dark, deep burgundy and molasses-colored amber liquid, indicating concentration. The central label is a polished brass plate, finely etched with "RANA" in a minimalist serif font and "INTENSE" below it. The heavy metal cap is brushed gold. The bottle sits on a surface of highly polished, dark wood, reflecting the rich liquid. The background is a soft-focus scene of rich, deep coppery-brown and charcoal-grey drapes. The lighting is low-key and dramatic, with a sophisticated warm rim-light that makes the deep color of the liquid visible and defines the edges of the heavy glass and gold cap. The mood is sophisticated and deep.',
    },
    'rana-bloom': {
      perfumeId: 'rana-bloom',
      title: 'RANA BLOOM',
      subtitle: 'Blush Rose & White Jasmine',
      tag: 'Floral Radiance',
      theme: 'bloom' as const,
      accentColor: '#fb7185',
      surface: 'White Carrara Marble Slabs with Gold Veins',
      background: 'Soft Pastel Blush-Pink & Cream Drapes',
      lighting: 'Diffused Soft Studio Daylight & Dewy Petal Reflections',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA BLOOM perfume. The clear crystal glass bottle is filled with a soft blush-pink fragrance elixir that glows with inner radiance. The central label is a polished brass plate, finely etched with "RANA" in a minimalist serif font and "BLOOM" below it. The heavy metal cap is polished rose-gold with a textured collar. The bottle stands on a slab of white Carrara marble with fine gold veins, surrounded by fresh, dewy white rose and jasmine petals scattered gently around the base. Soft, diffused daylight illuminates the scene, casting romantic highlights across the glass. The mood is feminine, fresh, and ethereal.',
    },
    'rana-velvet-rose': {
      perfumeId: 'rana-velvet-rose',
      title: 'RANA VELVET ROSE',
      subtitle: 'Deep Turkish Rose & Amber',
      tag: 'Sensual Velvet',
      theme: 'velvet-rose' as const,
      accentColor: '#be123c',
      surface: 'Dark Polished Mahogany with Deep Crimson Reflections',
      background: 'Heavy Royal Burgundy Velvet Drape',
      lighting: 'Warm Low-Key Spotlight & Crimson Edge Glow',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA VELVET ROSE perfume. The clear crystal glass bottle reveals a deep crimson-red rose absolute liquid that catches the light like a ruby. The central label is a polished brass plate, finely etched with "RANA" in a minimalist serif font and "VELVET ROSE" below it. The heavy cap is polished gold with a faceted crown. The bottle rests on a dark mahogany wooden surface, framed by luxurious folds of heavy royal burgundy velvet. A soft spotlight brings out the rich red hue of the liquid and creates sharp metallic glints on the gold cap. Deep, romantic, and alluring.',
    },
    'rana-crystal': {
      perfumeId: 'rana-crystal',
      title: 'RANA CRYSTAL',
      subtitle: 'Diamond Clarity & White Musk',
      tag: 'Crystal Sophistication',
      theme: 'crystal' as const,
      accentColor: '#38bdf8',
      surface: 'White Quartz Crystal Cluster & Mirrored Glass Pedestal',
      background: 'Bioluminescent Silver-White Silk Fog',
      lighting: 'Crisp High-Contrast Prism Refraction',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA CRYSTAL perfume. The bottle is cut from diamond-clear, heavy leaded crystal glass with precision facets that refract light into spectral prisms. The liquid inside is water-clear and pristine. The central label is a silver-polished metal plate, etched with "RANA" and "CRYSTAL". The heavy cap is frosted platinum-silver with diamond knurling. The bottle sits atop a raw white quartz crystal cluster on a mirror surface. High-contrast crisp studio lighting creates brilliant starburst reflections and prism glows across the crystal edges. Ultra-clean, sophisticated, and luminous.',
    },
    'rana-gold-essence': {
      perfumeId: 'rana-gold-essence',
      title: 'RANA GOLD ESSENCE',
      subtitle: '24K Molten Saffron & Royal Oud',
      tag: '24K Molten Gold',
      theme: 'gold-essence' as const,
      accentColor: '#dbb362',
      surface: 'Polished Mirror Gold Plate with Saffron Filaments',
      background: 'Deep Onyx Black & Molten Gold Fabric',
      lighting: 'Dramatic Golden Rim-Light & Radiating Luxe Aura',
      prompt:
        'A professional, ultra-high-resolution product photograph of the RANA GOLD ESSENCE perfume. The heavy crystal bottle contains a thick, molten 24K golden elixir that shimmers with amber warmth. The central label is a heavy 24K gold plate, deeply engraved with "RANA" and "GOLD ESSENCE". The cap is a massive faceted 24K gold block. The bottle is showcased on a gold mirror platform with delicate saffron threads resting at the base. Deep onyx black background with golden rim lighting emphasizes the majestic, royal aesthetic. Unapologetically opulent and legendary.',
    },
  };

  const activeConfig = flagshipData[activePresetKey];
  const matchedPerfume = perfumes.find((p) => p.id === activeConfig.perfumeId);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeConfig.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="photorealistic-studio" className="py-24 bg-[#F2F1EE] border-t border-[#1A1A1A]/10 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-left mb-16">
          <span className="label-mono mb-2 block">Studio & Photography Prompts</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
            Photorealistic Product Photography
          </h2>
          <p className="font-sans text-base text-[#1A1A1A]/70 max-w-2xl font-light leading-relaxed">
            Explore studio-grade prompts and interactive 3D simulations crafted for RANA fragrances. Copy prompts with one click for AI image generation.
          </p>
        </div>

        {/* Preset Selector Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {(Object.keys(flagshipData) as PhotorealisticPresetKey[]).map((key) => {
            const preset = flagshipData[key];
            const isActive = activePresetKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActivePresetKey(key);
                  setSweepTrigger((prev) => prev + 1);
                }}
                className={`p-5 border transition-all duration-300 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#F8F7F4] border-[#1A1A1A]'
                    : 'bg-[#F8F7F4] text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30'
                }`}
              >
                <span className={`font-mono text-[0.6rem] uppercase tracking-widest block mb-2 ${isActive ? 'text-[#C5A059]' : 'text-[#1A1A1A]/50'}`}>
                  {preset.tag}
                </span>
                <h3 className="font-serif text-lg font-normal mb-1">
                  {preset.title}
                </h3>
                <p className={`font-sans text-xs ${isActive ? 'text-[#F8F7F4]/70' : 'text-[#1A1A1A]/60'}`}>
                  {preset.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Showcase Stage Container */}
        <div className="p-8 md:p-12 bg-[#F8F7F4] border border-[#1A1A1A]/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive Render or Photograph */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[380px]">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setViewMode('photo')}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-[#1A1A1A] text-[#F8F7F4] font-bold'
                    : 'bg-[#F2F1EE] text-[#1A1A1A]/70 border border-[#1A1A1A]/10'
                }`}
              >
                Photography
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-[#1A1A1A] text-[#F8F7F4] font-bold'
                    : 'bg-[#F2F1EE] text-[#1A1A1A]/70 border border-[#1A1A1A]/10'
                }`}
              >
                3D Interactive
              </button>
            </div>

            {/* Stage content */}
            {viewMode === 'photo' ? (
              <div className="w-full max-w-xs h-[340px] relative border border-[#1A1A1A]/10 overflow-hidden bg-[#F2F1EE] flex items-center justify-center p-2">
                {matchedPerfume?.image ? (
                  <img
                    src={matchedPerfume.image}
                    alt={activeConfig.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-[#1A1A1A]/30">
                    {activeConfig.title}
                  </div>
                )}
              </div>
            ) : (
              <Bottle3D
                key={`${activePresetKey}-${sweepTrigger}`}
                gender={activePresetKey === 'rana-ocean-breeze' || activePresetKey === 'rana-noir' ? 'men' : 'women'}
                accentColor={activeConfig.accentColor}
                liquidHeightPercent={75}
                name={activeConfig.title.replace('RANA ', '')}
                isInteractive={true}
                theme={activeConfig.theme}
                isCapOff={isCapOff}
              />
            )}
          </div>

          {/* Right Column: Prompt & Spec Breakdown */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                  AI Prompt Studio
                </span>
                <h3 className="font-serif text-3xl font-light text-[#1A1A1A]">
                  {activeConfig.title}
                </h3>
              </div>

              {matchedPerfume && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(matchedPerfume)}
                    className="btn-editorial-secondary py-2 px-3 text-xs font-mono"
                  >
                    Quick View
                  </button>
                  <button
                    onClick={() => onAddToCart(matchedPerfume)}
                    className="btn-editorial-primary py-2 px-4 text-xs font-mono"
                  >
                    Buy ₹{matchedPerfume.price.toLocaleString('en-IN')}
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Display Box */}
            <div className="p-5 bg-[#F2F1EE] border border-[#1A1A1A]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#1A1A1A]/70 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#C5A059]" />
                  <span>Prompt Text</span>
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 bg-[#1A1A1A] text-[#F8F7F4] hover:bg-[#C5A059] font-mono text-[0.65rem] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              <p className="font-mono text-xs text-[#1A1A1A]/80 leading-relaxed bg-[#F8F7F4] p-4 border border-[#1A1A1A]/10 select-all">
                "{activeConfig.prompt}"
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#F2F1EE] border border-[#1A1A1A]/10">
                <span className="text-[#C5A059] font-bold block mb-1 uppercase text-[0.6rem]">Surface</span>
                <span className="text-[#1A1A1A]/70">{activeConfig.surface}</span>
              </div>
              <div className="p-3 bg-[#F2F1EE] border border-[#1A1A1A]/10">
                <span className="text-[#C5A059] font-bold block mb-1 uppercase text-[0.6rem]">Background</span>
                <span className="text-[#1A1A1A]/70">{activeConfig.background}</span>
              </div>
              <div className="p-3 bg-[#F2F1EE] border border-[#1A1A1A]/10">
                <span className="text-[#C5A059] font-bold block mb-1 uppercase text-[0.6rem]">Lighting</span>
                <span className="text-[#1A1A1A]/70">{activeConfig.lighting}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

