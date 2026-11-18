import React from 'react';
import { MEAL_SECTIONS } from '../data/recipes';
import { playClick } from '../audio/soundEffects';
import { X, Sparkles } from 'lucide-react';

const DIET_FILTERS = [
  { id: 'all', label: 'All Diets', icon: '✨' },
  { id: 'veg', label: 'Vegetarian', icon: '🌱' },
  { id: 'egg', label: 'Contains Egg', icon: '🥚' },
  { id: 'non-veg', label: 'Non-Veg', icon: '🍗' },
];

export default function FilterBar({
  selectedDiet,
  onSelectDiet,
  selectedSection,
  onSelectSection,
  matchCount,
  totalCount,
}) {
  const isFiltered = selectedDiet !== 'all' || selectedSection !== 'all';

  return (
    <div className="bg-[#E9DDC7]/35 border-b border-[#211C32]/10 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Diet Filters Group */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#477E85] mr-1 hidden sm:inline">
            Diet:
          </span>
          {DIET_FILTERS.map((d) => {
            const isActive = selectedDiet === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  playClick();
                  onSelectDiet(d.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#211C32] text-[#FFFDF8] border-[#211C32] font-semibold shadow-xs'
                    : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/12 hover:bg-[#E9DDC7]'
                }`}
                aria-pressed={isActive}
              >
                <span>{d.icon}</span>
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Meal Chapter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#477E85] mr-1 hidden lg:inline">
            Chapter:
          </span>
          {MEAL_SECTIONS.map((sec) => {
            const isActive = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  playClick();
                  onSelectSection(sec.id);
                }}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#70C5D0] text-[#211C32] border-[#211C32]/20 font-semibold shadow-xs'
                    : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/12 hover:bg-[#E9DDC7]'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Match Count Indicator & Clear Button */}
        <div className="flex items-center gap-2 self-end md:self-center text-xs font-mono text-[#477E85] whitespace-nowrap">
          <span className="bg-[#FFFDF8] px-2.5 py-1 rounded-md border border-[#211C32]/10 font-semibold text-[#211C32]">
            {matchCount} of {totalCount} recipes
          </span>
          {isFiltered && (
            <button
              onClick={() => {
                playClick();
                onSelectDiet('all');
                onSelectSection('all');
              }}
              className="text-[#211C32] hover:text-red-700 underline text-xs flex items-center gap-0.5 cursor-pointer font-sans"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
