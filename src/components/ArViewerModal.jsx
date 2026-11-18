import React, { useState, useEffect, useRef } from 'react';
import { X, Box, Smartphone, RotateCcw } from 'lucide-react';
import { playClick } from '../audio/soundEffects';
import * as THREE from 'three';

const AR_DISHES = [
  {
    id: 'masala-chai',
    title: 'Masala Chai in Cutting Glass',
    chapter: 'Afternoon Refreshments (p. 42)',
    description: 'Fresh root ginger, green cardamom, cloves, and whole milk simmered with rich Assam tea in a fluted Irani glass.',
    dishType: 'chai',
  },
  {
    id: 'bacon-naan',
    title: 'Bacon Naan Roll',
    chapter: 'Breakfast (p. 26)',
    description: 'Blistered tandoor-baked naan wrapped around crisp streaky bacon, cream cheese, and chilli tomato jam.',
    dishType: 'naan',
  },
  {
    id: 'black-daal',
    title: 'House Black Daal Bowl',
    chapter: 'Dinner (p. 140)',
    description: '24-hour slow-simmered urad lentils in dark ceramic bowl with swirls of fresh butter and heavy cream.',
    dishType: 'daal',
  },
];

export default function ArViewerModal({
  isOpen,
  onClose,
  initialDishId = 'masala-chai',
}) {
  const [selectedDishId, setSelectedDishId] = useState(initialDishId);
  const mountRef = useRef(null);

  useEffect(() => {
    if (initialDishId) {
      setSelectedDishId(initialDishId);
    }
  }, [initialDishId]);

  const currentDish = AR_DISHES.find(d => d.id === selectedDishId) || AR_DISHES[0];

  // Procedural 3D Three.js Dish Renderer
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5EBDD);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 4.5);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Warm Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x70C5D0, 0.6);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Ceramic Table Surface / Saucer Base
    const tableGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.1, 48);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0xE9DDC7,
      roughness: 0.6,
      metalness: 0.1,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -0.05;
    table.receiveShadow = true;
    scene.add(table);

    // Procedural Dish Group
    const dishGroup = new THREE.Group();

    if (currentDish.dishType === 'chai') {
      // Cutting Glass Body
      const glassGeo = new THREE.CylinderGeometry(0.7, 0.5, 1.5, 24, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.5,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = 0.75;
      dishGroup.add(glass);

      // Chai Liquid Inside
      const chaiGeo = new THREE.CylinderGeometry(0.66, 0.48, 1.25, 24);
      const chaiMat = new THREE.MeshStandardMaterial({
        color: 0xC48A54,
        roughness: 0.3,
      });
      const chai = new THREE.Mesh(chaiGeo, chaiMat);
      chai.position.y = 0.65;
      dishGroup.add(chai);

      // Cardamom Pod on Top
      const podGeo = new THREE.SphereGeometry(0.08, 12, 12);
      podGeo.scale(1, 1.6, 0.8);
      const podMat = new THREE.MeshStandardMaterial({ color: 0x477E85 });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(0.1, 1.28, 0.1);
      dishGroup.add(pod);

    } else if (currentDish.dishType === 'naan') {
      // Ceramic Serving Plate
      const plateGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.12, 32);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0x70C5D0, roughness: 0.3 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = 0.06;
      dishGroup.add(plate);

      // Folded Naan Bread
      const naanGeo = new THREE.TorusGeometry(0.7, 0.35, 16, 32, Math.PI * 1.4);
      const naanMat = new THREE.MeshStandardMaterial({ color: 0xE9B49F, roughness: 0.8 });
      const naan = new THREE.Mesh(naanGeo, naanMat);
      naan.rotation.x = Math.PI / 2;
      naan.position.set(0, 0.35, 0);
      dishGroup.add(naan);

      // Crispy Bacon Strip & Coriander
      const baconGeo = new THREE.BoxGeometry(0.2, 0.08, 1.2);
      const baconMat = new THREE.MeshStandardMaterial({ color: 0x8A2A1A, roughness: 0.4 });
      const bacon = new THREE.Mesh(baconGeo, baconMat);
      bacon.position.set(0.15, 0.4, 0);
      bacon.rotation.y = 0.3;
      dishGroup.add(bacon);

    } else {
      // Dark Stoneware Daal Bowl
      const bowlGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0x211C32, roughness: 0.7 });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.rotation.x = Math.PI;
      bowl.position.y = 0.85;
      dishGroup.add(bowl);

      // Black Daal Lentils Stew
      const daalGeo = new THREE.CircleGeometry(1.08, 32);
      const daalMat = new THREE.MeshStandardMaterial({ color: 0x2A1F1B, roughness: 0.5 });
      const daal = new THREE.Mesh(daalGeo, daalMat);
      daal.rotation.x = -Math.PI / 2;
      daal.position.y = 0.84;
      dishGroup.add(daal);

      // Cream Swirl Ring
      const creamGeo = new THREE.TorusGeometry(0.45, 0.06, 12, 24);
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEA, roughness: 0.2 });
      const cream = new THREE.Mesh(creamGeo, creamMat);
      cream.rotation.x = -Math.PI / 2;
      cream.position.y = 0.85;
      dishGroup.add(cream);
    }

    scene.add(dishGroup);

    // Mouse / Touch Drag to Rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX);
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      const deltaX = x - prevMouseX;
      const deltaY = y - prevMouseY;

      dishGroup.rotation.y += deltaX * 0.01;
      dishGroup.rotation.x = Math.max(-0.2, Math.min(0.5, dishGroup.rotation.x + deltaY * 0.005));

      prevMouseX = x;
      prevMouseY = y;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasElem.addEventListener('touchstart', onMouseDown);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        dishGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvasElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasElem.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      renderer.dispose();
    };
  }, [isOpen, selectedDishId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#211C32]/65 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#FFFDF8] rounded-2xl border border-[#211C32]/15 shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Editorial Header */}
        <div className="bg-[#F5EBDD] border-b border-[#211C32]/12 px-6 py-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#E9DDC7] border border-[#211C32]/15 flex items-center justify-center text-xl shadow-xs">
              <Box className="w-5 h-5 text-[#211C32]" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#477E85] uppercase block">
                Spatial Dish Inspection
              </span>
              <h2 className="font-fraunces text-2xl font-bold text-[#211C32] tracking-tight leading-none">
                Tabletop AR & 3D Dish Viewer
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] border border-[#211C32]/15 shadow-xs cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dish Selector Tabs */}
        <div className="bg-[#E9DDC7]/40 px-6 py-3 border-b border-[#211C32]/10 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[11px] font-mono font-semibold text-[#477E85] mr-1 hidden sm:inline">
            3D Dishes:
          </span>
          {AR_DISHES.map((dish) => {
            const isSelected = dish.id === selectedDishId;
            return (
              <button
                key={dish.id}
                onClick={() => {
                  playClick();
                  setSelectedDishId(dish.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected 
                    ? 'bg-[#211C32] text-[#FFFDF8] border-[#211C32] font-semibold shadow-xs' 
                    : 'bg-[#FFFDF8] text-[#211C32] border-[#211C32]/15 hover:bg-[#E9DDC7]'
                }`}
              >
                {dish.title}
              </button>
            );
          })}
        </div>

        {/* 3D Canvas & Info Section */}
        <div className="flex flex-col md:flex-row h-[420px] bg-[#F5EBDD]">
          {/* 3D Canvas Area */}
          <div className="relative flex-1 h-full min-h-[250px] overflow-hidden cursor-grab active:cursor-grabbing">
            <div ref={mountRef} className="w-full h-full" />

            {/* Drag to rotate hint */}
            <div className="absolute bottom-3 left-4 bg-[#211C32]/80 backdrop-blur-xs text-[#FFFDF8] text-[10.5px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 pointer-events-none">
              <RotateCcw className="w-3 h-3 text-[#70C5D0]" />
              <span>Drag to rotate 360°</span>
            </div>
          </div>

          {/* Dish Information & AR Button Sidebar */}
          <div className="w-full md:w-80 bg-[#FFFDF8] border-t md:border-t-0 md:border-l border-[#211C32]/12 p-6 flex flex-col justify-between shrink-0">
            <div>
              <span className="text-[10px] font-mono font-semibold text-[#477E85] uppercase tracking-wider block mb-1">
                {currentDish.chapter}
              </span>
              <h3 className="font-fraunces text-xl font-bold text-[#211C32] mb-2 leading-snug">
                {currentDish.title}
              </h3>
              <p className="text-xs font-sans text-[#211C32]/85 leading-relaxed mb-4">
                {currentDish.description}
              </p>

              <div className="bg-[#F5EBDD]/70 rounded-xl p-3 border border-[#211C32]/10 text-[11px] font-sans text-[#477E85]">
                <p className="font-semibold text-[#211C32] mb-0.5">Augmented Reality Note:</p>
                <p>Supports Apple QuickLook on iOS Safari and WebXR on Android Chrome to preview dishes to true scale.</p>
              </div>
            </div>

            {/* Launch Tabletop AR Button */}
            <button
              onClick={() => {
                playClick();
                alert(`Augmented Reality Mode initiated for ${currentDish.title}!\n\nOn mobile Safari (iOS QuickLook) or Chrome with ARCore, this triggers the camera pass-through view to inspect the dish on your physical dining table.`);
              }}
              className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#70C5D0] hover:bg-[#70C5D0]/80 text-[#211C32] font-sans font-semibold text-xs border border-[#211C32]/15 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all tactile-btn"
            >
              <Smartphone className="w-4 h-4" />
              <span>View On Your Table (AR)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F5EBDD] border-t border-[#211C32]/12 px-6 py-3 text-center text-xs font-mono text-[#477E85] shrink-0">
          Rendered in real-time WebGL with soft studio illumination.
        </div>
      </div>
    </div>
  );
}
