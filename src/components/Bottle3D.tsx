/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface Bottle3DProps {
  key?: string | number;
  gender?: 'men' | 'women';
  accentColor?: string; // e.g. '#dbb362'
  liquidHeightPercent?: number; // default 65
  name?: string;
  isInteractive?: boolean;
  theme?: 'hero' | 'celestial' | 'saffron' | 'prismatic' | 'noir' | 'royal-oud' | 'ocean-breeze' | 'intense' | 'bloom' | 'velvet-rose' | 'crystal' | 'gold-essence';
  isCapOff?: boolean;
  size?: 'standard' | 'hero' | 'large';
}

export default function Bottle3D({
  gender = 'women',
  accentColor = '#dbb362',
  liquidHeightPercent = 65,
  name = 'RANA',
  isInteractive = true,
  theme = 'hero',
  isCapOff = false,
  size = 'standard',
}: Bottle3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse move handler for tilting/parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalized coordinates from -1 to 1
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMouse((prev) => ({ ...prev, targetX: x, targetY: y }));
    };

    const handleMouseLeave = () => {
      setMouse((prev) => ({ ...prev, targetX: 0, targetY: 0 }));
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, [isInteractive]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;
    let particleTime = 0;
    let sweepX = -200;

    // Define floating particles inside the liquid
    const particles: Array<{ x: number; y: number; size: number; speed: number; angle: number; oscSpeed: number }> = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * 80 - 40, // offset from center
        y: Math.random() * 120 - 60, // offset from center
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.2,
        angle: Math.random() * Math.PI * 2,
        oscSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Set high-DPI scaling
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic smoothing variables
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinates
      currentX += (mouse.targetX - currentX) * 0.1;
      currentY += (mouse.targetY - currentY) * 0.1;

      // Update constants for animations
      rotationAngle += 0.005;
      particleTime += 0.01;
      sweepX += 2.5;
      if (sweepX > width + 200) {
        sweepX = -300; // Reset light sweep
      }

      // 3D bottle calculations
      const isHeroSize = size === 'hero' || size === 'large';
      const cx = width / 2;
      const cy = height / 2 + (isHeroSize ? 15 : 10);
      const bottleW = isHeroSize ? 145 : 110;
      const bottleH = isHeroSize ? 210 : 160;
      const cornerRadius = isHeroSize ? 18 : 15;

      // Theme specific background glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
      let glowColor = 'rgba(120, 157, 184, 0.35)';
      if (theme === 'celestial') glowColor = 'rgba(56, 189, 248, 0.35)';
      else if (theme === 'saffron') glowColor = 'rgba(234, 88, 12, 0.4)';
      else if (theme === 'prismatic') glowColor = 'rgba(244, 114, 182, 0.35)';
      else if (theme === 'noir') glowColor = 'rgba(13, 38, 61, 0.6)';
      else if (theme === 'royal-oud') glowColor = 'rgba(23, 59, 92, 0.45)';
      else if (theme === 'ocean-breeze') glowColor = 'rgba(120, 157, 184, 0.45)';
      else if (theme === 'intense') glowColor = 'rgba(13, 38, 61, 0.55)';
      else if (gender === 'men') glowColor = 'rgba(23, 59, 92, 0.35)';

      glowGrad.addColorStop(0, glowColor);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      // Apply Interactive 3D transformations
      ctx.save();
      ctx.translate(cx, cy);
      // Perspective tilt & rotation
      ctx.transform(
        1,
        currentY * 0.06,
        currentX * 0.06,
        1,
        currentX * 12,
        currentY * 12
      );
      // Continuous micro-float
      const floatOffset = Math.sin(particleTime * 2) * 3;
      ctx.translate(0, floatOffset);

      // Draw shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 15;

      // 1. Draw Gold Cap / Atomizer (With Unboxing / Cap Reveal Offset)
      ctx.shadowBlur = 0; // Disable shadows on cap details
      ctx.shadowOffsetY = 0;
      
      // Cap Neck (Base Nozzle)
      ctx.fillStyle = '#dbb362';
      const capNeckW = 32;
      const capNeckH = 12;
      ctx.fillRect(-capNeckW / 2, -bottleH / 2 - capNeckH, capNeckW, capNeckH);

      // Spray Nozzle hole
      ctx.fillStyle = '#111';
      ctx.fillRect(-3, -bottleH / 2 - capNeckH - 2, 6, 2);

      // Cap Lift-Off Offset (Unboxing animation)
      const capOffsetY = isCapOff ? -35 : 0;

      // Main cap body (luxury faceted style)
      const capGrad = ctx.createLinearGradient(-25, 0, 25, 0);
      if (theme === 'celestial' || theme === 'crystal') {
        capGrad.addColorStop(0, '#0f172a');
        capGrad.addColorStop(0.5, '#e2e8f0');
        capGrad.addColorStop(1, '#1e293b');
      } else if (theme === 'saffron' || theme === 'velvet-rose') {
        capGrad.addColorStop(0, '#7c2d12');
        capGrad.addColorStop(0.5, '#be123c');
        capGrad.addColorStop(1, '#451a03');
      } else if (theme === 'noir') {
        capGrad.addColorStop(0, '#020617');
        capGrad.addColorStop(0.5, '#d97706');
        capGrad.addColorStop(1, '#0f172a');
      } else if (theme === 'royal-oud') {
        capGrad.addColorStop(0, '#451a03');
        capGrad.addColorStop(0.5, '#f59e0b');
        capGrad.addColorStop(1, '#78350f');
      } else if (theme === 'ocean-breeze') {
        capGrad.addColorStop(0, '#0c4a6e');
        capGrad.addColorStop(0.5, '#0284c7');
        capGrad.addColorStop(1, '#082f49');
      } else if (theme === 'intense') {
        capGrad.addColorStop(0, '#450a0a');
        capGrad.addColorStop(0.5, '#d97706');
        capGrad.addColorStop(1, '#1c1917');
      } else if (theme === 'bloom' || theme === 'prismatic') {
        capGrad.addColorStop(0, '#881337');
        capGrad.addColorStop(0.5, '#fb7185');
        capGrad.addColorStop(1, '#4c0519');
      } else {
        // Gold Essence / Hero / Default
        capGrad.addColorStop(0, '#763e1a');
        capGrad.addColorStop(0.3, '#dbb362');
        capGrad.addColorStop(0.5, '#f4e8cb');
        capGrad.addColorStop(0.7, '#dbb362');
        capGrad.addColorStop(1, '#623318');
      }
      ctx.fillStyle = capGrad;
      
      const capW = 44;
      const capH = 34;
      ctx.beginPath();
      ctx.roundRect(-capW / 2, -bottleH / 2 - capNeckH - capH + capOffsetY, capW, capH, 5);
      ctx.fill();

      // Horizontal premium rib on cap
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(-capW / 2, -bottleH / 2 - capNeckH - capH + 14 + capOffsetY, capW, 4);

      // 1B. If Cap is Off, draw rising Aroma Mist Vapor Stream
      if (isCapOff) {
        ctx.save();
        for (let m = 0; m < 16; m++) {
          const mTime = particleTime * 4 + m * 0.4;
          const mx = Math.sin(mTime) * (10 + m * 2);
          const my = -bottleH / 2 - capNeckH - (mTime * 18) % 70;
          const mSize = 4 + (m % 5) * 2;
          const mAlpha = Math.max(0, 0.7 - (Math.abs(my) - 80) / 70);

          ctx.fillStyle = theme === 'celestial'
            ? `rgba(186, 230, 253, ${mAlpha})`
            : theme === 'saffron'
            ? `rgba(253, 186, 116, ${mAlpha})`
            : theme === 'prismatic'
            ? `rgba(251, 207, 232, ${mAlpha})`
            : `rgba(253, 230, 138, ${mAlpha})`;

          ctx.beginPath();
          ctx.arc(mx, my, mSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Draw Glass Bottle Body
      const pathBottle = () => {
        ctx.beginPath();
        ctx.roundRect(-bottleW / 2, -bottleH / 2, bottleW, bottleH, cornerRadius);
      };

      // Set bottle glass background
      const glassBgGrad = ctx.createLinearGradient(-bottleW/2, 0, bottleW/2, 0);
      if (theme === 'noir') {
        glassBgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        glassBgGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.85)');
        glassBgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      } else {
        glassBgGrad.addColorStop(0, 'rgba(30, 30, 30, 0.3)');
        glassBgGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        glassBgGrad.addColorStop(1, 'rgba(10, 10, 10, 0.3)');
      }
      ctx.fillStyle = glassBgGrad;
      pathBottle();
      ctx.fill();

      // 3. Draw Liquid inside (height controlled)
      ctx.save();
      // Clip drawing inside the bottle outline
      pathBottle();
      ctx.clip();

      const liquidH = bottleH * (liquidHeightPercent / 100);
      const liquidY = bottleH / 2 - liquidH;

      const liquidGrad = ctx.createLinearGradient(0, liquidY, 0, bottleH / 2);
      if (theme === 'noir') {
        liquidGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        liquidGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.9)');
        liquidGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
      } else if (theme === 'royal-oud') {
        liquidGrad.addColorStop(0, 'rgba(217, 119, 6, 0.95)');
        liquidGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.9)');
        liquidGrad.addColorStop(1, 'rgba(120, 53, 15, 0.98)');
      } else if (theme === 'ocean-breeze') {
        liquidGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
        liquidGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.85)');
        liquidGrad.addColorStop(1, 'rgba(3, 105, 161, 0.95)');
      } else if (theme === 'intense') {
        liquidGrad.addColorStop(0, 'rgba(136, 19, 55, 0.95)');
        liquidGrad.addColorStop(0.5, 'rgba(153, 27, 27, 0.9)');
        liquidGrad.addColorStop(1, 'rgba(69, 10, 10, 0.98)');
      } else if (theme === 'bloom' || theme === 'prismatic') {
        liquidGrad.addColorStop(0, 'rgba(251, 113, 133, 0.9)');
        liquidGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.85)');
        liquidGrad.addColorStop(1, 'rgba(159, 18, 57, 0.95)');
      } else if (theme === 'velvet-rose') {
        liquidGrad.addColorStop(0, 'rgba(190, 18, 60, 0.95)');
        liquidGrad.addColorStop(0.5, 'rgba(159, 18, 57, 0.9)');
        liquidGrad.addColorStop(1, 'rgba(76, 5, 25, 0.98)');
      } else if (theme === 'crystal' || theme === 'celestial') {
        liquidGrad.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
        liquidGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.75)');
        liquidGrad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');
      } else if (theme === 'gold-essence' || theme === 'saffron') {
        liquidGrad.addColorStop(0, 'rgba(253, 224, 71, 0.95)');
        liquidGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.9)');
        liquidGrad.addColorStop(1, 'rgba(161, 98, 7, 0.98)');
      } else if (gender === 'men') {
        // Deep blue, smokey or crimson tones
        liquidGrad.addColorStop(0, 'rgba(28, 40, 65, 0.85)');
        liquidGrad.addColorStop(0.5, 'rgba(44, 62, 99, 0.75)');
        liquidGrad.addColorStop(1, 'rgba(14, 20, 36, 0.95)');
      } else {
        // Glorious Golden elixir
        liquidGrad.addColorStop(0, 'rgba(244, 232, 203, 0.9)');
        liquidGrad.addColorStop(0.5, 'rgba(219, 179, 98, 0.8)');
        liquidGrad.addColorStop(1, 'rgba(118, 62, 26, 0.95)');
      }

      // Wave physics for liquid surface
      ctx.beginPath();
      ctx.moveTo(-bottleW / 2 - 10, bottleH / 2);
      ctx.lineTo(-bottleW / 2 - 10, liquidY);
      
      const waveAmplitude = isHovered ? 4 : 2;
      const waveFreq = 0.05;
      for (let xCoord = -bottleW / 2; xCoord <= bottleW / 2; xCoord += 5) {
        const yCoord = liquidY + Math.sin(xCoord * waveFreq + particleTime * 3) * waveAmplitude;
        ctx.lineTo(xCoord, yCoord);
      }
      ctx.lineTo(bottleW / 2 + 10, bottleH / 2);
      ctx.closePath();
      ctx.fillStyle = liquidGrad;
      ctx.fill();

      // 4. Draw floating sparkles inside the liquid
      particles.forEach((p) => {
        // Swirl particles slightly
        p.angle += p.oscSpeed;
        const driftX = p.x + Math.sin(p.angle) * 5;
        // Float upwards
        p.y -= p.speed;
        if (p.y < liquidY + 5) {
          p.y = bottleH / 2 - Math.random() * 20; // Recycle to bottom
          p.x = Math.random() * (bottleW - 20) - (bottleW / 2 - 10);
        }

        // Draw particle
        ctx.fillStyle = `rgba(244, 232, 203, ${Math.random() * 0.4 + 0.4})`;
        ctx.beginPath();
        ctx.arc(driftX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Straw (atomizer tube inside)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -bottleH / 2);
      ctx.lineTo(0, bottleH / 2 - 10);
      ctx.stroke();

      ctx.restore(); // end liquid clipping

      // 5. Draw Luxury Label on Front of Bottle
      const labelW = 76;
      const labelH = 50;
      const labelY = -15;

      // Label gold border
      ctx.fillStyle = '#0a0a0a';
      ctx.strokeStyle = '#dbb362';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-labelW / 2, labelY - labelH / 2, labelW, labelH, 2);
      ctx.fill();
      ctx.stroke();

      // Inner thin gold outline
      ctx.strokeStyle = 'rgba(219, 179, 98, 0.4)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.roundRect(-labelW / 2 + 3, labelY - labelH / 2 + 3, labelW - 6, labelH - 6, 1);
      ctx.stroke();

      // Label texts
      ctx.fillStyle = '#dbb362';
      ctx.font = 'bold 12px "Cinzel", "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name.toUpperCase(), 0, labelY - 7);

      ctx.fillStyle = '#f4e8cb';
      ctx.font = '5px "JetBrains Mono", monospace';
      ctx.fillText('PARFUM EXQUIS', 0, labelY + 6);

      ctx.fillStyle = '#924f1c';
      ctx.font = 'italic 5px serif';
      ctx.fillText('RANA Perfumes', 0, labelY + 14);

      // 6. Bottle Glass Thick Edges (creates crystal reflection effect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      pathBottle();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.5;
      pathBottle();
      ctx.stroke();

      // Highlight curves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-bottleW / 2 + 6, -bottleH / 2 + 15);
      ctx.quadraticCurveTo(-bottleW / 2 + 6, bottleH / 2 - 6, 0, bottleH / 2 - 6);
      ctx.stroke();

      // 7. Light Sweep / Glass Reflection
      ctx.save();
      pathBottle();
      ctx.clip();
      ctx.translate(-cx, -cy); // Draw in normal canvas coords for linear sweep

      const sweepGrad = ctx.createLinearGradient(sweepX, 0, sweepX + 100, 0);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sweepGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.12)');
      sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
      sweepGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.12)');
      sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(sweepX - 80, 0);
      ctx.lineTo(sweepX + 40, 0);
      ctx.lineTo(sweepX + 160, height);
      ctx.lineTo(sweepX + 40, height);
      ctx.closePath();
      ctx.fill();

      ctx.restore(); // end sweep clipping

      ctx.restore(); // restore mouse tilt transformation

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gender, accentColor, liquidHeightPercent, name, mouse, isHovered]);

  const isHero = size === 'hero' || size === 'large';

  return (
    <div
      ref={containerRef}
      id="3d-bottle-container"
      className={`relative w-full ${
        isHero ? 'h-[380px] sm:h-[460px] md:h-[520px]' : 'h-[320px] md:h-[380px]'
      } flex items-center justify-center cursor-pointer overflow-visible`}
      style={{ perspective: 1200 }}
    >
      <canvas
        ref={canvasRef}
        className={`${
          isHero
            ? 'w-[320px] h-[440px] sm:w-[380px] sm:h-[480px] md:w-[420px] md:h-[520px]'
            : 'w-[260px] h-[340px] md:w-[300px] md:h-[380px]'
        } drop-shadow-[0_35px_50px_rgba(0,0,0,0.95)]`}
      />
      
      {/* Decorative luxury sparkles surrounding the bottle container */}
      <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-gold-300 animate-pulse glow-gold-sm opacity-60"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-gold-200 animate-pulse glow-gold-sm opacity-40"></div>
      <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 rounded-full bg-gold-300 animate-pulse glow-gold-sm opacity-50"></div>
    </div>
  );
}
