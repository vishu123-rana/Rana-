/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Award } from 'lucide-react';
import { perfumes } from '../data/perfumes';
import { Perfume } from '../types';

interface OlfactoryTimelineProps {
  onSelectPerfume?: (perfume: Perfume) => void;
  onAddToCart?: (perfume: Perfume) => void;
}

export default function OlfactoryTimeline({ onSelectPerfume, onAddToCart }: OlfactoryTimelineProps) {
  const [selectedId, setSelectedId] = useState<string>('rana-royal-oud');
  const [timeStage, setTimeStage] = useState<'top' | 'heart' | 'base'>('top');

  const perfume = perfumes.find((p) => p.id === selectedId) || perfumes[0];

  const getOlfactoryMetrics = (pId: string) => {
    switch (pId) {
      case 'rana-royal-oud':
        return {
          longevity: '18 - 24 Hours',
          sillage: 'Enveloping (Intense)',
          family: 'Woody Oriental / Oud',
          topDuration: '0 - 30 Mins',
          heartDuration: '30 Mins - 4 Hrs',
          baseDuration: '4 - 24 Hrs',
          radar: { woody: 95, amber: 90, fresh: 25 },
        };
      case 'rana-noir':
        return {
          longevity: '12 - 16 Hours',
          sillage: 'Strong & Magnetic',
          family: 'Aromatic Woody Citrus',
          topDuration: '0 - 20 Mins',
          heartDuration: '20 Mins - 3.5 Hrs',
          baseDuration: '3.5 - 16 Hrs',
          radar: { woody: 80, amber: 70, fresh: 85 },
        };
      default:
        return {
          longevity: '12 - 16 Hours',
          sillage: 'Balanced & Refined',
          family: 'Fine Artisanal Blend',
          topDuration: '0 - 30 Mins',
          heartDuration: '30 Mins - 4 Hrs',
          baseDuration: '4 - 16 Hrs',
          radar: { woody: 70, amber: 70, fresh: 60 },
        };
    }
  };

  const metrics = getOlfactoryMetrics(perfume.id);

  return (
    <section id="olfactory-timeline" className="py-24 bg-[#F8F7F4] border-t border-[#1A1A1A]/10 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-left mb-16">
          <span className="label-mono mb-2 block">Olfactory Evolution</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
            How RANA Perfumes Evolve
          </h2>
          <p className="font-sans text-base text-[#1A1A1A]/70 max-w-2xl font-light leading-relaxed">
            Fine perfume is dynamic. Explore the 3-tier evaporation timeline from immediate top notes to lingering base notes on skin.
          </p>
        </div>

        {/* Perfume Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {perfumes.slice(0, 6).map((p) => {
            const isActive = p.id === selectedId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#F8F7F4] border-[#1A1A1A]'
                    : 'bg-[#F2F1EE] text-[#1A1A1A]/70 border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Product Visual & Metrics */}
          <div className="lg:col-span-5 bg-[#F2F1EE] p-8 border border-[#1A1A1A]/10 flex flex-col justify-between text-left">
            <div>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[#C5A059] block mb-2">
                {metrics.family}
              </span>

              <h3 className="font-serif text-3xl font-light text-[#1A1A1A] mb-2">
                {perfume.name}
              </h3>
              <p className="font-sans text-sm text-[#1A1A1A]/70 leading-relaxed font-light mb-6">
                {perfume.description}
              </p>

              <div className="relative h-60 my-4 flex items-center justify-center bg-[#F8F7F4] border border-[#1A1A1A]/10 overflow-hidden">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  referrerPolicy="no-referrer"
                  className="h-full object-contain p-4"
                />
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-3 my-4 font-mono text-xs">
                <div className="p-3 bg-[#F8F7F4] border border-[#1A1A1A]/10">
                  <span className="text-[#C5A059] block text-[0.6rem] uppercase">Longevity</span>
                  <span className="text-[#1A1A1A] font-bold">{metrics.longevity}</span>
                </div>
                <div className="p-3 bg-[#F8F7F4] border border-[#1A1A1A]/10">
                  <span className="text-[#C5A059] block text-[0.6rem] uppercase">Sillage</span>
                  <span className="text-[#1A1A1A] font-bold">{metrics.sillage}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between gap-4 mt-auto">
              <div>
                <span className="font-mono text-[0.6rem] uppercase text-[#1A1A1A]/50 block">Price</span>
                <span className="font-serif text-2xl font-light text-[#1A1A1A]">
                  ₹{perfume.price.toLocaleString('en-IN')}
                </span>
              </div>

              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(perfume)}
                  className="btn-editorial-primary py-3 px-6 text-xs font-mono"
                >
                  Acquire Scent
                </button>
              )}
            </div>
          </div>

          {/* Right Column: 3-Stage Scent Timeline */}
          <div className="lg:col-span-7 bg-[#F2F1EE] p-8 border border-[#1A1A1A]/10 flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">
                    Evaporation Timeline
                  </span>
                  <h4 className="font-serif text-2xl font-light text-[#1A1A1A]">
                    Scent Pyramid Breakdown
                  </h4>
                </div>

                <div className="flex items-center gap-1 bg-[#F8F7F4] p-1 border border-[#1A1A1A]/10 font-mono text-xs">
                  <button
                    onClick={() => setTimeStage('top')}
                    className={`px-3 py-1 uppercase transition-colors cursor-pointer ${
                      timeStage === 'top' ? 'bg-[#1A1A1A] text-[#F8F7F4]' : 'text-[#1A1A1A]/60'
                    }`}
                  >
                    Top
                  </button>
                  <button
                    onClick={() => setTimeStage('heart')}
                    className={`px-3 py-1 uppercase transition-colors cursor-pointer ${
                      timeStage === 'heart' ? 'bg-[#1A1A1A] text-[#F8F7F4]' : 'text-[#1A1A1A]/60'
                    }`}
                  >
                    Heart
                  </button>
                  <button
                    onClick={() => setTimeStage('base')}
                    className={`px-3 py-1 uppercase transition-colors cursor-pointer ${
                      timeStage === 'base' ? 'bg-[#1A1A1A] text-[#F8F7F4]' : 'text-[#1A1A1A]/60'
                    }`}
                  >
                    Base
                  </button>
                </div>
              </div>

              {/* 3-Tier Visual Pyramid Cards */}
              <div className="space-y-4">
                {/* 1. Top Notes Card */}
                <div
                  onClick={() => setTimeStage('top')}
                  className={`p-5 border transition-all cursor-pointer ${
                    timeStage === 'top' ? 'bg-[#1A1A1A] text-[#F8F7F4] border-[#1A1A1A]' : 'bg-[#F8F7F4] text-[#1A1A1A] border-[#1A1A1A]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#C5A059]">
                      1. Top Notes (Opening)
                    </span>
                    <span>⏱ {metrics.topDuration}</span>
                  </div>
                  <p className="font-sans text-xs opacity-80 mb-3 font-light">
                    Initial volatile impression awakened immediately upon application.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.top.map((note, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#C5A059]/20 text-[#C5A059] font-mono text-[0.65rem]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Heart Notes Card */}
                <div
                  onClick={() => setTimeStage('heart')}
                  className={`p-5 border transition-all cursor-pointer ${
                    timeStage === 'heart' ? 'bg-[#1A1A1A] text-[#F8F7F4] border-[#1A1A1A]' : 'bg-[#F8F7F4] text-[#1A1A1A] border-[#1A1A1A]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#C5A059]">
                      2. Heart Notes (Personality)
                    </span>
                    <span>⏱ {metrics.heartDuration}</span>
                  </div>
                  <p className="font-sans text-xs opacity-80 mb-3 font-light">
                    The core signature that develops after top notes soften.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.heart.map((note, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#C5A059]/20 text-[#C5A059] font-mono text-[0.65rem]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Base Notes Card */}
                <div
                  onClick={() => setTimeStage('base')}
                  className={`p-5 border transition-all cursor-pointer ${
                    timeStage === 'base' ? 'bg-[#1A1A1A] text-[#F8F7F4] border-[#1A1A1A]' : 'bg-[#F8F7F4] text-[#1A1A1A] border-[#1A1A1A]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#C5A059]">
                      3. Base Notes (Dry Down)
                    </span>
                    <span>⏱ {metrics.baseDuration}</span>
                  </div>
                  <p className="font-sans text-xs opacity-80 mb-3 font-light">
                    Heavy, rich accords binding to skin for enduring presence.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.base.map((note, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#C5A059]/20 text-[#C5A059] font-mono text-[0.65rem]">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

