/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Bottle3D from './Bottle3D';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const floatingNotes = [
    'Calabrian Bergamot',
    'Aged Assamese Oud',
    'Turkish Damask Rose',
    'Mysore Sandalwood',
    'Smoked Amber',
    'Russian Leather',
  ];

  // Dark atmospheric silver & platinum particles inside the intro canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      phase: number;
    }> = [];

    const colors = ['#FFFFFF', '#D4D4D4', '#A3A3A3', '#737373', '#E5E5E5'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 200,
        size: Math.random() * 2 + 0.5,
        vx: Math.random() * 0.4 - 0.2,
        vy: -(Math.random() * 1.2 + 0.4),
        alpha: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }

    const drawParticles = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.phase) * 0.3;
        p.y += p.vy;

        p.alpha = Math.max(0.1, Math.min(0.8, p.alpha + (Math.random() * 0.03 - 0.015)));

        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.y < -50) {
          p.y = canvas.height + Math.random() * 100;
          p.x = Math.random() * canvas.width;
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Sequence phases
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep(1);
    }, 800);

    const t2 = setTimeout(() => {
      setStep(2);
    }, 2200);

    const t3 = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      id="intro-animation-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
    >
      {/* Particle background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Skip button in the top corner */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={onComplete}
          className="px-5 py-2 text-xs uppercase tracking-[0.3em] font-mono text-[#CCCCCC] hover:text-white border border-[#333333] hover:border-white bg-[#0E0E0E]/80 backdrop-blur-md transition-all duration-300 cursor-pointer"
        >
          Skip Intro
        </button>
      </div>

      {/* Centerpiece Renders */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center px-4">
        <AnimatePresence mode="wait">
          {step >= 1 && (
            <motion.div
              key="bottle-reveal"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex flex-col items-center relative"
            >
              {/* Floating notes */}
              <div className="absolute -top-12 inset-x-0 flex items-center justify-center gap-2 flex-wrap max-w-sm mx-auto">
                {floatingNotes.slice(0, 3).map((note, idx) => (
                  <motion.span
                    key={note}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.15 }}
                    className="px-3 py-1 bg-[#111111]/80 border border-[#262626] text-[9px] font-mono text-[#D4D4D4] uppercase tracking-widest backdrop-blur-xs"
                  >
                    {note}
                  </motion.span>
                ))}
              </div>

              <div className="relative">
                <div className="absolute -inset-10 bg-radial from-white/10 to-transparent blur-3xl opacity-40" />
                <Bottle3D gender="men" accentColor="#D4D4D4" name="RANA" isInteractive={false} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 2 && (
            <div className="text-center mt-2">
              <motion.h1
                initial={{ opacity: 0, filter: 'blur(15px)', letterSpacing: '0.3em' }}
                animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.45em' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="font-serif text-3xl md:text-5xl font-light text-white uppercase leading-none drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)]"
              >
                RANA
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.6, scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-[1px] w-24 bg-white/40 mx-auto my-3"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-serif italic text-[#A3A3A3] text-sm md:text-base tracking-[0.2em] font-light"
              >
                &ldquo;SCENTS THAT DEFINE YOU&rdquo;
              </motion.p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono tracking-[0.35em] text-[#666666] uppercase">
        <span>RANA Luxury Perfumes · Maison de Haute Parfumerie</span>
      </div>
    </div>
  );
}
