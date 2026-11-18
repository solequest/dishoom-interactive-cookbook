import React from 'react';
import { X, BookOpen, Lock, Sparkles, CheckCircle2, Trash2, ArrowLeft, Utensils } from 'lucide-react';
import { playClick } from '../audio/soundEffects';

export default function CookbookModal({
  isOpen,
  onClose,
  recipes,
  collectedRecipeIds,
  onToggleCollect,
  onClearCollection,
  onOpenAr,
  onOpenDrawer,
}) {
  if (!isOpen) return null;

  const total = recipes.length;
  const collectedCount = collectedRecipeIds.length;
  const progressPct = Math.round((collectedCount / total) * 100);

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
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFDF8] rounded-2xl border border-[#211C32]/15 shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Editorial Header */}
        <div className="bg-[#F5EBDD] border-b border-[#211C32]/12 px-6 py-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-xl bg-[#E9DDC7] border border-[#211C32]/15 flex items-center justify-center text-2xl shadow-xs">
              📖
            </span>
            <div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#477E85] uppercase block">
                Personal Lookbook Collection
              </span>
              <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-[#211C32] tracking-tight leading-none">
                My Dishoom Cookbook
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer transition-colors"
            aria-label="Close cookbook"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-[#E9DDC7]/40 px-6 py-3.5 border-b border-[#211C32]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-xs font-sans font-medium text-[#211C32] mb-1.5">
              <span>Cookbook Progress</span>
              <span className="font-mono font-semibold">{collectedCount} of {total} recipes discovered ({progressPct}%)</span>
            </div>
            <div className="w-full h-2.5 bg-[#FFFDF8] rounded-full border border-[#211C32]/15 overflow-hidden">
              <div 
                className="h-full bg-[#70C5D0] transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {collectedCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Reset your collected recipes album?")) {
                  playClick();
                  onClearCollection();
                }
              }}
              className="text-xs font-sans text-[#211C32]/70 hover:text-red-700 flex items-center gap-1.5 underline cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Collection</span>
            </button>
          )}
        </div>

        {/* Collection Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F5EBDD]/40">
          {collectedCount === 0 ? (
            /* Elegant Empty State */
            <div className="p-12 text-center bg-[#FFFDF8] rounded-2xl border border-[#211C32]/12 editorial-shadow max-w-md mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-[#E9DDC7] border border-[#211C32]/15 flex items-center justify-center text-3xl mx-auto mb-3 shadow-xs">
                ☕
              </div>
              <h3 className="font-fraunces text-2xl font-bold text-[#211C32] mb-1.5">
                Your Cookbook is Empty
              </h3>
              <p className="text-xs font-sans text-[#211C32]/80 leading-relaxed mb-5">
                Explore the café illustration and tap stations like the Chai kettle, Tandoor stove, or Bakery shelf to collect recipes for your album.
              </p>
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#70C5D0] hover:bg-[#70C5D0]/80 text-[#211C32] font-sans font-semibold text-xs border border-[#211C32]/15 shadow-xs cursor-pointer tactile-btn"
              >
                <Utensils className="w-4 h-4" />
                <span>Start Exploring Café</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => {
                const isUnlocked = collectedRecipeIds.includes(recipe.id);

                if (isUnlocked) {
                  return (
                    <div 
                      key={recipe.id}
                      onClick={() => {
                        onClose();
                        if (onOpenDrawer) onOpenDrawer(recipe);
                      }}
                      className="paper-grain-card rounded-xl border border-[#211C32]/12 editorial-shadow p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#70C5D0]" />

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-sans font-semibold mb-2 pt-1">
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Saved
                          </span>
                          <span className="bg-[#211C32] text-[#FFFDF8] px-2 py-0.5 rounded text-[10px] font-mono">
                            p. {recipe.bookPage}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h4 className="font-fraunces text-lg font-bold text-[#211C32] leading-snug group-hover:text-[#477E85] transition-colors">
                            {recipe.name}
                          </h4>
                          <span className="text-xl shrink-0">{recipe.heroEmoji || '🍽️'}</span>
                        </div>

                        <p className="text-xs font-sans text-[#211C32]/80 leading-relaxed mb-3 line-clamp-2">
                          {recipe.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#211C32]/8 flex items-center justify-between gap-1 text-[11px] font-sans">
                        <span className="text-[#477E85] font-mono font-medium">
                          {recipe.cookTime || '15 mins'}
                        </span>
                        {recipe.hasArModel && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onOpenAr(recipe.id);
                            }}
                            className="px-2 py-0.5 rounded bg-[#70C5D0]/30 hover:bg-[#70C5D0] text-[#211C32] font-semibold border border-[#211C32]/12 text-[10.5px] cursor-pointer"
                          >
                            3D AR
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                // Locked mystery slot
                return (
                  <div 
                    key={recipe.id}
                    className="rounded-xl border border-dashed border-[#211C32]/25 bg-[#E9DDC7]/30 p-4 flex flex-col items-center justify-center text-center min-h-[170px] select-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFFDF8] border border-[#211C32]/15 flex items-center justify-center text-sm mb-2 text-[#477E85] shadow-xs">
                      <Lock className="w-4 h-4 text-[#477E85]" />
                    </div>
                    <h4 className="font-fraunces text-base font-bold text-[#211C32]/45 mb-0.5">
                      Locked Recipe
                    </h4>
                    <p className="text-[10.5px] font-sans text-[#477E85] max-w-[170px]">
                      Explore the café stations to discover and unlock
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F5EBDD] border-t border-[#211C32]/12 px-6 py-3 flex items-center justify-between text-xs font-sans text-[#211C32]/80 shrink-0">
          <span>Collected cards are remembered in this browser for your next visit.</span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="font-medium underline hover:text-[#211C32] cursor-pointer"
          >
            Back to Café
          </button>
        </div>
      </div>
    </div>
  );
}
