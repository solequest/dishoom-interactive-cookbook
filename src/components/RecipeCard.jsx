import React from 'react';
import { Bookmark, BookmarkCheck, Box, Clock, Users, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playCollect } from '../audio/soundEffects';

export default function RecipeCard({
  recipe,
  isCollected,
  onToggleCollect,
  onOpenAr,
  onOpenDrawer,
}) {
  const handleCollect = (e) => {
    e.stopPropagation();
    if (!isCollected) {
      playCollect();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#70C5D0', '#E9B49F', '#477E85', '#211C32'],
      });
    } else {
      playClick();
    }
    onToggleCollect(recipe.id);
  };

  const getDietBadge = (diet) => {
    switch (diet) {
      case 'veg':
        return { label: 'Vegetarian', icon: '🌱', badgeClass: 'bg-[#70C5D0]/20 text-[#211C32] border-[#70C5D0]/40' };
      case 'egg':
        return { label: 'Contains Egg', icon: '🥚', badgeClass: 'bg-[#E9B49F]/30 text-[#211C32] border-[#E9B49F]' };
      case 'non-veg':
        return { label: 'Non-Veg', icon: '🍗', badgeClass: 'bg-[#96775D]/20 text-[#211C32] border-[#96775D]/40' };
      default:
        return { label: diet, icon: '🍽️', badgeClass: 'bg-[#E9DDC7] text-[#211C32]' };
    }
  };

  const dietBadge = getDietBadge(recipe.diet);

  return (
    <article 
      onClick={() => onOpenDrawer && onOpenDrawer(recipe)}
      className="paper-grain-card rounded-xl border border-[#211C32]/12 editorial-shadow p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group cursor-pointer"
    >
      {/* Top Banner Accent Stripe */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: recipe.colorAccent || '#70C5D0' }}
      />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Diet Badge */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full border ${dietBadge.badgeClass}`}>
              <span>{dietBadge.icon}</span>
              <span>{dietBadge.label}</span>
            </span>

            {/* Time of Day */}
            <span className="text-[10.5px] font-mono font-medium px-2 py-0.5 rounded bg-[#E9DDC7]/60 text-[#477E85]">
              {recipe.timeOfDay}
            </span>
          </div>

          {/* Book Page Reference */}
          <span 
            className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#211C32] text-[#FFFDF8]"
            title="Referenced in the Dishoom Cookbook"
          >
            p. {recipe.bookPage}
          </span>
        </div>

        {/* Recipe Title in Fraunces */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-fraunces text-xl font-bold text-[#211C32] tracking-tight group-hover:text-[#477E85] transition-colors leading-snug">
            {recipe.name}
          </h3>
          <span className="text-xl shrink-0 opacity-90">{recipe.heroEmoji || '🍽️'}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs font-sans leading-relaxed text-[#211C32]/85 mb-3 line-clamp-3">
          {recipe.shortDescription}
        </p>

        {/* Metadata Strip */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#477E85] mb-3 pb-3 border-b border-[#211C32]/8">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {recipe.cookTime || '15m'}
          </span>
          <span>•</span>
          <span>{recipe.difficulty || 'Easy'}</span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
        {/* AR Dish Viewer Button */}
        {recipe.hasArModel ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAr(recipe.id);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-sans font-semibold bg-[#70C5D0]/30 hover:bg-[#70C5D0] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer tactile-btn"
            title="Inspect 3D spatial model & AR"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D AR</span>
          </button>
        ) : (
          <span className="text-[10.5px] font-mono text-[#477E85]/70">
            Dishoom Lookbook
          </span>
        )}

        {/* Bookmark / Collect Button */}
        <button
          onClick={handleCollect}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-semibold border transition-all cursor-pointer shadow-xs tactile-btn ${
            isCollected
              ? 'bg-[#211C32] text-[#FFFDF8] border-[#211C32]'
              : 'bg-[#E9B49F] hover:bg-[#E9B49F]/80 text-[#211C32] border-[#211C32]/15'
          }`}
          title={isCollected ? "Saved in personal cookbook" : "Save to My Cookbook"}
        >
          {isCollected ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-[#70C5D0]" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Card</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
