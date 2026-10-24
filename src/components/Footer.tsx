/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Check, Sparkles, Instagram, Facebook, Twitter, Lock } from 'lucide-react';

interface FooterProps {
  onNavClick: (section: string) => void;
  onPolicyClick: (policyName: string) => void;
  onOpenAIAssistant?: () => void;
  onAdminLoginClick?: () => void;
}

export default function Footer({ onNavClick, onPolicyClick, onOpenAIAssistant, onAdminLoginClick }: FooterProps) {
  const currentYear = 2026;
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      id="site-footer"
      className="bg-[#050505] border-t border-[#181818] pt-16 pb-12 text-[#A3A3A3] font-sans select-none relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-14">
        {/* Newsletter Subscription Box */}
        <div className="p-6 md:p-10 bg-[#0B0B0B] border border-[#1E1E1E] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-2 max-w-xl">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-medium text-[#888888]">
                  RANA CONNOISSEUR CIRCLE
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-white">
                Subscribe to Our Luxury Gazette
              </h3>
              <p className="text-xs text-[#8E8E93] font-light leading-relaxed">
                Receive private cellar allocations, seasonal distillation invitations, and an introductory privilege code.
              </p>
            </div>

            <div className="w-full lg:w-auto min-w-[280px] sm:min-w-[380px]">
              {isSubscribed ? (
                <div className="p-4 bg-[#141414] border border-[#2E2E2E] flex items-center gap-3">
                  <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif text-xs font-semibold text-white">Welcome to the Inner Circle</p>
                    <p className="text-[10px] text-[#A3A3A3]">
                      Your 20% privilege code "BLACK20" has been activated.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-3 bg-[#121212] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white hover:bg-[#E5E5E5] text-black font-semibold font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#1A1A1A]">
        {/* Brand Information (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              onNavClick('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="w-8 h-8 border border-white flex items-center justify-center font-serif text-base font-bold text-white">
              R
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-[0.25em] text-white leading-none">
                RANA
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-[#737373] mt-0.5">
                LUXURY PERFUMES
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8E8E93] font-light leading-relaxed max-w-sm">
            Maison de Haute Parfumerie. Formulated with 35% pure extrait concentration, rare aged oud resins, and noble Grasse absolutes.
          </p>

          <div className="pt-2 text-xs font-mono space-y-2 text-[#737373]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Atelier RANA, Heritage Boulevard, New Delhi</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>Concierge: +91 (11) 4892-0199</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>concierge@ranaperfumes.com</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="pt-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#555555] block mb-2 font-medium">
              Social Media
            </span>
            <div className="flex items-center gap-3 text-white">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#111111] border border-[#222222] flex items-center justify-center text-[#888888] hover:text-white hover:border-white transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#111111] border border-[#222222] flex items-center justify-center text-[#888888] hover:text-white hover:border-white transition-colors"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#111111] border border-[#222222] flex items-center justify-center text-[#888888] hover:text-white hover:border-white transition-colors"
                title="X / Twitter"
                aria-label="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Collections (3 Cols) */}
        <div className="lg:col-span-3 space-y-3 font-mono text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white block mb-4 font-semibold">
            Collections
          </span>
          <ul className="space-y-2.5 text-[#8E8E93]">
            <li>
              <button
                onClick={() => onNavClick('mens-collection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                RANA Men Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('womens-collection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                RANA Women Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('unisex-collection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                RANA Unisex Series
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('oud-collection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Royal Oud Reserve
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('premium-collection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Grand Extraits Élixirs
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('limited-collection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Limited Edition Coffrets
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Maison & Heritage (2 Cols) */}
        <div className="lg:col-span-2 space-y-3 font-mono text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white block mb-4 font-semibold">
            Maison
          </span>
          <ul className="space-y-2.5 text-[#8E8E93]">
            <li>
              <button
                onClick={() => onNavClick('about')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Our Philosophy
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('ingredients')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Fragrance Notes
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('catalog')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Full Archive
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavClick('orders')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Order Tracking
              </button>
            </li>
            {onOpenAIAssistant && (
              <li>
                <button
                  onClick={onOpenAIAssistant}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-white"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Scent Sommelier
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Column 4: Client Services & Policies (3 Cols) */}
        <div className="lg:col-span-3 space-y-3 font-mono text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white block mb-4 font-semibold">
            Concierge & Legal
          </span>
          <ul className="space-y-2.5 text-[#8E8E93]">
            <li>
              <button
                onClick={() => onPolicyClick('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy & Data Protection
              </button>
            </li>
            <li>
              <button
                onClick={() => onPolicyClick('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                onClick={() => onPolicyClick('shipping')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Insured Courier Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => onPolicyClick('refund')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Returns & Maceration Guarantee
              </button>
            </li>
            <li>
              <button
                onClick={() => onPolicyClick('contact')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Bespoke Atelier Advisory
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Security Footnote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#666666]">
        <p>© {currentYear} RANA LUXURY PERFUMES. All Rights Reserved.</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
          <span>Grasse Distillation</span>
          <span>·</span>
          <span>35% Pure Extrait</span>
          <span>·</span>
          <span>Pan-India Secured Delivery</span>
          {onAdminLoginClick && (
            <>
              <span>·</span>
              <button
                onClick={onAdminLoginClick}
                className="inline-flex items-center gap-1 text-[#777777] hover:text-[#C5A059] transition-colors cursor-pointer uppercase tracking-wider py-1 px-1.5 hover:bg-[#111111]"
                title="Atelier Administration Portal"
              >
                <Lock className="w-2.5 h-2.5 text-[#C5A059]" />
                <span className="font-semibold">Admin Login</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
