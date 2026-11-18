import React, { useEffect, useRef, useState } from 'react';
import { X, Compass, RotateCcw, Footprints } from 'lucide-react';
import { playClick } from '../audio/soundEffects';
import * as THREE from 'three';

export default function StepInsideModal({ isOpen, onClose }) {
  const mountRef = useRef(null);
  const [chefActionText, setChefActionText] = useState('Click any floor tile to guide the Chef');

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5EBDD);
    scene.fog = new THREE.FogExp2(0xF5EBDD, 0.04);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 7.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Warm Ambient Light & Ceiling Chandelier Pendant Spots
    const ambient = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambient);

    const warmSun = new THREE.DirectionalLight(0xfff8ee, 2.0);
    warmSun.position.set(5, 10, 5);
    warmSun.castShadow = true;
    scene.add(warmSun);

    // CAFÉ ROOM WALLS & RETRO CHECKERED FLOOR
    const floorGeo = new THREE.PlaneGeometry(16, 16, 16, 16);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#E9DDC7';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#70C5D0';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillRect(64, 64, 64, 64);

    const floorTexture = new THREE.CanvasTexture(canvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back Wall
    const wallGeo = new THREE.PlaneGeometry(16, 8);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xE9DDC7, roughness: 0.8 });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 4, -8);
    scene.add(backWall);

    // Side Wall Left
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-8, 4, 0);
    scene.add(leftWall);

    // Side Wall Right
    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(8, 4, 0);
    scene.add(rightWall);

    // Central Aqua Bar Counter
    const barGeo = new THREE.BoxGeometry(6, 1.8, 1.2);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x70C5D0, roughness: 0.5 });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 0.9, -5.5);
    bar.castShadow = true;
    bar.receiveShadow = true;
    scene.add(bar);

    // Marble Countertop Surface
    const barTopGeo = new THREE.BoxGeometry(6.4, 0.15, 1.5);
    const barTopMat = new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.2 });
    const barTop = new THREE.Mesh(barTopGeo, barTopMat);
    barTop.position.set(0, 1.88, -5.5);
    barTop.castShadow = true;
    scene.add(barTop);

    // Steaming Chai Samovar on Bar
    const samovarGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.9, 16);
    const samovarMat = new THREE.MeshStandardMaterial({ color: 0xE9B49F, metalness: 0.7, roughness: 0.2 });
    const samovar = new THREE.Mesh(samovarGeo, samovarMat);
    samovar.position.set(-1.8, 2.4, -5.5);
    scene.add(samovar);

    // Café Tables & Bentwood Chairs
    const createTable = (x, z) => {
      const group = new THREE.Group();
      // Table Top (Round Marble)
      const topGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 24);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.3 });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.y = 1.2;
      top.castShadow = true;
      group.add(top);

      // Cast Iron Table Base
      const legGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 12);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x211C32, roughness: 0.8 });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.y = 0.6;
      group.add(leg);

      const footGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 16);
      const foot = new THREE.Mesh(footGeo, legMat);
      foot.position.y = 0.03;
      group.add(foot);

      group.position.set(x, 0, z);
      scene.add(group);
    };

    createTable(-3.2, -1.5);
    createTable(3.2, -1.5);
    createTable(-3.2, 2.5);
    createTable(3.2, 2.5);

    // 3D CHEF CHARACTER
    const chefGroup = new THREE.Group();
    // Body / Coat
    const chefBodyGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.9, 12);
    const chefBodyMat = new THREE.MeshStandardMaterial({ color: 0xFFFDF8 });
    const chefBody = new THREE.Mesh(chefBodyGeo, chefBodyMat);
    chefBody.position.y = 0.75;
    chefBody.castShadow = true;
    chefGroup.add(chefBody);

    // Apron
    const apronGeo = new THREE.BoxGeometry(0.4, 0.6, 0.45);
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x70C5D0 });
    const apron = new THREE.Mesh(apronGeo, apronMat);
    apron.position.set(0, 0.65, 0.05);
    chefGroup.add(apron);

    // Head
    const chefHeadGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const chefHeadMat = new THREE.MeshStandardMaterial({ color: 0xE9B49F });
    const chefHead = new THREE.Mesh(chefHeadGeo, chefHeadMat);
    chefHead.position.y = 1.35;
    chefHead.castShadow = true;
    chefGroup.add(chefHead);

    // Chef Hat
    const hatGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.45, 16);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 1.7;
    hat.castShadow = true;
    chefGroup.add(hat);

    chefGroup.position.set(0, 0, -2);
    scene.add(chefGroup);

    // Walking destination target
    let targetX = 0;
    let targetZ = -2;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Orbit Drag Controls
    let isOrbiting = false;
    let prevX = 0;
    let prevY = 0;
    let theta = 0;
    let phi = 0.4;
    const radius = 9;

    const onMouseDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(floor);

      if (intersects.length > 0 && Math.abs(intersects[0].point.x) < 6.5 && Math.abs(intersects[0].point.z) < 6.5) {
        targetX = intersects[0].point.x;
        targetZ = intersects[0].point.z;
        setChefActionText(`Chef guided to (${targetX.toFixed(1)}, ${targetZ.toFixed(1)})`);
      } else {
        isOrbiting = true;
        prevX = clientX;
        prevY = clientY;
      }
    };

    const onMouseMove = (e) => {
      if (!isOrbiting) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      theta -= deltaX * 0.006;
      phi = Math.max(0.15, Math.min(1.2, phi - deltaY * 0.005));

      camera.position.x = radius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = radius * Math.sin(phi) + 1.2;
      camera.position.z = radius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(0, 1.2, 0);

      prevX = clientX;
      prevY = clientY;
    };

    const onMouseUp = () => {
      isOrbiting = false;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const dx = targetX - chefGroup.position.x;
      const dz = targetZ - chefGroup.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.08) {
        chefGroup.position.x += (dx / dist) * 0.06;
        chefGroup.position.z += (dz / dist) * 0.06;
        chefGroup.rotation.y = Math.atan2(dx, dz);
        chefGroup.position.y = Math.abs(Math.sin(Date.now() * 0.012)) * 0.1;
      } else {
        chefGroup.position.y = 0;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      canvasElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#211C32]/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#FFFDF8] rounded-2xl border border-[#211C32]/15 shadow-2xl flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Editorial Header */}
        <div className="bg-[#F5EBDD] border-b border-[#211C32]/12 px-6 py-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#E9DDC7] border border-[#211C32]/15 flex items-center justify-center text-xl shadow-xs">
              <Compass className="w-5 h-5 text-[#211C32]" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#477E85] uppercase block">
                3D Bombay Irani Café Simulation
              </span>
              <h2 className="font-fraunces text-2xl font-bold text-[#211C32] tracking-tight leading-none">
                Step Inside the Café
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

        {/* 3D Viewport Stage */}
        <div className="relative w-full h-[460px] bg-[#F5EBDD] cursor-crosshair">
          <div ref={mountRef} className="w-full h-full" />

          {/* Floating Controls Overlay */}
          <div className="absolute top-4 left-4 bg-[#211C32]/85 backdrop-blur-xs text-[#FFFDF8] text-xs font-sans px-3.5 py-1.5 rounded-lg border border-[#FFFDF8]/20 shadow-sm flex items-center gap-2 pointer-events-none">
            <Footprints className="w-4 h-4 text-[#70C5D0]" />
            <span>{chefActionText}</span>
          </div>

          <div className="absolute bottom-4 right-4 bg-[#211C32]/85 backdrop-blur-xs text-[#FFFDF8] text-[11px] font-mono px-3 py-1.5 rounded-lg border border-[#FFFDF8]/20 shadow-sm flex items-center gap-2 pointer-events-none">
            <RotateCcw className="w-3.5 h-3.5 text-[#E9B49F]" />
            <span>Drag empty space to orbit 360°</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F5EBDD] border-t border-[#211C32]/12 px-6 py-3.5 flex flex-wrap items-center justify-between text-xs font-sans text-[#211C32]/80 shrink-0 gap-2">
          <span>Modeled with vintage bentwood chairs, marble tables, and brass samovar urn.</span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="font-medium underline hover:text-[#211C32] cursor-pointer"
          >
            Return to 2D Lookbook
          </button>
        </div>
      </div>
    </div>
  );
}
