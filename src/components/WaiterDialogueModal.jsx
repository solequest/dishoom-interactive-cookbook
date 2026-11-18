import React, { useState } from 'react';
import { 
  X, 
  ChefHat, 
  Eye, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Flame, 
  Wine, 
  ArrowRight,
  Utensils
} from 'lucide-react';
import { playClick, playCollect, playSizzle } from '../audio/soundEffects';
import { getCulinaryStory } from '../data/culinaryStories';

export default function WaiterDialogueModal({
  isOpen,
  onClose,
  dish,
  serviceLocation = 'table',
  isCollected,
  onToggleCollect,
  onOpenFullRecipe,
  onOpenCooksPov,
  onOpenWaitersPov
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen || !dish) return null;

  const story = getCulinaryStory(dish.id, dish.name);
  const isBar = serviceLocation === 'bar';

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[500px] z-50 bg-[#211C32]/95 backdrop-blur-md text-[#FFFDF8] p-4 rounded-2xl border-2 border-[#D4A750] shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 paper-texture"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl shrink-0">{dish.heroEmoji || '🍛'}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-fraunces font-bold text-[#E9B49F] text-sm truncate">{dish.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                isBar 
                  ? 'text-[#E87C28] bg-[#E87C28]/20 border border-[#E87C28]/40' 
                  : 'text-[#3CAFB8] bg-[#3CAFB8]/20 border border-[#3CAFB8]/40'
              }`}>
                {isBar ? '🍸 Permit Room Bar' : '🪑 Table 4 Service'}
              </span>
            </div>
            <p className="text-[11px] text-[#E9DDC7]/80 truncate italic font-sans">
              "{story.waiterGreeting}"
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playClick();
              setIsMinimized(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#3CAFB8] hover:bg-[#4AC0C9] text-[#211C32] font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Expand Recipe
          </button>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-[#E9DDC7] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#100703]/82 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#F5EBDD] text-[#211C32] rounded-2xl border-4 border-[#361E14] shadow-2xl overflow-hidden flex flex-col paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Service Pass Header */}
        <div className="bg-[#24130A] text-[#FFFDF8] px-6 py-3.5 border-b border-[#D4A750]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4A750] text-[#211C32] flex items-center justify-center font-bold text-sm shadow-xs">
              🤵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-fraunces text-lg font-bold text-[#E9DDC7]">
                  Captain Sorabji • Dishoom Floor Captain
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isBar 
                    ? 'bg-[#E87C28]/20 border-[#E87C28] text-[#E87C28]' 
                    : 'bg-[#3CAFB8]/20 border-[#3CAFB8] text-[#3CAFB8]'
                }`}>
                  {isBar ? '🍸 Permit Room Bar Service' : '🪑 Table 4 Service'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#D4A750]">{story.kotNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClick();
                setIsMinimized(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-[#3CAFB8]/20 hover:bg-[#3CAFB8] text-[#3CAFB8] hover:text-[#211C32] border border-[#3CAFB8] transition-all cursor-pointer"
              title={`Minimize to view your steaming dish in 3D at ${isBar ? 'the Bar' : 'Table 4'}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isBar ? 'View Bar Dish' : 'View Table Dish'}</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-[#FFFDF8]/20 text-[#E9DDC7] transition-colors cursor-pointer"
              aria-label="Close dialogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto max-h-[75vh] space-y-5">
          {/* Dish Feature & Captain Greeting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#FFFDF8] border border-[#211C32]/10 shadow-xs">
            <div className="flex items-center gap-3.5">
              <span className="text-4xl">{dish.heroEmoji || '🍛'}</span>
              <div>
                <h3 className="font-fraunces text-2xl font-bold text-[#211C32] tracking-tight">
                  {dish.name}
                </h3>
                <p className="text-xs text-[#477E85] font-mono">
                  {dish.prepTime} prep • {dish.cookTime} cook • Dishoom Cookbook p. {dish.bookPage}
                </p>
              </div>
            </div>

            {/* Collect / Bookmark Button */}
            <button
              onClick={() => {
                playCollect();
                onToggleCollect(dish.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isCollected
                  ? 'bg-[#3CAFB8] text-[#211C32] border-[#3CAFB8]'
                  : 'bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border-[#211C32]/20'
              }`}
            >
              {isCollected ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#211C32]" />
                  <span>In My Cookbook</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#477E85]" />
                  <span>Save to Cookbook</span>
                </>
              )}
            </button>
          </div>

          {/* Captain's Speech Box */}
          <div className="relative p-5 rounded-xl bg-[#FFFDF8] border-l-4 border-l-[#477E85] border border-[#211C32]/10 shadow-xs">
            <p className="font-fraunces text-base sm:text-lg font-bold text-[#477E85] mb-2 italic">
              "{story.waiterGreeting}"
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#211C32]/90 leading-relaxed">
              {story.waiterStory}
            </p>
          </div>

          {/* Culinary Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* The Chef's Secret */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#211C32]/10">
              <div className="flex items-center gap-1.5 text-[#C85226] font-bold font-fraunces mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Kitchen Secret</span>
              </div>
              <p className="text-[11.5px] font-sans text-[#211C32]/80 leading-snug">
                {story.secretIngredient}
              </p>
            </div>

            {/* Captain's Pairing */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#211C32]/10">
              <div className="flex items-center gap-1.5 text-[#477E85] font-bold font-fraunces mb-1">
                <Wine className="w-3.5 h-3.5" />
                <span>Captain's Pairing & Etiquette</span>
              </div>
              <p className="text-[11.5px] font-sans text-[#211C32]/80 leading-snug">
                {story.servicePairing}
              </p>
            </div>
          </div>

          {/* Tasting Note Ribbon */}
          <div className="px-4 py-2.5 rounded-lg bg-[#EAE0D0] border border-[#211C32]/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#96775D] uppercase tracking-wider font-semibold">Tasting Profile:</span>
            <span className="text-[#211C32] italic">{story.tastingNotes}</span>
          </div>

          {/* Interactive POV Callouts */}
          <div className="pt-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#96775D] font-bold mb-2.5">
              Explore Different Perspectives of This Dish:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Cook's POV Button */}
              <button
                onClick={() => {
                  playSizzle();
                  onOpenCooksPov(dish);
                }}
                className="p-3 rounded-xl bg-[#24130A] hover:bg-[#C85226] text-[#FFFDF8] transition-all text-left flex flex-col justify-between shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono text-amber-300">Tandoor & Hearth</span>
                </div>
                <div>
                  <span className="font-fraunces text-sm font-bold block">Cook's POV</span>
                  <span className="text-[11px] text-[#FFFDF8]/75 block font-sans">
                    Step inside the kitchen & master the secret steps
                  </span>
                </div>
              </button>

              {/* Waiter's POV Button */}
              <button
                onClick={() => {
                  playClick();
                  onOpenWaitersPov(dish);
                }}
                className="p-3 rounded-xl bg-[#211C32] hover:bg-[#3CAFB8] text-[#FFFDF8] hover:text-[#211C32] transition-all text-left flex flex-col justify-between shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Utensils className="w-4 h-4 text-[#70C5D0] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono text-[#70C5D0] group-hover:text-[#211C32]">Service Pass</span>
                </div>
                <div>
                  <span className="font-fraunces text-sm font-bold block">Waiter's POV</span>
                  <span className="text-[11px] opacity-80 block font-sans">
                    View service ticket, tray presentation & etiquette
                  </span>
                </div>
              </button>

              {/* Full Recipe Drawer Button */}
              <button
                onClick={() => {
                  playClick();
                  onOpenFullRecipe(dish);
                }}
                className="p-3 rounded-xl bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/20 transition-all text-left flex flex-col justify-between shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-4 h-4 text-[#477E85] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono text-[#477E85]">Full Recipe</span>
                </div>
                <div>
                  <span className="font-fraunces text-sm font-bold block">Recipe Book</span>
                  <span className="text-[11px] text-[#211C32]/75 block font-sans">
                    Detailed ingredient list & numbered cooking steps
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-[#EAE0D0] px-6 py-3 border-t border-[#211C32]/10 flex items-center justify-between text-xs font-mono">
          <button
            onClick={onClose}
            className="text-[#211C32]/75 hover:text-[#211C32] hover:underline cursor-pointer"
          >
            ← Return to Table
          </button>
          <span className="text-[#96775D]">Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
}

