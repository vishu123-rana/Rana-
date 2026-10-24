/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2 } from 'lucide-react';

interface ReviewItem {
  name: string;
  location: string;
  comment: string;
  perfume: string;
  rating: number;
}

export default function ReviewsSection() {
  const reviews: ReviewItem[] = [
    {
      name: 'Rohan Malhotra',
      location: 'New Delhi',
      comment: 'RANA Black has become my daily signature. The opening notes melt into a commanding cedar, dark amber, and sandalwood aura that outclasses global niche houses.',
      perfume: 'RANA Black (Extrait)',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      comment: 'RANA Oud Nocturne is an absolute tour de force. The rare Cambodian oud is deep, dark, and smooth, lasting on my scarf for over 48 hours.',
      perfume: 'RANA Oud Nocturne',
      rating: 5,
    },
    {
      name: 'Kabir Dev',
      location: 'Chandigarh',
      comment: 'Noir Intense is purely breathtaking. Rich tobacco, bourbon vanilla, and Russian leather. A genuine 35% extrait work of art.',
      perfume: 'RANA Noir Intense',
      rating: 5,
    },
    {
      name: 'Aanya Iyer',
      location: 'Bengaluru',
      comment: 'Signature Élixir smells of immense luxury. The orris and black amber accord is hypnotic, commanding respect in every boardroom and evening dinner.',
      perfume: 'RANA Signature Élixir',
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-[#070707] border-b border-[#181818] relative overflow-hidden text-[#F5F5F5] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-white/60" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#888888] font-medium">
              PATRON TESTIMONIALS
            </span>
            <span className="w-6 h-[1px] bg-white/60" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[0.03em] text-white mb-3">
            Words From Our Connoisseurs
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] max-w-md mx-auto font-light leading-relaxed">
            Verified impressions from patrons who experience the enduring circadian sillage of RANA formulations.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#0C0C0C] border border-[#1E1E1E] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-white text-white" />
                  ))}
                </div>

                <p className="font-serif italic text-xs sm:text-sm text-[#CCCCCC] leading-relaxed mb-6 font-light">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#1C1C1C]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif text-sm font-normal text-white block">
                      {rev.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#737373]">
                      {rev.location} · Verified Buyer
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#888888] uppercase bg-[#141414] px-2 py-0.5 border border-[#242424]">
                    {rev.perfume.split(' ')[1] || 'Extrait'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
