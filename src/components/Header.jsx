import React from 'react';
import { BookOpen, List, Volume2, VolumeX, Compass, Info, Sparkles, Utensils, Box, Image as ImageIcon, Sun, Moon, Flame } from 'lucide-react';
import { playClick } from '../audio/soundEffects';

export default function Header({
  collectedCount,
  totalCount,
  onOpenCookbook,
  onOpenListView,
  onOpenStepInside,
  onOpenAbout,
  onOpenMenu,
  onOpenPov,
  isMuted,
  onToggleMute,
  activeSection,
  onResetSection,
  viewMode = '3d',
  onToggleViewMode,
  isNightMode = false,
  onToggleTimeMode,
}) {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${
      isNightMode 
        ? 'bg-[#180E08]/92 border-[#D4A750]/20 text-[#FFFDF8]' 
        : 'bg-[#F5EBDD]/92 border-[#211C32]/12 text-[#211C32]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
        {/* Brand Masthead */}
        <div 
          onClick={() => {
            playClick();
            onResetSection();
          }}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
          title="Return to full café view"
        >
          <div className="w-10 h-10 rounded-lg bg-[#E9DDC7] border border-[#211C32]/20 flex items-center justify-center text-xl shadow-xs group-hover:bg-[#70C5D0]/30 transition-colors">
            ☕
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-fraunces text-2xl sm:text-3xl font-bold tracking-tight leading-none ${
                isNightMode ? 'text-[#FFFDF8]' : 'text-[#211C32]'
              }`}>
                DISHOOM
              </span>
              <span className="text-[10px] font-mono tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#E9B49F]/35 border border-[#E9B49F] text-[#E9B49F] uppercase">
                Lookbook
              </span>
            </div>
            <span className={`text-[10.5px] font-mono font-medium tracking-wider uppercase mt-1 hidden sm:block ${
              isNightMode ? 'text-[#3CAFB8]' : 'text-[#477E85]'
            }`}>
              From Page to Plate — An Interactive Café Experience
            </span>
          </div>
        </div>

        {/* Primary Editorial Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 order-3 sm:order-2">
          {/* Explore (Café Scene) */}
          <button
            onClick={() => {
              playClick();
              onResetSection();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'all'
                ? (isNightMode ? 'bg-[#3CAFB8] text-[#211C32] font-bold shadow-xs' : 'bg-[#211C32] text-[#FFFDF8] shadow-xs')
                : (isNightMode ? 'text-[#FFFDF8] hover:bg-[#FFFDF8]/15' : 'text-[#211C32] hover:bg-[#E9DDC7]/60')
            }`}
          >
            <Utensils className="w-3.5 h-3.5 opacity-80" />
            <span>Explore Café</span>
          </button>

          {/* Recipe Index */}
          <button
            onClick={() => {
              playClick();
              onOpenListView();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isNightMode ? 'text-[#FFFDF8] hover:bg-[#FFFDF8]/15' : 'text-[#211C32] hover:bg-[#E9DDC7]/60'
            }`}
            title="Browse all 13 recipes in a clean editorial index"
          >
            <List className="w-3.5 h-3.5 opacity-80" />
            <span>Recipe Index</span>
          </button>

          {/* Table Menu */}
          <button
            onClick={() => {
              playClick();
              onOpenMenu && onOpenMenu();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isNightMode ? 'text-[#FFFDF8] hover:bg-[#FFFDF8]/15' : 'text-[#211C32] hover:bg-[#E9DDC7]/60'
            }`}
            title="Order from the physical café menu"
          >
            <span className="text-sm">📖</span>
            <span className="hidden md:inline">Table Menu</span>
          </button>

          {/* Culinary POVs */}
          <button
            onClick={() => {
              playClick();
              onOpenPov && onOpenPov('cook');
            }}
            className="px-3 py-1.5 rounded-md text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-[#C85226] text-[#FFFDF8] hover:bg-[#D45E30] shadow-xs"
            title="Experience Cook's POV, Waiter's POV, and Diner POV"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Cook's POV</span>
          </button>

          {/* My Cookbook with Badge */}
          <button
            onClick={() => {
              playClick();
              onOpenCookbook();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all cursor-pointer flex items-center gap-1.5 relative border ${
              isNightMode 
                ? 'text-[#FFFDF8] border-[#FFFDF8]/20 hover:bg-[#FFFDF8]/15' 
                : 'text-[#211C32] border-[#211C32]/10 hover:bg-[#E9B49F]/40'
            }`}
            title="Open your personal collected cookbook"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3CAFB8]" />
            <span>My Cookbook</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#3CAFB8] text-[#211C32] text-[10px] font-mono font-bold">
              {collectedCount}/{totalCount}
            </span>
          </button>
        </nav>

        {/* Utilities & Toggles */}
        <div className="flex items-center gap-2 order-2 sm:order-3">
          {/* Day / Night Mode Toggle */}
          <button
            onClick={() => {
              playClick();
              onToggleTimeMode && onToggleTimeMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-semibold border shadow-xs cursor-pointer tactile-btn transition-colors ${
              isNightMode
                ? 'bg-[#D4A750] text-[#211C32] border-[#D4A750]'
                : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/15 hover:bg-[#E9DDC7]'
            }`}
            title={`Switch to ${isNightMode ? 'Day Mode (Natural Sunbeams)' : 'Night Mode (Atmospheric Bar Glow)'}`}
          >
            {isNightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#211C32]" />
                <span className="hidden sm:inline">Night Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Day Mode</span>
              </>
            )}
          </button>

          {/* 3D vs 2D Switcher */}
          <button
            onClick={() => {
              playClick();
              onToggleViewMode && onToggleViewMode();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-semibold bg-[#3CAFB8] hover:bg-[#349DAA] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer tactile-btn"
            title={`Switch to ${viewMode === '3d' ? '2D Illustrated View' : '3D Café View'}`}
          >
            {viewMode === '3d' ? (
              <>
                <Box className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D Active</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">2D View</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isNightMode
                ? 'bg-[#FFFDF8]/10 hover:bg-[#FFFDF8]/20 border-[#FFFDF8]/20 text-[#FFFDF8]'
                : 'bg-[#E9DDC7]/50 hover:bg-[#E9DDC7] border-[#211C32]/10 text-[#211C32]'
            }`}
            title={isMuted ? "Unmute audio effects" : "Mute audio effects"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 opacity-50" />
            ) : (
              <Volume2 className="w-4 h-4 text-current" />
            )}
          </button>

          {/* Information & Credits */}
          <button
            onClick={() => {
              playClick();
              onOpenAbout();
            }}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isNightMode
                ? 'bg-[#FFFDF8]/10 hover:bg-[#FFFDF8]/20 border-[#FFFDF8]/20 text-[#FFFDF8]'
                : 'bg-[#E9DDC7]/50 hover:bg-[#E9DDC7] border-[#211C32]/10 text-[#211C32]'
            }`}
            title="Project attribution, copyright & credits"
            aria-label="About this project"
          >
            <Info className="w-4 h-4 text-current" />
          </button>
        </div>
      </div>
    </header>
  );
}
