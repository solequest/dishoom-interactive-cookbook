import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Cafe3DScene from './components/Cafe3DScene';
import CafeScene from './components/CafeScene';
import ZoneDrawer from './components/ZoneDrawer';
import CookbookModal from './components/CookbookModal';
import ListViewModal from './components/ListViewModal';
import StepInsideModal from './components/StepInsideModal';
import ArViewerModal from './components/ArViewerModal';
import AboutModal from './components/AboutModal';
import DiningMenuModal from './components/DiningMenuModal';
import WaiterDialogueModal from './components/WaiterDialogueModal';
import PovExperienceModal from './components/PovExperienceModal';

import { RECIPES } from './data/recipes';
import { HOTSPOTS } from './data/hotspots';
import { isAudioMuted, setAudioMuted, playClick, playCollect, playDrawerOpen } from './audio/soundEffects';

const STORAGE_KEY = 'dishoom_collected_recipes_v2';
const TIME_MODE_KEY = 'dishoom_time_mode';

export default function App() {
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // Default to 3D
  const [isNightMode, setIsNightMode] = useState(() => {
    try {
      return localStorage.getItem(TIME_MODE_KEY) === 'night';
    } catch {
      return false;
    }
  });

  // Modals state
  const [isCookbookOpen, setIsCookbookOpen] = useState(false);
  const [isListViewOpen, setIsListViewOpen] = useState(false);
  const [isStepInsideOpen, setIsStepInsideOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [arModalDishId, setArModalDishId] = useState(null);

  // Culinary Game & Perspectives state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWaiterDialogueOpen, setIsWaiterDialogueOpen] = useState(false);
  const [isPovModalOpen, setIsPovModalOpen] = useState(false);
  const [activePov, setActivePov] = useState('cook'); // 'cook' | 'waiter' | 'customer'
  const [activeDish, setActiveDish] = useState(RECIPES[2]); // Default House Black Daal
  const [orderedDish, setOrderedDish] = useState(null);
  const [serviceLocation, setServiceLocation] = useState('table'); // 'table' | 'bar'

  // Audio State
  const [isMuted, setIsMutedState] = useState(false);

  // Collected recipes saved to localStorage
  const [collectedRecipeIds, setCollectedRecipeIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['masala-chai']; // starter gift card
    } catch {
      return ['masala-chai'];
    }
  });

  // Persist collection
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectedRecipeIds));
    } catch (err) {
      console.warn("Storage error:", err);
    }
  }, [collectedRecipeIds]);

  // Persist time mode
  useEffect(() => {
    try {
      localStorage.setItem(TIME_MODE_KEY, isNightMode ? 'night' : 'day');
    } catch (err) {}
  }, [isNightMode]);

  const handleToggleCollect = (recipeId) => {
    setCollectedRecipeIds((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const handleClearCollection = () => {
    setCollectedRecipeIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setAudioMuted(next);
    setIsMutedState(next);
    if (!next) playClick();
  };

  const handleToggleTimeMode = () => {
    setIsNightMode((prev) => !prev);
  };

  // Open drawer for a specific hotspot
  const handleSelectHotspot = (hotspot) => {
    if (hotspot.id === 'cookbook-wall') {
      setIsCookbookOpen(true);
      return;
    }
    setActiveHotspot(hotspot);
    setSelectedSection(hotspot.sectionId || 'all');
    setIsDrawerOpen(true);
  };

  // Open drawer directly for a specific recipe
  const handleOpenRecipeDrawer = (recipe) => {
    const matchHotspot = HOTSPOTS.find((h) => h.id === recipe.hotspotId);
    if (matchHotspot) {
      setActiveHotspot(matchHotspot);
      setSelectedSection(recipe.mealSection || 'all');
      setIsDrawerOpen(true);
    }
  };

  // When meal section chip is selected from the filter bar
  const handleSelectSectionFromFilter = (sectionId) => {
    setSelectedSection(sectionId);
    if (sectionId === 'all') {
      setActiveHotspot(null);
      setIsDrawerOpen(false);
    } else {
      const match = HOTSPOTS.find((h) => h.sectionId === sectionId);
      if (match) {
        setActiveHotspot(match);
        setIsDrawerOpen(true);
      }
    }
  };

  // Filtered recipes count
  const matchingRecipes = RECIPES.filter((r) => {
    const matchesDiet = selectedDiet === 'all' || r.diet === selectedDiet;
    const matchesSection = selectedSection === 'all' || r.mealSection === selectedSection;
    return matchesDiet && matchesSection;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans paper-texture transition-colors duration-500 ${
      isNightMode ? 'bg-[#150B06] text-[#FFFDF8]' : 'bg-[#F5EBDD] text-[#211C32]'
    }`}>
      {/* 1. EDITORIAL HEADER */}
      <Header
        collectedCount={collectedRecipeIds.length}
        totalCount={RECIPES.length}
        onOpenCookbook={() => setIsCookbookOpen(true)}
        onOpenListView={() => setIsListViewOpen(true)}
        onOpenStepInside={() => setIsStepInsideOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenPov={(pov) => {
          setActivePov(pov || 'cook');
          setActiveDish(activeDish || RECIPES[2]);
          setIsPovModalOpen(true);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        activeSection={selectedSection}
        onResetSection={() => {
          setSelectedDiet('all');
          setSelectedSection('all');
          setActiveHotspot(null);
          setIsDrawerOpen(false);
        }}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === '3d' ? '2d' : '3d'))}
        isNightMode={isNightMode}
        onToggleTimeMode={handleToggleTimeMode}
      />

      {/* 2. REFINED FILTER BAR */}
      <FilterBar
        selectedDiet={selectedDiet}
        onSelectDiet={(diet) => {
          setSelectedDiet(diet);
        }}
        selectedSection={selectedSection}
        onSelectSection={handleSelectSectionFromFilter}
        matchCount={matchingRecipes.length}
        totalCount={RECIPES.length}
      />

      {/* 3. MAIN CAFÉ STAGE (3D ATMOSPHERIC CAFÉ BY DEFAULT, OR 2D ILLUSTRATION) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-2 flex flex-col items-center justify-center">
        {viewMode === '3d' ? (
          <Cafe3DScene
            activeHotspot={activeHotspot}
            onSelectHotspot={handleSelectHotspot}
            selectedDiet={selectedDiet}
            recipes={RECIPES}
            isNightMode={isNightMode}
            onToggleTimeMode={handleToggleTimeMode}
            onOpenMenu={() => setIsMenuOpen(true)}
            onSpeakWaiter={() => {
              setActiveDish(activeDish || RECIPES[2]);
              setIsWaiterDialogueOpen(true);
            }}
            onOpenPov={(pov) => {
              setActivePov(pov || 'cook');
              setActiveDish(activeDish || RECIPES[2]);
              setIsPovModalOpen(true);
            }}
            orderedDish={orderedDish}
            onFinishServing={(dish, loc) => {
              setActiveDish(dish);
              setServiceLocation(loc || 'table');
              setOrderedDish(null);
              setIsWaiterDialogueOpen(true);
            }}
          />
        ) : (
          <CafeScene
            activeHotspot={activeHotspot}
            onSelectHotspot={handleSelectHotspot}
            selectedDiet={selectedDiet}
            recipes={RECIPES}
          />
        )}
      </main>

      {/* 4. EDITORIAL FOOTER */}
      <footer className={`border-t px-6 py-4 text-center text-xs font-sans transition-colors duration-500 ${
        isNightMode ? 'border-[#D4A750]/20 bg-[#120904] text-[#FFFDF8]/75' : 'border-[#211C32]/10 bg-[#E9DDC7]/40 text-[#211C32]/80'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p>
            An interactive culinary lookbook inspired by <em>Dishoom: From Bombay with Love</em>.
          </p>
          <div className="flex items-center gap-3 font-medium">
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Academic Attribution & Rights
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsListViewOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Recipe Index (13 Dishes)
            </button>
          </div>
        </div>
      </footer>

      {/* 5. EDITORIAL RECIPE ZONE DRAWER */}
      <ZoneDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeHotspot={activeHotspot}
        recipes={RECIPES}
        selectedDiet={selectedDiet}
        collectedRecipeIds={collectedRecipeIds}
        onToggleCollect={handleToggleCollect}
        onOpenAr={(dishId) => setArModalDishId(dishId)}
        onOpenCookbook={() => {
          setIsDrawerOpen(false);
          setIsCookbookOpen(true);
        }}
      />

      {/* 6. MY COOKBOOK ALBUM MODAL */}
      <CookbookModal
        isOpen={isCookbookOpen}
        onClose={() => setIsCookbookOpen(false)}
        recipes={RECIPES}
        collectedRecipeIds={collectedRecipeIds}
        onToggleCollect={handleToggleCollect}
        onClearCollection={handleClearCollection}
        onOpenAr={(dishId) => setArModalDishId(dishId)}
        onOpenDrawer={handleOpenRecipeDrawer}
      />

      {/* 7. ACCESSIBLE RECIPE INDEX (LIST VIEW) */}
      <ListViewModal
        isOpen={isListViewOpen}
        onClose={() => setIsListViewOpen(false)}
        recipes={RECIPES}
        collectedRecipeIds={collectedRecipeIds}
        onToggleCollect={handleToggleCollect}
        onOpenAr={(dishId) => setArModalDishId(dishId)}
        onOpenDrawer={handleOpenRecipeDrawer}
        selectedDiet={selectedDiet}
        onSelectDiet={setSelectedDiet}
      />

      {/* 8. 3D STEP INSIDE CAFÉ MODAL */}
      <StepInsideModal
        isOpen={isStepInsideOpen}
        onClose={() => setIsStepInsideOpen(false)}
      />

      {/* 9. TABLETOP AR & 3D DISH VIEWER MODAL */}
      <ArViewerModal
        isOpen={!!arModalDishId}
        onClose={() => setArModalDishId(null)}
        initialDishId={arModalDishId || 'masala-chai'}
      />

      {/* 10. ABOUT & CREDITS MODAL */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* 11. TABLE DINING MENU MODAL (CUSTOMER ORDERING) */}
      <DiningMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        recipes={RECIPES}
        activeSection={selectedSection}
        onSelectSection={handleSelectSectionFromFilter}
        onOrderDish={(dish) => {
          setActiveDish(dish);
          setOrderedDish(dish);
          setIsMenuOpen(false);
        }}
      />

      {/* 12. WAITER CAPTAIN DIALOGUE MODAL */}
      <WaiterDialogueModal
        isOpen={isWaiterDialogueOpen}
        onClose={() => setIsWaiterDialogueOpen(false)}
        dish={activeDish}
        serviceLocation={serviceLocation}
        isCollected={collectedRecipeIds.includes(activeDish?.id)}
        onToggleCollect={handleToggleCollect}
        onOpenFullRecipe={(dish) => {
          setIsWaiterDialogueOpen(false);
          handleOpenRecipeDrawer(dish);
        }}
        onOpenCooksPov={(dish) => {
          setActiveDish(dish);
          setActivePov('cook');
          setIsWaiterDialogueOpen(false);
          setIsPovModalOpen(true);
        }}
        onOpenWaitersPov={(dish) => {
          setActiveDish(dish);
          setActivePov('waiter');
          setIsWaiterDialogueOpen(false);
          setIsPovModalOpen(true);
        }}
      />

      {/* 13. MULTI-PERSPECTIVE POV EXPERIENCE MODAL (COOK, WAITER, CUSTOMER) */}
      <PovExperienceModal
        isOpen={isPovModalOpen}
        onClose={() => setIsPovModalOpen(false)}
        initialPov={activePov}
        dish={activeDish}
        isCollected={collectedRecipeIds.includes(activeDish?.id)}
        onToggleCollect={handleToggleCollect}
        onOpenFullRecipe={(dish) => {
          setIsPovModalOpen(false);
          handleOpenRecipeDrawer(dish);
        }}
      />
    </div>
  );
}
