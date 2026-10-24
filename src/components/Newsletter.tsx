/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="py-24 bg-black border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(219,179,98,0.02)_0%,_transparent_65%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="p-8 md:p-12 rounded-3xl border border-gold-300/15 bg-neutral-900/40 relative overflow-hidden text-center light-sweep-container shadow-2xl">
          
          {/* Saffron and gold lighting spots */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-gold-700/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto space-y-6">
            <div className="p-3 bg-black/40 border border-gold-400/20 rounded-full w-fit mx-auto shadow-inner">
              <Mail className="w-5 h-5 text-gold-300" />
            </div>

            <h2 className="font-serif text-2xl md:text-4xl font-bold text-white tracking-wide">
              Join the RANA Luxury Club
            </h2>

            <p className="font-sans text-xs md:text-sm text-gold-100/50 leading-relaxed font-light">
              Enter your credentials to receive exclusive previews of limited seasonal launches, high-society fragrance recommendations, and private invitations.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="subscribe-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row items-stretch gap-2"
                >
                  <input
                    required
                    type="email"
                    placeholder="Enter your luxury email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-5 py-3.5 bg-black/60 border border-white/10 rounded-full text-xs font-sans text-white focus:outline-none focus:border-gold-400 placeholder-white/20"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black font-sans text-xs uppercase tracking-[0.2em] font-bold cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md shrink-0"
                  >
                    Request Invitation
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="subscribe-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl border border-gold-400/20 bg-gold-400/5 text-center space-y-2"
                >
                  <div className="flex items-center justify-center gap-2 text-gold-300 font-sans text-xs font-bold uppercase tracking-wider">
                    <Check className="w-4 h-4 text-gold-300" />
                    <span>Invitation Dispatched!</span>
                  </div>
                  <p className="font-sans text-[11px] text-gold-100/60 leading-relaxed font-light">
                    Welcome to the RANA Circle. We have dispatched your secure welcome details. Use exclusive code <span className="font-mono text-gold-300 font-bold bg-black/50 px-2 py-0.5 rounded border border-gold-400/20">LUXURY</span> in your shopping cart for an instant 10% off & complimentary shipping on your first purchase.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
