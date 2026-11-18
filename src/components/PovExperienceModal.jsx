import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  X, 
  ChefHat, 
  Utensils, 
  Flame, 
  Wine, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  BookOpen,
  Volume2
} from 'lucide-react';
import { playClick, playSizzle, playBell, playCollect } from '../audio/soundEffects';
import { getCulinaryStory } from '../data/culinaryStories';

export default function PovExperienceModal({
  isOpen,
  onClose,
  initialPov = 'cook', // 'cook' | 'waiter' | 'customer'
  dish,
  isCollected,
  onToggleCollect,
  onOpenFullRecipe
}) {
  const [currentPov, setCurrentPov] = useState(initialPov);
  const [cookStageIndex, setCookStageIndex] = useState(0);
  const [isSimmering, setIsSimmering] = useState(false);
  const [hasTasted, setHasTasted] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (initialPov) {
      setCurrentPov(initialPov);
    }
  }, [initialPov, isOpen]);

  // Mini 3D interactive stage for the kitchen/cook's hearth
  useEffect(() => {
    if (!isOpen || !canvasRef.current || currentPov !== 'cook') return;

    const container = canvasRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0d06); // Dark hearth atmosphere

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 3.8);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // Warm hearth fire lighting
    const fireLight = new THREE.PointLight(0xff7722, 3.5, 8);
    fireLight.position.set(0, 0.5, 0);
    scene.add(fireLight);

    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambientLight);

    const topRimLight = new THREE.DirectionalLight(0xd4a750, 1.2);
    topRimLight.position.set(2, 4, 2);
    scene.add(topRimLight);

    // Kitchen Counter Base (Dark Slate)
    const counterGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 32);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x221c1a, roughness: 0.8 });
    const counterMesh = new THREE.Mesh(counterGeo, counterMat);
    counterMesh.position.y = -0.1;
    scene.add(counterMesh);

    // Copper / Cast Iron Degchi Pot
    const potGeo = new THREE.CylinderGeometry(0.7, 0.55, 0.65, 32);
    const potMat = new THREE.MeshStandardMaterial({ 
      color: 0xb85d26, 
      roughness: 0.35, 
      metalness: 0.7 
    });
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.y = 0.3;
    scene.add(potMesh);

    // Pot Rim
    const rimGeo = new THREE.TorusGeometry(0.7, 0.04, 16, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4a750, metalness: 0.8, roughness: 0.3 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.62;
    scene.add(rimMesh);

    // Simmering Curry/Dish Liquid Surface inside the Pot
    const sauceGeo = new THREE.CircleGeometry(0.66, 32);
    const sauceMat = new THREE.MeshStandardMaterial({ 
      color: dish?.colorAccent === '#477E85' ? 0x241711 : 0xb83a1b, 
      roughness: 0.25 
    });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.rotation.x = -Math.PI / 2;
    sauceMesh.position.y = 0.55;
    scene.add(sauceMesh);

    // Steam particles rising from the pot
    const particleCount = 28;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = 0.6 + Math.random() * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.35,
    });
    const steamPoints = new THREE.Points(particlesGeo, particleMat);
    scene.add(steamPoints);

    // Brass Masala Spice Dabba on the side
    const spiceBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.16, 24),
      new THREE.MeshStandardMaterial({ color: 0xd4a750, metalness: 0.85, roughness: 0.3 })
    );
    spiceBox.position.set(1.0, 0.08, 0.4);
    scene.add(spiceBox);

    // Animation Loop
    let animId;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.02;

      // Pulse fire glow
      fireLight.intensity = 3.0 + Math.sin(time * 3) * 0.6;

      // Rise steam particles
      const pos = particlesGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.008;
        pos[i * 3] += Math.sin(time + i) * 0.002;
        if (pos[i * 3 + 1] > 2.2) {
          pos[i * 3 + 1] = 0.6;
        }
      }
      particlesGeo.attributes.position.needsUpdate = true;

      // Gentle pot wobble when simmering
      if (isSimmering) {
        potMesh.position.y = 0.3 + Math.sin(time * 12) * 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isOpen, currentPov, isSimmering, dish]);

  if (!isOpen || !dish) return null;

  const story = getCulinaryStory(dish.id, dish.name);
  const stages = story.cookStages || [];
  const activeStage = stages[cookStageIndex] || stages[0];

  const handleSimmerTrigger = () => {
    playSizzle();
    setIsSimmering(true);
    setTimeout(() => setIsSimmering(false), 2000);
  };

  const handleTaste = () => {
    playClick();
    setHasTasted(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#0E0603]/88 backdrop-blur-lg animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#F5EBDD] text-[#211C32] rounded-2xl border-4 border-[#361E14] shadow-2xl overflow-hidden flex flex-col paper-texture max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Perspective Switcher Header */}
        <div className="bg-[#1C0E07] text-[#FFFDF8] px-4 sm:px-6 py-3 border-b border-[#D4A750]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{dish.heroEmoji || '🍛'}</span>
            <div>
              <h2 className="font-fraunces text-lg sm:text-xl font-bold text-[#E9DDC7] leading-tight">
                {dish.name}
              </h2>
              <span className="text-[10.5px] font-mono text-[#D4A750] uppercase tracking-wider">
                Multi-Perspective Culinary Experience
              </span>
            </div>
          </div>

          {/* POV Switcher Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#2B170E] border border-[#D4A750]/20">
            <button
              onClick={() => {
                playClick();
                setCurrentPov('cook');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPov === 'cook'
                  ? 'bg-[#C85226] text-[#FFFDF8] shadow-xs'
                  : 'text-[#E9DDC7]/70 hover:text-[#FFFDF8]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Cook's POV</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setCurrentPov('waiter');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPov === 'waiter'
                  ? 'bg-[#3CAFB8] text-[#211C32] shadow-xs font-bold'
                  : 'text-[#E9DDC7]/70 hover:text-[#FFFDF8]'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Waiter's POV</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setCurrentPov('customer');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPov === 'customer'
                  ? 'bg-[#D4A750] text-[#211C32] shadow-xs font-bold'
                  : 'text-[#E9DDC7]/70 hover:text-[#FFFDF8]'
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>Customer's POV</span>
            </button>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-[#FFFDF8]/20 text-[#E9DDC7] transition-colors cursor-pointer"
            aria-label="Close POV mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POV Content Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ======================================================== */}
          {/* 1. COOK'S POV (THE KITCHEN HEARTH & MASTERCLASS STEPS) */}
          {/* ======================================================== */}
          {currentPov === 'cook' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* 3D Kitchen Hearth Visualizer */}
              <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border-2 border-[#361E14] shadow-inner bg-[#1A0D06]">
                <div ref={canvasRef} className="w-full h-full" />

                {/* Overlay Badge */}
                <div className="absolute top-3 left-3 bg-[#120804]/80 backdrop-blur-md px-3 py-1 rounded-md border border-[#D4A750]/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Dishoom Hearth Kitchen • Clay Tandoor & Degchi</span>
                </div>

                {/* Sizzle Trigger Action */}
                <button
                  onClick={handleSimmerTrigger}
                  className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-lg bg-[#C85226] hover:bg-[#D45E30] text-[#FFFDF8] text-xs font-sans font-bold flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Stir Pot & Temper (Listen)</span>
                </button>
              </div>

              {/* Masterclass Step-by-Step Stepper */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-[#C85226]" />
                    <span className="font-fraunces text-base font-bold text-[#211C32]">
                      Executive Chef's Masterclass Stages
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#96775D]">
                    Stage {cookStageIndex + 1} of {stages.length}
                  </span>
                </div>

                {/* Step Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {stages.map((stg, idx) => (
                    <button
                      key={stg.stage}
                      onClick={() => {
                        playClick();
                        setCookStageIndex(idx);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        cookStageIndex === idx
                          ? 'bg-[#24130A] text-[#FFFDF8] border-[#C85226] shadow-xs'
                          : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/10 hover:bg-[#E9DDC7]'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10.5px] font-mono opacity-80 mb-0.5">
                        <span>{stg.icon}</span>
                        <span>Phase {stg.stage}</span>
                      </div>
                      <p className="font-fraunces text-xs font-bold truncate leading-tight">
                        {stg.title}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Detailed Stage Breakdown Card */}
                {activeStage && (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#FFFDF8] border border-[#211C32]/10 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#211C32]/8 pb-2">
                      <h4 className="font-fraunces text-lg font-bold text-[#C85226]">
                        {activeStage.title}
                      </h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {activeStage.heatLevel}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-[#211C32]/90 leading-relaxed">
                      {activeStage.description}
                    </p>

                    <div className="p-3 rounded-lg bg-[#EAE0D0] border border-[#211C32]/10 flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-[#C85226] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#211C32] font-mono">Head Chef's Secret Tip: </span>
                        <span className="text-[#211C32]/85 italic">{activeStage.chefTip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. WAITER'S POV (THE SERVICE PASS & HOSPITALITY WISDOM) */}
          {/* ======================================================== */}
          {currentPov === 'waiter' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Service Pass / Kitchen Order Ticket (KOT) */}
              <div className="p-5 rounded-2xl bg-[#FFFDF8] border-2 border-[#211C32]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#211C32]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#96775D] block">
                      Kitchen Order Ticket (KOT)
                    </span>
                    <h3 className="font-fraunces text-xl font-bold text-[#211C32]">
                      DISHOOM PERMIT ROOM SERVICE
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#477E85]">{story.kotNumber}</span>
                    <span className="block text-[10px] font-mono text-[#96775D]">Captain Sorabji • Floor A</span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono py-1">
                  <div>
                    <span className="text-[#96775D] block">Dish Ordered:</span>
                    <span className="font-bold text-[#211C32]">{dish.name}</span>
                  </div>
                  <div>
                    <span className="text-[#96775D] block">Dietary:</span>
                    <span className="font-bold text-[#211C32] uppercase">{dish.diet}</span>
                  </div>
                  <div>
                    <span className="text-[#96775D] block">Cookbook Page:</span>
                    <span className="font-bold text-[#211C32]">Page {dish.bookPage}</span>
                  </div>
                  <div>
                    <span className="text-[#96775D] block">Service Style:</span>
                    <span className="font-bold text-[#211C32]">Silver Thali Service</span>
                  </div>
                </div>

                {/* Waiter's Narrative */}
                <div className="p-4 rounded-xl bg-[#F5EBDD] border border-[#211C32]/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#477E85] font-fraunces font-bold text-sm">
                    <Utensils className="w-4 h-4" />
                    <span>Captain's Floor Instructions:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-[#211C32]/90 leading-relaxed">
                    "Ensure the silver cloche is lifted at the table before the guest. Pour the sauce with a slow, deliberate circle. In Irani cafés, hospitality is an act of communal warmth — we treat every guest not as a patron, but as an old friend returning from across the sea."
                  </p>
                </div>

                {/* Pairing & Etiquette Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#EAE0D0] border border-[#211C32]/10">
                    <div className="flex items-center gap-1.5 font-bold text-[#477E85] font-fraunces mb-1">
                      <Wine className="w-3.5 h-3.5" />
                      <span>Beverage & Wine Pairing</span>
                    </div>
                    <p className="text-[11.5px] font-sans text-[#211C32]/85">
                      {story.servicePairing}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EAE0D0] border border-[#211C32]/10">
                    <div className="flex items-center gap-1.5 font-bold text-[#96775D] font-fraunces mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Traditional Bombay Etiquette</span>
                    </div>
                    <p className="text-[11.5px] font-sans text-[#211C32]/85">
                      Eat with the tips of your fingers using warm flatbread as a scoop. Slurping hot chai from the saucer is not impolite — it cools the spiced tea to perfection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. CUSTOMER'S POV (THE DINING TABLE EXPERIENCE) */}
          {/* ======================================================== */}
          {currentPov === 'customer' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Tabletop Dining Card */}
              <div className="p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#211C32]/15 shadow-sm text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E9DDC7] border border-[#211C32]/20 text-5xl shadow-inner">
                  {dish.heroEmoji || '🍽️'}
                </div>

                <div>
                  <h3 className="font-fraunces text-2xl font-bold text-[#211C32]">
                    Plated for You at Table 4
                  </h3>
                  <p className="text-xs text-[#477E85] font-mono mt-0.5">
                    Served hot on vintage crockery beneath the revolving ceiling fans
                  </p>
                </div>

                <p className="max-w-xl mx-auto text-xs sm:text-sm font-sans text-[#211C32]/85 leading-relaxed italic">
                  "{dish.shortDescription}"
                </p>

                {/* Taste Interaction Button */}
                <div className="pt-2">
                  <button
                    onClick={handleTaste}
                    className="px-5 py-2.5 rounded-xl bg-[#211C32] hover:bg-[#3CAFB8] text-[#FFFDF8] hover:text-[#211C32] text-xs font-sans font-bold inline-flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95"
                  >
                    <span>🍴 Take a Taste / Bite</span>
                  </button>

                  {hasTasted && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans max-w-md mx-auto animate-in fade-in slide-in-from-top-1">
                      <span className="font-bold font-fraunces block mb-0.5">Sensory Flavor Explosion:</span>
                      {story.tastingNotes}
                    </div>
                  )}
                </div>

                {/* Sensory Flavor Chart */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-left">
                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#211C32]/10">
                    <span className="text-[10px] font-mono text-[#96775D] uppercase block">Aroma</span>
                    <span className="font-bold text-xs text-[#211C32]">Whole Toasted Spices</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#211C32]/10">
                    <span className="text-[10px] font-mono text-[#96775D] uppercase block">Heat Level</span>
                    <span className="font-bold text-xs text-[#211C32]">Balanced Warmth</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#211C32]/10">
                    <span className="text-[10px] font-mono text-[#96775D] uppercase block">Texture</span>
                    <span className="font-bold text-xs text-[#211C32]">Velvety & Tactile</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#211C32]/10">
                    <span className="text-[10px] font-mono text-[#96775D] uppercase block">Heritage</span>
                    <span className="font-bold text-xs text-[#211C32]">Bombay Irani Classic</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-[#EAE0D0] px-4 sm:px-6 py-3 border-t border-[#211C32]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Collected in Cookbook</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#477E85]" />
                  <span>Save to My Cookbook</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playClick();
                onOpenFullRecipe(dish);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#211C32] hover:bg-[#477E85] text-[#FFFDF8] text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Recipe Instructions</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono text-[#211C32]/75 hover:text-[#211C32] hover:underline cursor-pointer"
          >
            ← Return to 3D Café
          </button>
        </div>
      </div>
    </div>
  );
}

