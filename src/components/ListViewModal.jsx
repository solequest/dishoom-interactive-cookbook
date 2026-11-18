import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import { X, Search, ArrowLeft, Sparkles } from 'lucide-react';
import { MEAL_SECTIONS } from '../data/recipes';
import { playClick } from '../audio/soundEffects';

const DIET_OPTIONS = [
  { id: 'all', label: 'All Diets' },
  { id: 'veg', label: '🌱 Vegetarian' },
  { id: 'egg', label: '🥚 Contains Egg' },
  { id: 'non-veg', label: '🍗 Non-Veg' },
];

export default function ListViewModal({
  isOpen,
  onClose,
  recipes,
  collectedRecipeIds,
  onToggleCollect,
  onOpenAr,
  onOpenDrawer,
  selectedDiet,
  onSelectDiet,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');

  if (!isOpen) return null;

  const filtered = recipes.filter((r) => {
    const matchesDiet = selectedDiet === 'all' || r.diet === selectedDiet;
    const matchesSection = sectionFilter === 'all' || r.mealSection === sectionFilter;
    const matchesQuery = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.culturalNote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiet && matchesSection && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#211C32]/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#FFFDF8] rounded-2xl border border-[#211C32]/15 shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Editorial Header */}
        <div className="bg-[#F5EBDD] border-b border-[#211C32]/12 px-6 py-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer transition-colors"
              title="Return to Café Scene"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#477E85] uppercase block">
                The Complete Anthology
              </span>
              <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#211C32] tracking-tight leading-none">
                Recipe Index
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer transition-colors"
            aria-label="Close index"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#E9DDC7]/40 px-6 py-3.5 border-b border-[#211C32]/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-[#477E85] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, spices, ingredients..."
              className="w-full pl-9 pr-7 py-2 text-xs font-sans bg-[#FFFDF8] border border-[#211C32]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70C5D0] text-[#211C32] shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#211C32]/50 hover:text-[#211C32] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Chapter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-medium text-[#477E85] hidden sm:inline">Chapter:</span>
            <select
              value={sectionFilter}
              onChange={(e) => {
                playClick();
                setSectionFilter(e.target.value);
              }}
              className="px-3 py-1.5 text-xs font-sans font-semibold bg-[#FFFDF8] border border-[#211C32]/15 rounded-lg text-[#211C32] cursor-pointer shadow-xs"
            >
              {MEAL_SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.icon} {sec.label}
                </option>
              ))}
            </select>
          </div>

          {/* Diet Quick Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {DIET_OPTIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  playClick();
                  onSelectDiet(d.id);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer whitespace-nowrap border ${
                  selectedDiet === d.id
                    ? 'bg-[#211C32] text-[#FFFDF8] border-[#211C32] font-semibold'
                    : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/15 hover:bg-[#E9DDC7]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-xs font-mono font-semibold text-[#477E85]">
            {filtered.length} of {recipes.length} dishes
          </div>
        </div>

        {/* Recipe Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F5EBDD]/40">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isCollected={collectedRecipeIds.includes(recipe.id)}
                  onToggleCollect={onToggleCollect}
                  onOpenAr={onOpenAr}
                  onOpenDrawer={(r) => {
                    onClose();
                    if (onOpenDrawer) onOpenDrawer(r);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#FFFDF8] rounded-2xl border border-[#211C32]/12 editorial-shadow my-6 max-w-md mx-auto">
              <h3 className="font-fraunces text-xl font-bold text-[#211C32] mb-1.5">
                No Recipes Found
              </h3>
              <p className="text-xs font-sans text-[#211C32]/80 mb-4">
                No recipes match "{searchQuery}" under the selected filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSectionFilter('all');
                  onSelectDiet('all');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#70C5D0] text-[#211C32] font-sans font-semibold border border-[#211C32]/15 shadow-xs cursor-pointer text-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F5EBDD] border-t border-[#211C32]/12 px-6 py-3 flex items-center justify-between text-xs font-sans text-[#211C32]/80 shrink-0">
          <span className="text-[#477E85] font-mono">
            Every recipe cites its chapter and page in Dishoom: From Bombay with Love.
          </span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="font-medium underline hover:text-[#211C32] cursor-pointer"
          >
            Back to Interactive Café
          </button>
        </div>
      </div>
    </div>
  );
}
