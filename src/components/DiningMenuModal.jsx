import React, { useState } from 'react';
import { X, Utensils, BookOpen, Clock, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { playClick, playBell } from '../audio/soundEffects';

export default function DiningMenuModal({
  isOpen,
  onClose,
  recipes,
  onOrderDish,
  activeSection,
  onSelectSection
}) {
  const [selectedCategory, setSelectedCategory] = useState(activeSection || 'all');
  const [dietFilter, setDietFilter] = useState('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'breakfast', label: 'Breakfast & Naans' },
    { id: 'mid-morning', label: 'Mid-Morning' },
    { id: 'lunch', label: 'Lunch Specials' },
    { id: 'afternoon', label: 'Afternoon Chai' },
    { id: 'sunset', label: 'Sunset Snacks' },
    { id: 'dinner', label: 'Dinner & Daals' },
    { id: 'pudding', label: 'Puddings' },
  ];

  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.mealSection === selectedCategory;
    const matchesDiet = dietFilter === 'all' || r.diet === dietFilter;
    return matchesCategory && matchesDiet;
  });

  const handleOrder = (recipe) => {
    playBell();
    onOrderDish(recipe);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#120A05]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#F5EBDD] text-[#211C32] rounded-2xl border-4 border-[#361E14] shadow-2xl flex flex-col overflow-hidden paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vintage Embossed Leather Header */}
        <div className="bg-[#2B170E] text-[#FFFDF8] px-6 py-4 border-b border-[#D4A750]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-fraunces text-xl sm:text-2xl font-bold tracking-tight text-[#E9DDC7]">
                  DISHOOM PERMIT ROOM & CAFÉ
                </h2>
                <span className="text-[10px] font-mono tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#D4A750]/20 border border-[#D4A750] text-[#D4A750] uppercase">
                  Table Menu
                </span>
              </div>
              <p className="text-xs text-[#E9DDC7]/70 font-sans">
                Choose an authentic dish from our kitchen archives to hear the Captain explain its recipe.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-[#FFFDF8]/15 text-[#E9DDC7] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Bar */}
        <div className="px-6 py-3 bg-[#EAE0D0] border-b border-[#211C32]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Courses Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-md font-sans text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#211C32] text-[#FFFDF8] font-semibold shadow-xs'
                    : 'text-[#211C32]/80 hover:bg-[#E9DDC7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dietary Diet Switcher */}
          <div className="flex items-center gap-1">
            {['all', 'veg', 'non-veg'].map((diet) => (
              <button
                key={diet}
                onClick={() => {
                  playClick();
                  setDietFilter(diet);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                  dietFilter === diet
                    ? 'bg-[#477E85] text-[#FFFDF8] font-bold'
                    : 'bg-[#FFFDF8]/70 text-[#211C32] hover:bg-[#FFFDF8]'
                }`}
              >
                {diet === 'all' ? 'All Diets' : diet}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#211C32]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => (
              <div 
                key={recipe.id}
                className="group p-4 rounded-xl bg-[#FFFDF8] border border-[#211C32]/10 hover:border-[#3CAFB8] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" role="img" aria-label={recipe.name}>
                        {recipe.heroEmoji || '🍽️'}
                      </span>
                      <div>
                        <h3 className="font-fraunces text-base font-bold text-[#211C32] group-hover:text-[#477E85] transition-colors leading-tight">
                          {recipe.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#96775D] uppercase tracking-wider">
                          Cookbook Page {recipe.bookPage}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full border ${
                      recipe.diet === 'veg' 
                        ? 'border-emerald-600/40 text-emerald-800 bg-emerald-50' 
                        : recipe.diet === 'egg'
                        ? 'border-amber-600/40 text-amber-800 bg-amber-50'
                        : 'border-rose-600/40 text-rose-800 bg-rose-50'
                    }`}>
                      {recipe.diet}
                    </span>
                  </div>

                  <p className="text-xs text-[#211C32]/80 leading-relaxed font-sans line-clamp-2 mb-2">
                    {recipe.shortDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#477E85] font-mono mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.prepTime} prep • {recipe.cookTime}
                    </span>
                    <span>•</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#211C32]/8 flex items-center justify-between">
                  <span className="text-[11px] text-[#96775D] italic font-serif truncate max-w-[170px]">
                    {recipe.flavorNotes || 'Authentic Bombay recipe'}
                  </span>

                  <button
                    onClick={() => handleOrder(recipe)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#211C32] hover:bg-[#3CAFB8] text-[#FFFDF8] hover:text-[#211C32] text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Order for Table</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="font-fraunces text-lg text-[#211C32]">No dishes match your selected filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setDietFilter('all');
                }}
                className="mt-2 text-xs font-mono text-[#477E85] underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="bg-[#EBDDC7] px-6 py-2.5 border-t border-[#211C32]/10 flex items-center justify-between text-xs text-[#211C32]/70 font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#477E85]" />
            Ordering a dish unlocks the Captain's explanation and Chef's Cook POV
          </span>
          <span className="hidden sm:inline">13 Heritage Dishes Available</span>
        </div>
      </div>
    </div>
  );
}

