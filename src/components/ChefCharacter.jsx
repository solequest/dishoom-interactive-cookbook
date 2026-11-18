import React, { useState } from 'react';
import { playBoop } from '../audio/soundEffects';

const CHEF_QUOTES = [
  "Namaste! The House Black Daal has simmered for 24 hours today!",
  "Craving breakfast? Tap the morning window for the Bacon Naan Roll!",
  "A cutting glass of Masala Chai cures every afternoon slump.",
  "Looking for crunch? The Chowpatty cart has fresh Bhel Puri!",
  "Save room for Falooda and warm Gulab Jamuns!",
  "Every recipe here has its page marked in the Dishoom cookbook."
];

export default function ChefCharacter({ onRecommendRecipe }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  const handleClick = () => {
    playBoop();
    setIsWaving(true);
    setShowSpeech(true);
    setQuoteIndex((prev) => (prev + 1) % CHEF_QUOTES.length);
    setTimeout(() => setIsWaving(false), 800);
  };

  return (
    <div 
      className="absolute bottom-28 left-1/3 -translate-x-1/2 z-20 cursor-pointer group select-none"
      onClick={handleClick}
      title="Click the Chef for today's special recommendation!"
    >
      {/* Editorial Speech Bubble */}
      {showSpeech && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-52 sm:w-60 p-3 rounded-xl bg-[#FFFDF8] border border-[#211C32]/15 shadow-lg text-xs font-sans text-[#211C32] leading-snug animate-in fade-in zoom-in duration-150 z-30">
          <p className="font-fraunces font-bold text-[#477E85] text-xs mb-0.5">Chef's Recommendation:</p>
          <p className="text-[11px] leading-relaxed">{CHEF_QUOTES[quoteIndex]}</p>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-[#211C32]" />
        </div>
      )}

      {/* Chef Figure SVG */}
      <div className={`relative transition-transform duration-200 ${isWaving ? '-translate-y-2 scale-110' : 'group-hover:scale-105'}`}>
        <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Chef Hat */}
          <ellipse cx="24" cy="12" rx="14" ry="10" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.8" />
          <path d="M14 14C14 8 18 4 24 4C30 4 34 8 34 14" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.8" />
          <rect x="15" y="14" width="18" height="6" rx="2" fill="#70C5D0" stroke="#211C32" strokeWidth="1.4" />

          {/* Head */}
          <circle cx="24" cy="24" r="8" fill="#E9B49F" stroke="#211C32" strokeWidth="1.5" />
          
          {/* Eyes */}
          <circle cx="21" cy="23" r="1.3" fill="#211C32" />
          <circle cx="27" cy="23" r="1.3" fill="#211C32" />
          
          {/* Signature Bombay Chef Moustache */}
          <path d="M19 28C21 26.5 24 28 24 28C24 28 27 26.5 29 28" stroke="#211C32" strokeWidth="1.6" strokeLinecap="round" />

          {/* Body / Coat */}
          <path d="M14 32C14 30 18 30 24 30C30 30 34 30 34 32L36 50H12L14 32Z" fill="#FFFDF8" stroke="#211C32" strokeWidth="1.8" />

          {/* Apron Straps & Buttons */}
          <circle cx="24" cy="36" r="1.2" fill="#211C32" />
          <circle cx="24" cy="42" r="1.2" fill="#211C32" />
          <rect x="16" y="44" width="16" height="8" rx="2" fill="#70C5D0" stroke="#211C32" strokeWidth="1.2" />

          {/* Arms / Waving Hand */}
          <path d="M12 34L6 42" stroke="#211C32" strokeWidth="2" strokeLinecap="round" />
          {isWaving ? (
            <path d="M36 34L44 24" stroke="#211C32" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
          ) : (
            <path d="M36 34L42 42" stroke="#211C32" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Feet */}
          <rect x="16" y="50" width="6" height="4" rx="2" fill="#211C32" />
          <rect x="26" y="50" width="6" height="4" rx="2" fill="#211C32" />
        </svg>

        {/* Small Name Pill on Hover */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#211C32] text-[#FFFDF8] text-[9.5px] font-sans font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
          Tap Chef
        </div>
      </div>
    </div>
  );
}
