import React, { useState } from 'react';
import { HOTSPOTS } from '../data/hotspots';
import ChefCharacter from './ChefCharacter';
import { playDrawerOpen, playBoop } from '../audio/soundEffects';
import { Sparkles, MapPin } from 'lucide-react';

export default function CafeScene({
  activeHotspot,
  onSelectHotspot,
  selectedDiet,
  recipes,
}) {
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  // Check if a hotspot contains recipes matching current diet filter
  const isHotspotMatchingDiet = (hotspot) => {
    if (selectedDiet === 'all') return true;
    if (hotspot.id === 'cookbook-wall') return true;
    const matching = recipes.filter(
      (r) => r.hotspotId === hotspot.id && (selectedDiet === 'all' || r.diet === selectedDiet)
    );
    return matching.length > 0;
  };

  const handleHotspotClick = (h) => {
    playDrawerOpen();
    onSelectHotspot(h);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-xl border border-[#211C32]/20 editorial-shadow-lg bg-[#F5EBDD] overflow-hidden select-none my-3">
      {/* Top Subtle Status Badge */}
      <div className="absolute top-3.5 left-4 z-30 bg-[#FFFDF8]/90 backdrop-blur-xs border border-[#211C32]/15 rounded-full px-3 py-1 text-[11px] font-sans font-medium text-[#211C32] shadow-xs flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#70C5D0]" />
        <span>Tap any highlighted station to explore Dishoom recipes</span>
      </div>

      {/* SVG Canvas Stage */}
      <div className="relative w-full aspect-16/10 min-h-[460px] sm:min-h-[580px] overflow-hidden">
        <svg 
          viewBox="0 0 1000 620" 
          className="w-full h-full object-cover" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Victorian Bombay Tile Pattern */}
            <pattern id="victorian-tile" width="36" height="36" patternUnits="userSpaceOnUse">
              <rect width="36" height="36" fill="#F5EBDD" />
              <rect width="18" height="18" fill="#E9DDC7" opacity="0.6" />
              <rect x="18" y="18" width="18" height="18" fill="#E9DDC7" opacity="0.6" />
              <path d="M0 0L36 36M36 0L0 36" stroke="#477E85" strokeWidth="0.5" opacity="0.18" />
              <circle cx="18" cy="18" r="3" fill="#E9B49F" opacity="0.4" />
            </pattern>

            {/* Vintage Irani Diagonal Floor Tiles */}
            <pattern id="floor-tiles" width="50" height="26" patternUnits="userSpaceOnUse">
              <rect width="50" height="26" fill="#E9DDC7" />
              <polygon points="0,0 25,0 50,26 25,26" fill="#70C5D0" opacity="0.18" />
              <path d="M0 0L50 26M0 26L50 0" stroke="#211C32" strokeWidth="0.6" opacity="0.15" />
            </pattern>

            {/* Soft Ambient Window Sunlight Beam */}
            <linearGradient id="soft-sunbeam" x1="0%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F5EBDD" stopOpacity="0.0" />
            </linearGradient>

            {/* Soft Ambient Drop Shadow Filter */}
            <filter id="ambient-shadow" x="-5%" y="-5%" width="115%" height="115%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#211C32" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* 1. BACKGROUND WALL & TILES */}
          <rect x="0" y="0" width="1000" height="460" fill="#F5EBDD" />
          <rect x="0" y="90" width="1000" height="250" fill="url(#victorian-tile)" />
          {/* Tile Border Moulding */}
          <line x1="0" y1="90" x2="1000" y2="90" stroke="#211C32" strokeWidth="1.5" />
          <rect x="0" y="88" width="1000" height="4" fill="#96775D" opacity="0.7" />
          <line x1="0" y1="340" x2="1000" y2="340" stroke="#211C32" strokeWidth="1.5" />

          {/* 2. WOODEN WAINSCOTING & CAFÉ FLOOR */}
          <rect x="0" y="340" width="1000" height="120" fill="#E9B49F" opacity="0.25" />
          {/* Vertical Wood Slats */}
          <line x1="120" y1="340" x2="120" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />
          <line x1="240" y1="340" x2="240" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />
          <line x1="360" y1="340" x2="360" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />
          <line x1="480" y1="340" x2="480" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />
          <line x1="600" y1="340" x2="600" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />
          <line x1="720" y1="340" x2="720" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />
          <line x1="840" y1="340" x2="840" y2="460" stroke="#96775D" strokeWidth="1" opacity="0.3" />

          {/* Skirting Board & Floor */}
          <rect x="0" y="456" width="1000" height="6" fill="#96775D" />
          <line x1="0" y1="462" x2="1000" y2="462" stroke="#211C32" strokeWidth="1.5" />
          <rect x="0" y="462" width="1000" height="158" fill="url(#floor-tiles)" />

          {/* 3. VINTAGE WALL CLOCK (Victoria Terminus Station Clock) */}
          <g filter="url(#ambient-shadow)">
            <circle cx="500" cy="52" r="26" fill="#FFFDF8" stroke="#211C32" strokeWidth="2" />
            <circle cx="500" cy="52" r="23" stroke="#96775D" strokeWidth="1.2" fill="none" />
            {/* Clock Hands at 10:10 */}
            <line x1="500" y1="52" x2="492" y2="40" stroke="#211C32" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="500" y1="52" x2="512" y2="43" stroke="#211C32" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="500" cy="52" r="2" fill="#211C32" />
            <text x="494" y="38" fontSize="5" fontFamily="Fraunces" fill="#477E85">XII</text>
            <text x="495" y="70" fontSize="5" fontFamily="Fraunces" fill="#477E85">VI</text>
          </g>

          {/* 4. HANGING BRASS PENDANT LIGHTS */}
          <g>
            {/* Left Lamp */}
            <line x1="310" y1="0" x2="310" y2="60" stroke="#96775D" strokeWidth="1.5" />
            <path d="M295 72L310 60L325 72H295Z" fill="#96775D" stroke="#211C32" strokeWidth="1.2" />
            <ellipse cx="310" cy="72" rx="15" ry="4" fill="#FFFDF8" stroke="#211C32" strokeWidth="1" />
            {/* Soft Ambient Light Cone */}
            <polygon points="295,74 325,74 355,200 265,200" fill="#FFFDF8" opacity="0.12" />

            {/* Right Lamp */}
            <line x1="690" y1="0" x2="690" y2="60" stroke="#96775D" strokeWidth="1.5" />
            <path d="M675 72L690 60L705 72H675Z" fill="#96775D" stroke="#211C32" strokeWidth="1.2" />
            <ellipse cx="690" cy="72" rx="15" ry="4" fill="#FFFDF8" stroke="#211C32" strokeWidth="1" />
            <polygon points="675,74 705,74 735,200 645,200" fill="#FFFDF8" opacity="0.12" />
          </g>

          {/* 5. TOP SHELF WITH SPICE JARS & HANGING PANS */}
          <g filter="url(#ambient-shadow)">
            <rect x="40" y="42" width="370" height="7" rx="1.5" fill="#96775D" stroke="#211C32" strokeWidth="1.5" />
            
            {/* Spice Jars on Top Shelf */}
            <rect x="60" y="24" width="16" height="18" rx="2" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.2" />
            <rect x="63" y="29" width="10" height="8" fill="#E9B49F" opacity="0.5" />
            <rect x="64" y="21" width="8" height="3" fill="#96775D" />

            <rect x="82" y="22" width="18" height="20" rx="2" fill="#E9DDC7" stroke="#211C32" strokeWidth="1.2" />
            <rect x="86" y="28" width="10" height="8" fill="#70C5D0" opacity="0.4" />
            <rect x="87" y="19" width="8" height="3" fill="#96775D" />

            <rect x="106" y="26" width="14" height="16" rx="2" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.2" />
            <rect x="108" y="23" width="10" height="3" fill="#96775D" />

            {/* Hanging Pans Rail */}
            <path d="M70 49V72" stroke="#211C32" strokeWidth="1.5" />
            <circle cx="70" cy="85" r="14" fill="#477E85" stroke="#211C32" strokeWidth="1.5" />
            <circle cx="70" cy="85" r="9" fill="#FFFDF8" opacity="0.2" />

            <path d="M130 49V80" stroke="#211C32" strokeWidth="1.5" />
            <circle cx="130" cy="98" r="18" fill="#E9B49F" stroke="#211C32" strokeWidth="1.5" />

            <path d="M190 49V68" stroke="#211C32" strokeWidth="1.5" />
            <rect x="178" y="68" width="24" height="28" rx="3" fill="#70C5D0" stroke="#211C32" strokeWidth="1.5" />

            {/* Trailing Potted Plant */}
            <rect x="330" y="28" width="26" height="14" rx="2" fill="#96775D" stroke="#211C32" strokeWidth="1.2" />
            <ellipse cx="343" cy="24" rx="16" ry="9" fill="#477E85" />
            <path d="M335 32Q325 45 328 60" stroke="#477E85" strokeWidth="1.5" fill="none" />
            <path d="M350 32Q360 48 355 64" stroke="#477E85" strokeWidth="1.5" fill="none" />
          </g>

          {/* 6. IRANI CAFÉ RULES CHALKBOARD */}
          <g filter="url(#ambient-shadow)">
            <rect x="370" y="65" width="95" height="60" rx="3" fill="#211C32" stroke="#96775D" strokeWidth="2.5" />
            <text x="382" y="80" fill="#70C5D0" fontSize="7.5" fontFamily="Fraunces" fontWeight="bold">RULES OF CAFÉ</text>
            <line x1="382" y1="84" x2="452" y2="84" stroke="#70C5D0" strokeWidth="0.8" opacity="0.6" />
            <text x="382" y="95" fill="#F5EBDD" fontSize="6.5" fontFamily="DM Sans">• No Sleeping</text>
            <text x="382" y="105" fill="#F5EBDD" fontSize="6.5" fontFamily="DM Sans">• Respect Elders</text>
            <text x="382" y="115" fill="#F5EBDD" fontSize="6.5" fontFamily="DM Sans">• Chai All Day</text>
          </g>

          {/* 7. ARCHED MORNING WINDOW (Hotspot: Window / Breakfast) */}
          <g filter="url(#ambient-shadow)" className="cursor-pointer">
            {/* Arched Window Frame */}
            <path d="M780 240V90C780 40 840 20 910 20C980 20 1020 40 1020 90V240H780Z" fill="#FFFDF8" stroke="#211C32" strokeWidth="2.5" />
            <path d="M795 230V95C795 55 845 35 910 35C975 35 1005 55 1005 95V230H795Z" fill="#70C5D0" opacity="0.35" />
            {/* Panes */}
            <line x1="910" y1="20" x2="910" y2="240" stroke="#211C32" strokeWidth="2" />
            <line x1="780" y1="130" x2="1020" y2="130" stroke="#211C32" strokeWidth="2" />
            {/* Morning Sunbeam Ray */}
            <polygon points="800,40 1000,90 860,500 620,500" fill="url(#soft-sunbeam)" className="animate-shimmer" />
          </g>

          {/* 8. DINNER STOVE & COOKING POTS (Hotspot: Stove / Dinner) */}
          <g filter="url(#ambient-shadow)">
            <rect x="50" y="310" width="170" height="150" rx="3" fill="#211C32" stroke="#211C32" strokeWidth="2" />
            <rect x="62" y="322" width="146" height="22" rx="2" fill="#477E85" />
            {/* Dials */}
            <circle cx="85" cy="365" r="6" fill="#E9B49F" stroke="#211C32" strokeWidth="1.2" />
            <circle cx="115" cy="365" r="6" fill="#E9B49F" stroke="#211C32" strokeWidth="1.2" />
            <circle cx="145" cy="365" r="6" fill="#E9B49F" stroke="#211C32" strokeWidth="1.2" />
            
            {/* Handi Pot for 24-hr House Black Daal */}
            <ellipse cx="135" cy="305" rx="38" ry="11" fill="#E9B49F" stroke="#211C32" strokeWidth="2" />
            <rect x="97" y="280" width="76" height="25" fill="#E9B49F" stroke="#211C32" strokeWidth="2" />
            <ellipse cx="135" cy="280" rx="38" ry="7" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.5" />
            <rect x="131" y="270" width="8" height="10" rx="1.5" fill="#211C32" />
            
            {/* Rising Steam Wisps */}
            <g className="animate-steam">
              <path d="M122 260Q126 248 122 235" stroke="#70C5D0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M135 255Q142 242 136 230" stroke="#70C5D0" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M148 260Q144 248 150 235" stroke="#70C5D0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            </g>
          </g>

          {/* 9. PASTRY & BAKERY SHELF (Hotspot: Pastry Shelf / Mid-Morning) */}
          <g filter="url(#ambient-shadow)">
            <rect x="610" y="220" width="145" height="120" rx="3" fill="#E9B49F" opacity="0.75" stroke="#211C32" strokeWidth="2" />
            <line x1="610" y1="265" x2="755" y2="265" stroke="#211C32" strokeWidth="2" />
            
            {/* Glass Cloches & Pastries */}
            <path d="M632 260C632 242 660 242 660 260H632Z" fill="#FFFDF8" opacity="0.8" stroke="#211C32" strokeWidth="1.5" />
            <circle cx="646" cy="242" r="3" fill="#96775D" />
            <ellipse cx="646" cy="260" rx="9" ry="3.5" fill="#96775D" />

            <path d="M700 260C700 242 728 242 728 260H700Z" fill="#FFFDF8" opacity="0.8" stroke="#211C32" strokeWidth="1.5" />
            <circle cx="714" cy="242" r="3" fill="#96775D" />
            <ellipse cx="714" cy="260" rx="9" ry="3.5" fill="#70C5D0" />

            {/* Bakery Baskets */}
            <rect x="625" y="280" width="50" height="42" rx="2" fill="#E9DDC7" stroke="#211C32" strokeWidth="1.5" />
            <rect x="688" y="280" width="50" height="42" rx="2" fill="#E9DDC7" stroke="#211C32" strokeWidth="1.5" />
          </g>

          {/* 10. MAIN TEAL ISLAND COUNTER (Hotspot: Counter / Lunch) */}
          <g filter="url(#ambient-shadow)">
            {/* White Italian Marble Countertop Surface */}
            <polygon points="270,385 730,385 780,442 220,442" fill="#FFFDF8" stroke="#211C32" strokeWidth="2" />
            {/* Front Panel (Muted Turquoise Blue) */}
            <rect x="220" y="442" width="560" height="118" rx="2" fill="#70C5D0" stroke="#211C32" strokeWidth="2.5" />
            {/* Classical Moulding Panels */}
            <rect x="240" y="455" width="115" height="90" rx="2" fill="#F5EBDD" opacity="0.6" stroke="#211C32" strokeWidth="1.2" />
            <rect x="375" y="455" width="115" height="90" rx="2" fill="#F5EBDD" opacity="0.6" stroke="#211C32" strokeWidth="1.2" />
            <rect x="510" y="455" width="115" height="90" rx="2" fill="#F5EBDD" opacity="0.6" stroke="#211C32" strokeWidth="1.2" />
            <rect x="645" y="455" width="115" height="90" rx="2" fill="#F5EBDD" opacity="0.6" stroke="#211C32" strokeWidth="1.2" />

            {/* Serving Plate with Pau Bhaji & Lemon */}
            <ellipse cx="585" cy="412" rx="30" ry="12" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.5" />
            <ellipse cx="580" cy="412" rx="15" ry="6" fill="#E9B49F" />
            <circle cx="602" cy="410" r="3.5" fill="#70C5D0" />
          </g>

          {/* 11. STEAMING CHAI KETTLE & WIRE CADDY (Hotspot: Teapot / Afternoon Chai) */}
          <g filter="url(#ambient-shadow)">
            {/* Brass Chai Kettle */}
            <path d="M418 375C418 348 462 348 462 375H418Z" fill="#E9B49F" stroke="#211C32" strokeWidth="2" />
            <ellipse cx="440" cy="375" rx="22" ry="8" fill="#E9B49F" stroke="#211C32" strokeWidth="1.5" />
            <path d="M418 360C404 360 404 345 414 340" stroke="#211C32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M462 355L475 346" stroke="#211C32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="440" cy="344" r="3.5" fill="#211C32" />
            
            {/* Rising Kettle Steam */}
            <g className="animate-steam">
              <path d="M476 342Q480 330 474 318" stroke="#70C5D0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M482 338Q488 326 480 314" stroke="#70C5D0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            </g>

            {/* Fluted Cutting Chai Glasses in Wire Caddy */}
            <rect x="360" y="392" width="13" height="19" rx="1.5" fill="#FFFDF8" opacity="0.9" stroke="#211C32" strokeWidth="1.2" />
            <rect x="378" y="392" width="13" height="19" rx="1.5" fill="#FFFDF8" opacity="0.9" stroke="#211C32" strokeWidth="1.2" />
            <line x1="360" y1="401" x2="373" y2="401" stroke="#E9B49F" strokeWidth="7" opacity="0.8" />
            <line x1="378" y1="401" x2="391" y2="401" stroke="#E9B49F" strokeWidth="7" opacity="0.8" />
          </g>

          {/* 12. CHOWPATTY STREET CART (Hotspot: Street Cart / Sunset Snacks) */}
          <g filter="url(#ambient-shadow)">
            <rect x="765" y="365" width="185" height="145" rx="3" fill="#E9DDC7" stroke="#211C32" strokeWidth="2" />
            {/* Striped Awning */}
            <polygon points="755,365 960,365 940,328 775,328" fill="#70C5D0" stroke="#211C32" strokeWidth="2" />
            <path d="M795 328L785 365M835 328L830 365M875 328L875 365M915 328L920 365" stroke="#211C32" strokeWidth="1.5" />
            {/* Spokes & Wheel */}
            <circle cx="805" cy="530" r="24" fill="#FFFDF8" stroke="#211C32" strokeWidth="2.5" />
            <circle cx="805" cy="530" r="5" fill="#211C32" />
            <circle cx="910" cy="530" r="24" fill="#FFFDF8" stroke="#211C32" strokeWidth="2.5" />
            <circle cx="910" cy="530" r="5" fill="#211C32" />
            {/* Chutney Glass Jars */}
            <rect x="788" y="380" width="20" height="28" rx="2" fill="#FFFDF8" opacity="0.85" stroke="#211C32" strokeWidth="1.2" />
            <rect x="815" y="380" width="20" height="28" rx="2" fill="#E9B49F" stroke="#211C32" strokeWidth="1.2" />
            <rect x="842" y="380" width="20" height="28" rx="2" fill="#70C5D0" stroke="#211C32" strokeWidth="1.2" />
          </g>

          {/* 13. DESSERT & SWEETS CABINET (Hotspot: Dessert Cabinet / Pudding) */}
          <g filter="url(#ambient-shadow)">
            <rect x="180" y="125" width="135" height="135" rx="3" fill="#FFFDF8" stroke="#211C32" strokeWidth="2" />
            <rect x="188" y="133" width="119" height="119" fill="#70C5D0" opacity="0.18" stroke="#211C32" strokeWidth="1.2" />
            <line x1="188" y1="172" x2="307" y2="172" stroke="#211C32" strokeWidth="1.5" />
            <line x1="188" y1="212" x2="307" y2="212" stroke="#211C32" strokeWidth="1.5" />
            {/* Mithai Bowls */}
            <ellipse cx="225" cy="166" rx="12" ry="4" fill="#E9B49F" stroke="#211C32" strokeWidth="1.2" />
            <circle cx="225" cy="162" r="3.5" fill="#E9DDC7" />
            <ellipse cx="265" cy="166" rx="12" ry="4" fill="#E9B49F" stroke="#211C32" strokeWidth="1.2" />
            <circle cx="265" cy="162" r="3.5" fill="#70C5D0" />
            <text x="208" y="240" fill="#211C32" fontSize="7.5" fontFamily="Fraunces" fontWeight="bold">MITHAI SWEETS</text>
          </g>

          {/* 14. WALL-MOUNTED DISHOOM COOKBOOK (Hotspot: Cookbook Wall) */}
          <g filter="url(#ambient-shadow)">
            <rect x="475" y="110" width="65" height="85" rx="2" fill="#211C32" stroke="#211C32" strokeWidth="2" />
            <rect x="488" y="110" width="52" height="85" rx="1.5" fill="#70C5D0" stroke="#211C32" strokeWidth="1.2" />
            <text x="494" y="142" fill="#211C32" fontSize="8" fontFamily="Fraunces" fontWeight="bold">DISHOOM</text>
            <text x="495" y="156" fill="#211C32" fontSize="5.5" fontFamily="DM Sans" fontWeight="bold">COOKBOOK</text>
            <circle cx="514" cy="172" r="5" fill="#E9B49F" stroke="#211C32" strokeWidth="0.8" />
          </g>
        </svg>

        {/* REFINED EDITORIAL HOTSPOT PINS */}
        {HOTSPOTS.map((h) => {
          const isMatching = isHotspotMatchingDiet(h);
          const isSelected = activeHotspot?.id === h.id;
          const isHovered = hoveredHotspot?.id === h.id;

          return (
            <div
              key={h.id}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-30 flex items-center justify-center"
            >
              {/* Invisible large touch target (44px) for accessibility */}
              <button
                onClick={() => handleHotspotClick(h)}
                onMouseEnter={() => {
                  setHoveredHotspot(h);
                  playBoop();
                }}
                onMouseLeave={() => setHoveredHotspot(null)}
                aria-label={h.ariaLabel}
                className={`w-11 h-11 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#70C5D0] rounded-full transition-opacity ${
                  isMatching ? 'opacity-100' : 'opacity-25 pointer-events-none'
                }`}
              >
                {/* Refined Small Circular Hotspot Pin */}
                <div 
                  className={`w-7 h-7 rounded-full border border-[#211C32]/80 flex items-center justify-center transition-all duration-200 shadow-sm ${
                    isSelected
                      ? 'bg-[#70C5D0] text-[#211C32] scale-110 ring-3 ring-[#70C5D0]/40'
                      : 'bg-[#FFFDF8] text-[#211C32] hover:bg-[#70C5D0] hover:scale-108'
                  }`}
                >
                  <span className="text-xs select-none">{h.icon}</span>
                </div>
              </button>

              {/* Refined Contextual Floating Tooltip */}
              <div 
                className={`absolute bottom-full mb-1.5 whitespace-nowrap px-2.5 py-1 rounded bg-[#211C32] text-[#FFFDF8] text-[11px] font-sans font-medium tracking-tight shadow-md transition-all duration-150 pointer-events-none z-40 ${
                  isHovered || isSelected ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                }`}
              >
                <span>{h.title}</span>
                <span className="text-[#70C5D0] ml-1.5 text-[9.5px] font-mono">• {h.subtitle.split('&')[0]}</span>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#211C32]" />
              </div>
            </div>
          );
        })}

        {/* WALKING TINY CHEF ALONG COUNTER */}
        <ChefCharacter 
          onRecommendRecipe={() => {
            const stoveHotspot = HOTSPOTS.find(h => h.id === 'stove');
            if (stoveHotspot) handleHotspotClick(stoveHotspot);
          }} 
        />
      </div>

      {/* Bottom Scene Bar */}
      <div className="bg-[#E9DDC7]/60 border-t border-[#211C32]/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
        <div className="flex items-center gap-2 text-[#211C32] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#477E85]" />
          <span>8 Interactive Café Stations active</span>
        </div>
        <div className="text-[11.5px] text-[#477E85] font-mono">
          Click any icon to discover recipes & history
        </div>
      </div>
    </div>
  );
}
