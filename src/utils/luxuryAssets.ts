/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to generate elegant realistic SVG flacon representations with luxury blue studio lighting & sculpted reflections
export function createLuxuryFlaconSvg({
  liquidColor = '#2563EB',
  liquidGradientEnd = '#0D263D',
  capColor = '#CBD5E1',
  glassColor = 'rgba(255,255,255,0.22)',
  bottleShape = 'square',
  labelTitle,
  labelSubtitle,
  accentGlow = 'rgba(120,157,184,0.3)',
  blueTint = '#DCECF4',
}: {
  liquidColor?: string;
  liquidGradientEnd?: string;
  capColor?: string;
  glassColor?: string;
  bottleShape?: 'square' | 'cylinder' | 'faceted' | 'coffret';
  labelTitle: string;
  labelSubtitle: string;
  accentGlow?: string;
  blueTint?: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stop-color="${accentGlow}" />
        <stop offset="60%" stop-color="${blueTint}" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#EAF4F8" />
      </radialGradient>
      <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${liquidColor}" />
        <stop offset="100%" stop-color="${liquidGradientEnd}" />
      </linearGradient>
      <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95" />
        <stop offset="35%" stop-color="#94A3B8" />
        <stop offset="50%" stop-color="#F8FAFC" />
        <stop offset="75%" stop-color="#64748B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
      <linearGradient id="glassEdge" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.85)" />
        <stop offset="15%" stop-color="rgba(255,255,255,0.25)" />
        <stop offset="85%" stop-color="rgba(255,255,255,0.25)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.8)" />
      </linearGradient>
      <linearGradient id="sculptWave" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#BFD9E8" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#EAF4F8" stop-opacity="0.1" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#0D263D" flood-opacity="0.18" />
      </filter>
    </defs>

    <!-- Powder Blue & Soft Azure Studio Backdrop -->
    <rect width="100%" height="100%" fill="#EAF4F8" />
    <circle cx="200" cy="270" r="185" fill="url(#bgGlow)" />

    <!-- Sculptural Flowing Curved Waves in Powder Blue -->
    <g fill="url(#sculptWave)">
      <path d="M 0 140 C 60 90, 140 100, 160 170 C 140 230, 40 220, 0 160 Z" />
      <path d="M 400 260 C 340 210, 260 230, 270 310 C 300 370, 390 340, 400 260 Z" />
      <path d="M 370 70 C 390 20, 320 10, 270 50 C 230 100, 320 120, 370 70 Z" />
    </g>

    <!-- Polished Glass Pedestal Base -->
    <ellipse cx="200" cy="455" rx="145" ry="20" fill="rgba(220,236,244,0.8)" />
    <ellipse cx="200" cy="452" rx="142" ry="17" fill="#FFFFFF" stroke="rgba(120,157,184,0.4)" stroke-width="1.2" />

    <!-- Bottle Construction -->
    <g filter="url(#softShadow)">
      ${
        bottleShape === 'cylinder'
          ? `<!-- Cylindrical Flacon -->
             <rect x="130" y="160" width="140" height="260" rx="24" fill="url(#liquidGrad)" />
             <rect x="130" y="160" width="140" height="260" rx="24" fill="url(#glassEdge)" />
             <rect x="140" y="170" width="120" height="240" rx="18" fill="${glassColor}" />`
          : bottleShape === 'faceted'
          ? `<!-- Faceted Gem Flacon -->
             <polygon points="120,200 200,150 280,200 270,410 130,410" fill="url(#liquidGrad)" />
             <polygon points="120,200 200,150 280,200 270,410 130,410" fill="url(#glassEdge)" stroke="rgba(120,157,184,0.5)" stroke-width="2" />`
          : bottleShape === 'coffret'
          ? `<!-- Discovery Coffret Box Trio -->
             <rect x="70" y="200" width="260" height="190" rx="12" fill="#F0F7FA" stroke="#789DB8" stroke-width="1.5" />
             <!-- 3 Mini Flacons -->
             <rect x="100" y="230" width="45" height="130" rx="8" fill="url(#liquidGrad)" stroke="#173B5C" stroke-width="0.8" />
             <rect x="112" y="205" width="22" height="25" rx="4" fill="url(#capGrad)" />
             <rect x="175" y="230" width="45" height="130" rx="8" fill="#173B5C" stroke="#789DB8" stroke-width="0.8" />
             <rect x="187" y="205" width="22" height="25" rx="4" fill="url(#capGrad)" />
             <rect x="250" y="230" width="45" height="130" rx="8" fill="#0D263D" stroke="#CBD5E1" stroke-width="0.8" />
             <rect x="262" y="205" width="22" height="25" rx="4" fill="url(#capGrad)" />`
          : `<!-- Square Monumental Flacon -->
             <rect x="120" y="175" width="160" height="240" rx="14" fill="url(#liquidGrad)" />
             <rect x="120" y="175" width="160" height="240" rx="14" fill="url(#glassEdge)" />
             <rect x="130" y="185" width="140" height="220" rx="10" fill="${glassColor}" />`
      }

      ${
        bottleShape !== 'coffret'
          ? `<!-- Chrome & Deep Navy Stopper -->
             <rect x="175" y="140" width="50" height="25" rx="4" fill="url(#capGrad)" />
             <rect x="160" y="90" width="80" height="52" rx="8" fill="url(#capGrad)" stroke="rgba(255,255,255,0.6)" stroke-width="1" />
             <rect x="180" y="98" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.85)" />

             <!-- Luxury White & Navy Label Plaque -->
             <rect x="145" y="250" width="110" height="85" rx="6" fill="#FFFFFF" stroke="#0D263D" stroke-width="1.2" />
             
             <!-- RANA Crest & Typography -->
             <text x="200" y="278" font-family="'Playfair Display', Georgia, serif" font-size="14" font-weight="700" fill="#0D263D" text-anchor="middle" letter-spacing="3">RANA</text>
             <line x1="160" y1="288" x2="240" y2="288" stroke="#789DB8" stroke-width="0.8" />
             <text x="200" y="303" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="600" fill="#173B5C" text-anchor="middle" letter-spacing="1.5">${labelTitle.toUpperCase()}</text>
             <text x="200" y="318" font-family="'Space Mono', monospace" font-size="6.5" fill="#475569" text-anchor="middle" letter-spacing="1">${labelSubtitle.toUpperCase()}</text>`
          : `<!-- Coffret Label Plaque -->
             <rect x="135" y="350" width="130" height="30" rx="4" fill="#FFFFFF" stroke="#173B5C" stroke-width="1" />
             <text x="200" y="367" font-family="'Playfair Display', Georgia, serif" font-size="9" font-weight="700" fill="#0D263D" text-anchor="middle" letter-spacing="2">RANA DISCOVERY COFFRET</text>`
      }
    </g>

    <!-- Glass Refraction Highlights -->
    <path d="M 135 190 L 135 400" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 142 195 L 142 350" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round" />
    
    <!-- Water Reflection Accents -->
    <circle cx="95" cy="452" r="3" fill="rgba(120,157,184,0.4)" />
    <circle cx="305" cy="456" r="2.5" fill="rgba(120,157,184,0.35)" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
