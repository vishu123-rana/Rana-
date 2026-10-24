/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface FinalCTAProps {
  onExploreClick: () => void;
  onDiscoverClick: () => void;
}

export default function FinalCTA({ onExploreClick, onDiscoverClick }: FinalCTAProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-[#050505] text-[#F5F5F5] relative overflow-hidden border-b border-[#181818] select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none rounded-full blur-3xl" />

      {/* Large watermark typography */}
      <div className="absolute right-4 bottom-2 font-serif text-[140px] sm:text-[220px] font-black text-white/[0.015] pointer-events-none select-none tracking-tight">
        RANA
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 text-center">
        {/* Pre-title */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-6 h-[1px] bg-white/60" />
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#888888] font-medium">
            THE MAISON INVITATION
          </span>
          <span className="w-6 h-[1px] bg-white/60" />
        </div>

        {/* Editorial Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.03em] text-white mb-6 leading-tight max-w-3xl mx-auto">
          Begin Your Journey into Haute Parfumerie
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed max-w-xl mx-auto mb-10">
          Experience our private archive. Every grand flacon is accompanied by complimentary discovery atomizers,
          insulated black lacquer packaging, and insured express dispatch.
        </p>

        {/* Main CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>EXPLORE THE COLLECTION</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={onDiscoverClick}
            className="w-full sm:w-auto px-8 py-4 bg-[#0E0E0E] hover:bg-[#161616] text-white border border-[#262626] hover:border-white font-mono text-xs uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>DISCOVER YOUR SCENT</span>
          </button>
        </div>

        {/* Private Client Circle Invitation */}
        <div className="max-w-md mx-auto p-6 bg-[#0B0B0B] border border-[#1E1E1E]">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#888888] block mb-2 font-medium">
            Private Client Circle
          </span>
          <p className="font-serif text-sm font-light text-white mb-4">
            Receive exclusive seasonal micro-batch allocations and concierge invitations.
          </p>

          {subscribed ? (
            <p className="text-xs font-mono text-white">
              Thank you for subscribing to the Maison RANA Gazette.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#141414] border border-[#242424] text-xs font-mono text-white placeholder-[#555555] focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#E5E5E5]"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
