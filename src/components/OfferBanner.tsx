/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getStoredSiteContent } from '../utils/siteContent';

interface OfferBannerProps {
  onShopNowClick: () => void;
}

export default function OfferBanner({ onShopNowClick }: OfferBannerProps) {
  const [announcement, setAnnouncement] = useState(() => getStoredSiteContent().announcement);

  useEffect(() => {
    const handleUpdate = () => setAnnouncement(getStoredSiteContent().announcement);
    window.addEventListener('rana_site_content_updated', handleUpdate);
    return () => window.removeEventListener('rana_site_content_updated', handleUpdate);
  }, []);

  if (!announcement.enabled) return null;

  const marqueeText = `${announcement.text} • ${announcement.badge} • `;

  return (
    <div className="w-full bg-[#0B0B0B] border-b border-[#D4AF37]/30 text-[#F8F7F4] py-2.5 px-4 relative overflow-hidden z-30 select-none">
      {/* Subtle gold ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
        
        {/* Animated Marquee Text Track */}
        <div className="flex-1 overflow-hidden flex items-center gap-2">
          <span className="p-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full text-[#D4AF37] shrink-0 hidden sm:flex animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </span>
          
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-[marquee_25s_linear_infinite] font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              <span className="mx-4">{marqueeText}</span>
              <span className="mx-4">{marqueeText}</span>
              <span className="mx-4">{marqueeText}</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onShopNowClick}
          className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#f3cb50] text-[#0B0B0B] font-bold font-mono text-[0.65rem] uppercase tracking-[0.15em] rounded-none transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <span>Claim Offer</span>
          <ArrowRight className="w-3 h-3" />
        </button>

      </div>
    </div>
  );
}

