import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Users, 
  ChefHat, 
  Bookmark, 
  BookmarkCheck, 
  Box, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Info,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playCollect } from '../audio/soundEffects';

export default function ZoneDrawer({
  isOpen,
  onClose,
  activeHotspot,
  recipes,
  selectedDiet,
  collectedRecipeIds,
  onToggleCollect,
  onOpenAr,
  onOpenCookbook,
}) {
  // Filter recipes belonging to this hotspot and respecting current diet filter
  const zoneRecipes = recipes.filter((r) => {
    const matchesSection = r.hotspotId === activeHotspot?.id;
    const matchesDiet = selectedDiet === 'all' || r.diet === selectedDiet;
    return matchesSection && matchesDiet;
  });

  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Reset selected recipe index when active hotspot changes
  useEffect(() => {
    setSelectedRecipeIndex(0);
    setCheckedIngredients({});
  }, [activeHotspot]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !activeHotspot) return null;

  const currentRecipe = zoneRecipes[selectedRecipeIndex] || zoneRecipes[0];
  const isCollected = currentRecipe ? collectedRecipeIds.includes(currentRecipe.id) : false;

  const toggleIngredientCheck = (idx) => {
    playClick();
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCollect = () => {
    if (!currentRecipe) return;
    if (!isCollected) {
      playCollect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#70C5D0', '#E9B49F', '#477E85', '#211C32'],
      });
    } else {
      playClick();
    }
    onToggleCollect(currentRecipe.id);
  };

  const getDietPill = (diet) => {
    switch (diet) {
      case 'veg':
        return { label: 'Vegetarian', icon: '🌱', badgeClass: 'bg-[#70C5D0]/20 text-[#211C32] border-[#70C5D0]/50' };
      case 'egg':
        return { label: 'Contains Egg', icon: '🥚', badgeClass: 'bg-[#E9B49F]/30 text-[#211C32] border-[#E9B49F]' };
      case 'non-veg':
        return { label: 'Non-Vegetarian', icon: '🍗', badgeClass: 'bg-[#96775D]/20 text-[#211C32] border-[#96775D]/40' };
      default:
        return { label: diet, icon: '🍽️', badgeClass: 'bg-[#E9DDC7] text-[#211C32]' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed Warm Backdrop */}
      <div 
        className="absolute inset-0 bg-[#211C32]/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          playClick();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside 
        className="relative w-full sm:max-w-lg md:max-w-xl h-full bg-[#FFFDF8] border-l border-[#211C32]/15 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 ease-out overflow-hidden"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-modal="true"
      >
        {/* Drawer Top Editorial Bar */}
        <div className="bg-[#F5EBDD] border-b border-[#211C32]/12 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#E9DDC7] border border-[#211C32]/15 flex items-center justify-center text-xl shadow-xs">
              {activeHotspot.icon}
            </span>
            <div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#477E85] uppercase block">
                {activeHotspot.subtitle}
              </span>
              <h2 id="drawer-title" className="font-fraunces text-2xl font-bold text-[#211C32] tracking-tight leading-none">
                {activeHotspot.title}
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer transition-all"
            aria-label="Close recipe drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Zone Recipes Tabs (if more than 1 recipe in this zone) */}
        {zoneRecipes.length > 1 && (
          <div className="bg-[#E9DDC7]/40 px-6 py-2.5 border-b border-[#211C32]/10 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[11px] font-mono text-[#477E85] font-semibold mr-1">
              Dishes ({zoneRecipes.length}):
            </span>
            {zoneRecipes.map((r, idx) => {
              const isSelected = idx === selectedRecipeIndex;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    playClick();
                    setSelectedRecipeIndex(idx);
                    setCheckedIngredients({});
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#211C32] text-[#FFFDF8] border-[#211C32] font-semibold shadow-xs'
                      : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/15 hover:bg-[#E9DDC7]'
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Drawer Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {currentRecipe ? (
            <article className="space-y-6">
              {/* Recipe Hero Visual Card */}
              <div 
                className="relative rounded-xl p-6 border border-[#211C32]/15 overflow-hidden shadow-xs"
                style={{ backgroundColor: `${currentRecipe.colorAccent}15` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {/* Diet & Page Reference Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full border ${getDietPill(currentRecipe.diet).badgeClass}`}>
                        <span>{getDietPill(currentRecipe.diet).icon}</span>
                        <span>{getDietPill(currentRecipe.diet).label}</span>
                      </span>

                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#211C32] text-[#FFFDF8]">
                        Book p. {currentRecipe.bookPage}
                      </span>

                      {currentRecipe.containsAlcohol && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          Contains Alcohol
                        </span>
                      )}
                    </div>

                    {/* Recipe Title in Fraunces */}
                    <h3 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#211C32] tracking-tight leading-tight mb-2">
                      {currentRecipe.name}
                    </h3>

                    {/* Descriptive Introduction */}
                    <p className="text-sm font-sans text-[#211C32]/85 leading-relaxed">
                      {currentRecipe.shortDescription}
                    </p>
                  </div>

                  {/* Hero Emoji / Visual Stamp */}
                  <div className="w-16 h-16 rounded-xl bg-[#FFFDF8] border border-[#211C32]/15 flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {currentRecipe.heroEmoji || '🍽️'}
                  </div>
                </div>

                {/* Flavor Notes Pill Strip */}
                <div className="mt-4 pt-3 border-t border-[#211C32]/10 flex flex-wrap gap-1.5">
                  <span className="text-[10.5px] font-mono text-[#477E85] font-semibold mr-1 self-center">
                    Notes:
                  </span>
                  {currentRecipe.flavorNotes.split(',').map((note, i) => (
                    <span key={i} className="text-[10.5px] font-sans px-2 py-0.5 bg-[#FFFDF8] rounded border border-[#211C32]/10 text-[#211C32]">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cultural Background / Bombay Origin Box */}
              <div className="bg-[#F5EBDD] rounded-xl p-4 border-l-4 border-[#70C5D0] border-y border-r border-[#211C32]/10 shadow-xs">
                <span className="text-[10px] font-mono font-bold text-[#477E85] tracking-widest uppercase block mb-1">
                  Bombay Memory & Heritage
                </span>
                <p className="text-xs font-sans text-[#211C32]/90 leading-relaxed italic">
                  "{currentRecipe.culturalNote}"
                </p>
              </div>

              {/* Editorial Metadata Bar (Prep, Cook, Servings, Difficulty) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#E9DDC7]/40 border border-[#211C32]/12">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#477E85]" />
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-[#477E85] block font-semibold">Prep</span>
                    <span className="text-xs font-sans font-bold text-[#211C32]">{currentRecipe.prepTime || '10 mins'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-[#477E85]" />
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-[#477E85] block font-semibold">Cook</span>
                    <span className="text-xs font-sans font-bold text-[#211C32]">{currentRecipe.cookTime || '20 mins'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#477E85]" />
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-[#477E85] block font-semibold">Serves</span>
                    <span className="text-xs font-sans font-bold text-[#211C32]">{currentRecipe.servings || '4'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#477E85]" />
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-[#477E85] block font-semibold">Difficulty</span>
                    <span className="text-xs font-sans font-bold text-[#211C32]">{currentRecipe.difficulty || 'Easy'}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Ingredients Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-fraunces text-lg font-bold text-[#211C32]">
                    Ingredients Checklist
                  </h4>
                  <span className="text-[11px] font-mono text-[#477E85]">
                    Tap to check off
                  </span>
                </div>

                <div className="bg-[#FFFDF8] rounded-xl border border-[#211C32]/12 p-3 space-y-2">
                  {currentRecipe.ingredients?.map((ing, idx) => {
                    const isChecked = !!checkedIngredients[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIngredientCheck(idx)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#70C5D0]/15 text-[#211C32]/50' : 'hover:bg-[#F5EBDD]'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#477E85] shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-[#211C32]/40 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs font-sans ${isChecked ? 'line-through' : 'text-[#211C32]'}`}>
                          {ing}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Numbered Cooking Method Instructions */}
              <div>
                <h4 className="font-fraunces text-lg font-bold text-[#211C32] mb-2.5">
                  Method & Instructions
                </h4>

                <div className="space-y-3">
                  {currentRecipe.instructions?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#F5EBDD]/60 border border-[#211C32]/8">
                      <span className="w-5 h-5 rounded-full bg-[#211C32] text-[#FFFDF8] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-sans text-[#211C32]/90 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipe Action Buttons (Collect & 3D AR) */}
              <div className="pt-4 border-t border-[#211C32]/12 flex flex-wrap items-center justify-between gap-3">
                {currentRecipe.hasArModel ? (
                  <button
                    onClick={() => onOpenAr(currentRecipe.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans font-semibold bg-[#70C5D0] hover:bg-[#70C5D0]/80 text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer tactile-btn"
                  >
                    <Box className="w-4 h-4" />
                    <span>View in 3D / Tabletop AR</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-[#477E85]">
                    Dishoom Lookbook Classic
                  </span>
                )}

                <button
                  onClick={handleCollect}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-sans font-semibold border transition-all cursor-pointer shadow-xs tactile-btn ${
                    isCollected
                      ? 'bg-[#211C32] text-[#FFFDF8] border-[#211C32]'
                      : 'bg-[#E9B49F] hover:bg-[#E9B49F]/80 text-[#211C32] border-[#211C32]/15'
                  }`}
                >
                  {isCollected ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-[#70C5D0]" />
                      <span>Saved in My Cookbook</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Add to My Cookbook</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          ) : (
            <div className="p-10 text-center bg-[#F5EBDD] rounded-xl border border-[#211C32]/15 my-6">
              <AlertCircle className="w-8 h-8 text-[#477E85] mx-auto mb-2" />
              <h3 className="font-fraunces text-lg text-[#211C32] mb-1">
                No matching recipes
              </h3>
              <p className="text-xs font-sans text-[#211C32]/80">
                No recipes in this zone match the current "{selectedDiet}" filter.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Bottom Bar */}
        <div className="p-3.5 bg-[#F5EBDD] border-t border-[#211C32]/12 flex items-center justify-between text-xs font-sans shrink-0 px-6">
          <button
            onClick={() => {
              playClick();
              onOpenCookbook();
            }}
            className="text-[#477E85] hover:text-[#211C32] font-medium flex items-center gap-1.5 underline cursor-pointer"
          >
            <span>View Collected Cookbook Album</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10.5px] font-mono text-[#211C32]/60">Press Esc to return</span>
        </div>
      </aside>
    </div>
  );
}
