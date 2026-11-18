import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Sun, 
  Moon, 
  Sparkles, 
  Compass, 
  Volume2,
  ChefHat,
  Utensils,
  BookOpen,
  Wine,
  Flame,
  User,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { playClick, playDrawerOpen, playBoop, playFootstep, playBell, playCollect, playSizzle, playGlassClink } from '../audio/soundEffects';

// Helper to dynamically update the 3D plated dish on Table 4 or Bar Counter
function updatePlatedDish(group, dish, materials) {
  if (!group) return;
  // Remove all non-steam children
  for (let i = group.children.length - 1; i >= 0; i--) {
    const child = group.children[i];
    if (child.name !== 'tableSteam' && !child.isPoints) {
      group.remove(child);
    }
  }

  const { brassMat, teakWoodMat, chromeMat } = materials;
  const dishId = dish?.id || 'house-black-daal';

  if (dishId === 'masala-chai') {
    // 1. Masala Chai: Saucer + Fluted Glass + Spiced Amber Tea + Foam + Parle-G Biscuit
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.02, 20), brassMat);
    group.add(saucer);

    const chaiGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xE8F4F8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      transmission: 0.8,
    });
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.22, 16), chaiGlassMat);
    glass.position.y = 0.11;
    group.add(glass);

    const teaLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.076, 0.062, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0xC46B2C, roughness: 0.3 })
    );
    teaLiquid.position.y = 0.095;
    group.add(teaLiquid);

    const foam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.076, 0.076, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0xF7E8D0, roughness: 0.6 })
    );
    foam.position.y = 0.185;
    group.add(foam);

    const biscuitMat = new THREE.MeshStandardMaterial({ color: 0xD8A868, roughness: 0.9 });
    const biscuit = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.06), biscuitMat);
    biscuit.position.set(0.15, 0.02, 0.04);
    biscuit.rotation.y = 0.4;
    group.add(biscuit);
  } else if (dishId === 'bacon-naan-roll') {
    // 2. Bacon Naan Roll: Teak Board + Folded Tandoori Naan + Smoked Bacon + Chilli Jam
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.025, 0.36), teakWoodMat);
    group.add(board);

    const naanMat = new THREE.MeshStandardMaterial({ color: 0xE8C898, roughness: 0.75 });
    const naan = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16, 1, false, 0, Math.PI), naanMat);
    naan.position.set(0, 0.04, 0);
    group.add(naan);

    const baconMat = new THREE.MeshStandardMaterial({ color: 0x6E2416, roughness: 0.5 });
    for (let b = -1; b <= 1; b++) {
      const baconStrip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.015, 0.04), baconMat);
      baconStrip.position.set(0, 0.07, b * 0.05);
      baconStrip.rotation.y = 0.15;
      group.add(baconStrip);
    }

    const jamMat = new THREE.MeshStandardMaterial({ color: 0xB8241A, roughness: 0.2 });
    const jam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 0.03), jamMat);
    jam.position.set(0, 0.08, 0.01);
    group.add(jam);

    const herbMat = new THREE.MeshStandardMaterial({ color: 0x2A7038, roughness: 0.6 });
    const herb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.025), herbMat);
    herb.position.set(0.06, 0.09, 0.02);
    group.add(herb);
  } else if (dishId === 'okra-fries') {
    // 3. Okra Fries: Brass Tumbler + Crisp Okra Matchsticks + Lime Wedge
    const tumbler = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.24, 16), brassMat);
    tumbler.position.y = 0.12;
    group.add(tumbler);

    const okraMat = new THREE.MeshStandardMaterial({ color: 0x886B26, roughness: 0.7 });
    for (let o = 0; o < 14; o++) {
      const okra = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.22, 6), okraMat);
      const angle = (o / 14) * Math.PI * 2;
      const r = 0.05 + Math.random() * 0.03;
      okra.position.set(Math.cos(angle) * r, 0.18 + Math.random() * 0.04, Math.sin(angle) * r);
      okra.rotation.x = (Math.random() - 0.5) * 0.35;
      okra.rotation.z = (Math.random() - 0.5) * 0.35;
      group.add(okra);
    }

    const limeMat = new THREE.MeshStandardMaterial({ color: 0x95C822, roughness: 0.4 });
    const lime = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12, 1, false, 0, Math.PI), limeMat);
    lime.position.set(0.18, 0.03, 0.08);
    lime.rotation.z = Math.PI / 2;
    group.add(lime);
  } else {
    // 4. Default / House Black Daal / Chicken Ruby / Biryani
    const thali = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.35, 0.03, 24), brassMat);
    group.add(thali);

    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.12, 20),
      new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.2 })
    );
    bowl.position.set(-0.06, 0.065, 0);
    group.add(bowl);

    const isRuby = dishId === 'chicken-ruby';
    const isDaal = dishId === 'house-black-daal';
    const sauceColor = isRuby ? 0xB83018 : (isDaal ? 0x1E140C : 0x8C4A1C);

    const sauce = new THREE.Mesh(
      new THREE.CircleGeometry(0.2, 20),
      new THREE.MeshStandardMaterial({ color: sauceColor, roughness: 0.25 })
    );
    sauce.rotation.x = -Math.PI / 2;
    sauce.position.set(-0.06, 0.122, 0);
    group.add(sauce);

    const cream = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.015, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.4 })
    );
    cream.rotation.x = -Math.PI / 2;
    cream.position.set(-0.06, 0.126, 0);
    group.add(cream);

    const naan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.025, 16, 1, false, 0, Math.PI * 0.75),
      new THREE.MeshStandardMaterial({ color: 0xE8C99B, roughness: 0.8 })
    );
    naan.position.set(0.18, 0.03, 0.08);
    naan.rotation.y = 0.4;
    group.add(naan);

    const herb = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.028),
      new THREE.MeshStandardMaterial({ color: 0x2A7038, roughness: 0.6 })
    );
    herb.position.set(-0.06, 0.135, 0.02);
    group.add(herb);
  }
}

// 3D Hotspot definitions anchored to 3D world coordinates
const HOTSPOTS_3D = [
  {
    id: 'teapot',
    title: 'Chai Kettle & Urn',
    subtitle: 'Afternoon Refreshments',
    sectionId: 'afternoon',
    icon: '🫖',
    position: new THREE.Vector3(1.2, 1.45, 0.2),
  },
  {
    id: 'pastry-shelf',
    title: 'Bakery Cloches & Snacks',
    subtitle: 'Mid-Morning Bites',
    sectionId: 'mid-morning',
    icon: '🥐',
    position: new THREE.Vector3(2.8, 1.45, -1.8),
  },
  {
    id: 'counter',
    title: 'Dining Table Service',
    subtitle: 'Lunch Specials',
    sectionId: 'lunch',
    icon: '🍛',
    position: new THREE.Vector3(-1.8, 0.95, 3.2),
  },
  {
    id: 'window',
    title: 'Grand Arched Windows',
    subtitle: 'Breakfast & Morning Sun',
    sectionId: 'breakfast',
    icon: '🌅',
    position: new THREE.Vector3(-6.8, 2.6, 0.5), // directly on the grand windows!
  },
  {
    id: 'street-cart',
    title: 'Permit Room Bar',
    subtitle: 'Cocktails & Sunset Bhel',
    sectionId: 'sunset',
    icon: '🍹',
    position: new THREE.Vector3(4.5, 2.5, -2.5),
  },
  {
    id: 'stove',
    title: 'Kitchen Pass & Daal Pot',
    subtitle: 'Dinner & Curries',
    sectionId: 'dinner',
    icon: '🍲',
    position: new THREE.Vector3(1.8, 1.4, -4.5),
  },
  {
    id: 'dessert-cabinet',
    title: 'Dessert & Falooda Case',
    subtitle: 'Puddings & Mithai',
    sectionId: 'pudding',
    icon: '🍧',
    position: new THREE.Vector3(4.2, 1.45, 1.5),
  },
  {
    id: 'cookbook-wall',
    title: 'Dishoom Cookbook',
    subtitle: 'Open My Cookbook',
    sectionId: 'cookbook',
    icon: '📖',
    position: new THREE.Vector3(-0.2, 1.45, 1.2),
  },
];

// Preset camera views for quick navigation
const CAMERA_PRESETS = [
  { name: 'Full Bar (Signature)', pos: [-1.2, 2.8, 7.5], target: [1.2, 1.4, -1.5] },
  { name: 'Permit Room Bar Stool', pos: [1.7, 1.82, 2.55], target: [1.7, 1.35, -0.2] },
  { name: 'Table 4 Dining', pos: [-1.8, 1.55, 4.85], target: [-1.8, 1.05, 2.6] },
  { name: 'Sunlit Windows', pos: [-2.8, 2.4, 4.2], target: [-7.0, 2.6, 0.0] },
  { name: 'Permit Room Spirits', pos: [1.5, 2.8, 2.2], target: [4.2, 2.5, -2.0] },
];

export default function Cafe3DScene({
  activeHotspot,
  onSelectHotspot,
  selectedDiet,
  recipes,
  isNightMode = false,
  onToggleTimeMode,
  onOpenMenu,
  onSpeakWaiter,
  onOpenPov,
  orderedDish,
  onFinishServing,
}) {
  const mountRef = useRef(null);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [screenHotspots, setScreenHotspots] = useState([]);
  const [activePreset, setActivePreset] = useState(0);
  const [cameraMode, setCameraMode] = useState('follow'); // 'follow' | 'free'

  // Seated & Locational state
  const [seatingLocation, setSeatingLocation] = useState('standing'); // 'standing' | 'table' | 'bar'
  const seatingLocationRef = useRef('standing');
  const [isSeated, setIsSeated] = useState(false);
  const isSeatedRef = useRef(false);

  const [statusBanner, setStatusBanner] = useState('🪑 Walk to Table 4 or Bar Stool to sit down & call Captain Sorabji!');
  const [waiterBeacon, setWaiterBeacon] = useState(null);
  const [tableBeacon, setTableBeacon] = useState(null);
  const [barBeacon, setBarBeacon] = useState(null);

  const isNearWaiterRef = useRef(false);
  const isNearTableRef = useRef(false);
  const isNearBarRef = useRef(false);

  // References for animation / waiter AI / camera
  const waiterStateRef = useRef('idle'); // 'idle' | 'walking_to_table' | 'at_table' | 'walking_to_kitchen' | 'cooking' | 'bringing_food' | 'served'
  const waiterWpIndexRef = useRef(0);
  const currentCookingDishRef = useRef(null);
  const clocheMeshRef = useRef(null);
  const servedDishGroupRef = useRef(null);
  const servedBarDishGroupRef = useRef(null);
  const playerGroupRef = useRef(null);

  const cameraRef = useRef(null);
  const targetLookAt = useRef(new THREE.Vector3(1.2, 1.4, -1.5));
  const fansRef = useRef([]);
  const dynamicLightsRef = useRef({});
  const windowSunbeamsRef = useRef([]);
  const touchMoveRef = useRef({ x: 0, z: 0 });

  // Handle dish order from menu
  useEffect(() => {
    if (orderedDish) {
      currentCookingDishRef.current = orderedDish;
      if (seatingLocationRef.current === 'standing') {
        seatingLocationRef.current = 'table';
        setSeatingLocation('table');
        setIsSeated(true);
        isSeatedRef.current = true;
      }
      waiterWpIndexRef.current = 0;
      waiterStateRef.current = 'walking_to_kitchen';
      const locLabel = seatingLocationRef.current === 'bar' ? 'the Permit Room Bar' : 'Table 4';
      setStatusBanner(`🍛 Order confirmed! Captain Sorabji is heading to the Kitchen Pass for your ${orderedDish.name} (${locLabel})...`);
    }
  }, [orderedDish]);

  // Check if a hotspot has matching recipes under active diet filter
  const isHotspotMatchingDiet = (hotspot) => {
    if (selectedDiet === 'all') return true;
    if (hotspot.id === 'cookbook-wall') return true;
    const matching = recipes.filter(
      (r) => r.hotspotId === hotspot.id && (selectedDiet === 'all' || r.diet === selectedDiet)
    );
    return matching.length > 0;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x140B07 : 0xEBD8C4);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x1A0E09 : 0xDFCCB8, 0.032);

    // 2. CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    const initialPreset = CAMERA_PRESETS[0];
    camera.position.set(...initialPreset.pos);
    camera.lookAt(...initialPreset.target);
    cameraRef.current = camera;

    // 3. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNightMode ? 1.15 : 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. DAY / NIGHT LIGHTING RIG
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0xFFDFBF : 0xFFF3E4,
      isNightMode ? 0.65 : 1.35
    );
    scene.add(ambientLight);

    // Streaming Sunlight through Windows (Active in Day Mode)
    const windowSun = new THREE.DirectionalLight(0xFFE8CA, isNightMode ? 0.2 : 3.4);
    windowSun.position.set(-10, 6, 2);
    windowSun.target.position.set(0, 1.2, 0);
    windowSun.castShadow = true;
    windowSun.shadow.mapSize.width = 1024;
    windowSun.shadow.mapSize.height = 1024;
    windowSun.shadow.bias = -0.0008;
    scene.add(windowSun);
    scene.add(windowSun.target);

    // Warm Bar Glowing Light (Intense in Night Mode)
    const backBarLight = new THREE.PointLight(
      0xFFA23A,
      isNightMode ? 4.2 : 2.2,
      14,
      1.2
    );
    backBarLight.position.set(4.2, 3.4, -2.5);
    scene.add(backBarLight);

    // Overhead Pendant Bar Light
    const barPendantLight = new THREE.PointLight(
      0xFFD8A0,
      isNightMode ? 2.8 : 1.6,
      14,
      1.3
    );
    barPendantLight.position.set(1.5, 4.2, 0.8);
    barPendantLight.castShadow = true;
    scene.add(barPendantLight);

    // Booth Table Lamps
    const boothLight = new THREE.PointLight(
      0xFFB262,
      isNightMode ? 2.6 : 1.4,
      12,
      1.3
    );
    boothLight.position.set(-4.2, 2.8, 1.2);
    scene.add(boothLight);

    // Dining Spot
    const tableSpot = new THREE.SpotLight(
      0xFFECD5,
      isNightMode ? 3.0 : 2.0,
      12,
      Math.PI / 4,
      0.4,
      1.5
    );
    tableSpot.position.set(-1.8, 4.8, 4.2);
    tableSpot.target.position.set(-1.8, 0.8, 3.2);
    scene.add(tableSpot);
    scene.add(tableSpot.target);

    // Store lights for dynamic updates
    dynamicLightsRef.current = {
      ambientLight,
      windowSun,
      backBarLight,
      barPendantLight,
      boothLight,
      tableSpot,
      scene,
      renderer,
    };

    // 5. PROCEDURAL MATERIALS
    const teakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x361E14,
      roughness: 0.28,
      metalness: 0.05,
    });

    const darkPanellingMat = new THREE.MeshStandardMaterial({
      color: 0x2A150D,
      roughness: 0.45,
    });

    const amberBarFrontMat = new THREE.MeshStandardMaterial({
      color: 0xC85226,
      emissive: 0x7A270D,
      emissiveIntensity: isNightMode ? 0.55 : 0.25,
      roughness: 0.35,
      metalness: 0.05,
    });

    const barTopMat = new THREE.MeshStandardMaterial({
      color: 0x20110A,
      roughness: 0.16,
      metalness: 0.12,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xD4A750,
      metalness: 0.85,
      roughness: 0.22,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xE8EEF2,
      metalness: 0.95,
      roughness: 0.12,
    });

    // ICONIC BLUE LEATHER STOOL CUSHIONS (USER INSTRUCTION: KEEP BLUE COLOUR!)
    const turquoiseLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x3CAFB8,
      roughness: 0.38,
      metalness: 0.06,
    });

    const deepTealCeilingMat = new THREE.MeshStandardMaterial({
      color: 0x1B454E,
      roughness: 0.65,
    });

    const glowingArchMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0xFFA038 : 0xF5B460,
      emissive: isNightMode ? 0xFF8E22 : 0xDF8018,
      emissiveIntensity: isNightMode ? 0.95 : 0.4,
      roughness: 0.3,
    });

    // Glass bottles
    const glassAmberMat = new THREE.MeshPhysicalMaterial({
      color: 0xE87C28,
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
      transmission: 0.6,
    });
    const glassRubyMat = new THREE.MeshPhysicalMaterial({
      color: 0xC02230,
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
      transmission: 0.6,
    });
    const glassAquaMat = new THREE.MeshPhysicalMaterial({
      color: 0x3CB8C2,
      transparent: true,
      opacity: 0.8,
      roughness: 0.15,
      transmission: 0.6,
    });

    // 6. GEOMETRIC FLOOR
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fctx = floorCanvas.getContext('2d');
    fctx.fillStyle = '#E8DCC9';
    fctx.fillRect(0, 0, 512, 512);
    fctx.fillStyle = '#BA5836';
    fctx.fillRect(0, 0, 512, 24);
    fctx.fillRect(0, 0, 24, 512);
    fctx.fillRect(240, 240, 60, 60);
    fctx.fillStyle = '#3CAFB8';
    fctx.fillRect(40, 40, 30, 30);
    fctx.fillRect(440, 40, 30, 30);
    fctx.fillRect(40, 440, 30, 30);
    fctx.fillRect(440, 440, 30, 30);
    fctx.strokeStyle = 'rgba(40, 22, 14, 0.25)';
    fctx.lineWidth = 2;
    for (let i = 0; i < 512; i += 64) {
      fctx.strokeRect(i, 0, 64, 512);
      fctx.strokeRect(0, i, 512, 64);
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(6, 6);

    const floorGeo = new THREE.PlaneGeometry(22, 22);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.35,
      metalness: 0.08,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 7. COFFERED CEILING WITH RECESSED TEAL BOXES & ROTATING FANS
    const ceilingGroup = new THREE.Group();
    const ceilingBaseGeo = new THREE.PlaneGeometry(22, 22);
    const ceilingBaseMat = new THREE.MeshStandardMaterial({ color: 0x22110A, roughness: 0.6 });
    const ceilingBase = new THREE.Mesh(ceilingBaseGeo, ceilingBaseMat);
    ceilingBase.rotation.x = Math.PI / 2;
    ceilingBase.position.y = 5.8;
    ceilingGroup.add(ceilingBase);

    const fansList = [];
    for (let cx = -6; cx <= 6; cx += 3.2) {
      for (let cz = -6; cz <= 6; cz += 3.2) {
        const cofferGeo = new THREE.BoxGeometry(2.4, 0.35, 2.4);
        const coffer = new THREE.Mesh(cofferGeo, deepTealCeilingMat);
        coffer.position.set(cx, 5.75, cz);
        ceilingGroup.add(coffer);

        const trimGeo = new THREE.BoxGeometry(2.55, 0.08, 2.55);
        const trim = new THREE.Mesh(trimGeo, teakWoodMat);
        trim.position.set(cx, 5.58, cz);
        ceilingGroup.add(trim);

        if (Math.abs(cx) === 2.8 || (Math.abs(cx) === 0 && Math.abs(cz) === 3.2)) {
          const fanGroup = new THREE.Group();
          fanGroup.position.set(cx, 5.3, cz);

          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16), brassMat);
          fanGroup.add(hub);

          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), brassMat);
          rod.position.y = 0.25;
          fanGroup.add(rod);

          const bladeMat = new THREE.MeshStandardMaterial({ color: 0x3CAFB8, roughness: 0.4 });
          for (let b = 0; b < 3; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.18), bladeMat);
            blade.position.x = 0.65;
            const bladePivot = new THREE.Group();
            bladePivot.rotation.y = (b * Math.PI * 2) / 3;
            bladePivot.add(blade);
            fanGroup.add(bladePivot);
          }

          ceilingGroup.add(fanGroup);
          fansList.push(fanGroup);
        }
      }
    }
    fansRef.current = fansList;
    scene.add(ceilingGroup);

    // 8. GRAND ARCHED WINDOWS (REQUESTED BY USER)
    // Left exterior wall with 3 large arched Irani café windows looking outside
    const windowGroup = new THREE.Group();
    windowGroup.position.set(-8.2, 0, 0);

    // Exterior Backdrop (Day: Sunlit Bombay morning coastal glow; Night: deep starry navy with streetlamps)
    const skyGeo = new THREE.PlaneGeometry(18, 8);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 256;
    const sctx = skyCanvas.getContext('2d');
    if (isNightMode) {
      // Midnight gradient with stars and distant streetlamps
      const grad = sctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#090F1C');
      grad.addColorStop(0.7, '#151D2F');
      grad.addColorStop(1, '#2E1F18');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 512, 256);
      // Streetlamp bokeh
      sctx.fillStyle = 'rgba(255, 180, 80, 0.8)';
      sctx.beginPath();
      sctx.arc(120, 210, 16, 0, Math.PI * 2);
      sctx.arc(380, 220, 14, 0, Math.PI * 2);
      sctx.fill();
    } else {
      // Warm golden morning sunlit coastal sky
      const grad = sctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#75C3D4');
      grad.addColorStop(0.5, '#F8E0B0');
      grad.addColorStop(1, '#FFD49A');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 512, 256);
      // Soft palm tree silhouettes
      sctx.fillStyle = 'rgba(54, 80, 85, 0.25)';
      sctx.beginPath();
      sctx.moveTo(80, 256);
      sctx.lineTo(85, 120);
      sctx.lineTo(95, 256);
      sctx.fill();
    }

    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture });
    const skyPlane = new THREE.Mesh(skyGeo, skyMat);
    skyPlane.rotation.y = Math.PI / 2;
    skyPlane.position.set(-0.8, 3.2, 0);
    windowGroup.add(skyPlane);

    // 3 Grand Arched Windows
    const sunbeams = [];
    for (let w = -1; w <= 1; w++) {
      const wz = w * 4.2;

      // Wooden Window Frame
      const frameGeo = new THREE.BoxGeometry(0.3, 4.2, 2.6);
      const frame = new THREE.Mesh(frameGeo, teakWoodMat);
      frame.position.set(0, 3.0, wz);
      windowGroup.add(frame);

      // Translucent Window Glass Pane
      const glassGeo = new THREE.PlaneGeometry(2.4, 4.0);
      const windowGlassMat = new THREE.MeshPhysicalMaterial({
        color: isNightMode ? 0x1A2536 : 0xEBF7FA,
        transparent: true,
        opacity: isNightMode ? 0.55 : 0.8,
        roughness: 0.1,
        transmission: isNightMode ? 0.3 : 0.7,
      });
      const glass = new THREE.Mesh(glassGeo, windowGlassMat);
      glass.rotation.y = Math.PI / 2;
      glass.position.set(0.05, 3.0, wz);
      windowGroup.add(glass);

      // Crittall Black / Brass Window Mullion Grids
      for (let g = 1; g <= 3; g++) {
        // Horizontal bars
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 2.4), brassMat);
        hBar.position.set(0.08, 1.2 + g * 0.9, wz);
        windowGroup.add(hBar);
      }
      // Vertical central divider
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.0, 0.04), brassMat);
      vBar.position.set(0.08, 3.0, wz);
      windowGroup.add(vBar);

      // Arch Top Header Moulding
      const archTop = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.3, 16, 1, false, 0, Math.PI), teakWoodMat);
      archTop.rotation.x = Math.PI / 2;
      archTop.rotation.y = Math.PI / 2;
      archTop.position.set(0, 5.0, wz);
      windowGroup.add(archTop);

      // Volumetric Sunbeam Shaft (Visible in Day Mode!)
      if (!isNightMode) {
        const beamGeo = new THREE.CylinderGeometry(0.8, 2.4, 6.5, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
          color: 0xFFF2D6,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.rotation.z = Math.PI / 3;
        beam.rotation.y = 0.2;
        beam.position.set(2.4, 2.2, wz);
        windowGroup.add(beam);
        sunbeams.push(beam);
      }
    }
    windowSunbeamsRef.current = sunbeams;
    scene.add(windowGroup);

    // 9. BACK WALL & ILLUMINATED WARM ARCHED BACK-BAR
    const backWallGeo = new THREE.BoxGeometry(22, 6, 0.8);
    const backWall = new THREE.Mesh(backWallGeo, darkPanellingMat);
    backWall.position.set(0, 3, -8);
    scene.add(backWall);

    const barAlcove = new THREE.Group();
    barAlcove.position.set(4.2, 0, -4.5);

    // 3 Back-lit Arches
    for (let a = -1; a <= 1; a++) {
      const archX = a * 2.2;
      const archBack = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.8), glowingArchMat);
      archBack.position.set(archX, 3.2, -0.15);
      barAlcove.add(archBack);

      const archFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 4.0, 0.3), teakWoodMat);
      archFrame.position.set(archX, 3.2, 0);
      barAlcove.add(archFrame);

      for (let s = 1; s <= 4; s++) {
        const shelfY = 1.4 + s * 0.75;
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.45), brassMat);
        shelf.position.set(archX, shelfY, 0.1);
        barAlcove.add(shelf);

        for (let b = -3; b <= 3; b++) {
          const bottleGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.35, 10);
          const mat = b % 3 === 0 ? glassRubyMat : (b % 2 === 0 ? glassAmberMat : glassAquaMat);
          const bottle = new THREE.Mesh(bottleGeo, mat);
          bottle.position.set(archX + b * 0.22, shelfY + 0.2, 0.1);
          barAlcove.add(bottle);
        }
      }
    }
    scene.add(barAlcove);

    // 10. CURVED AMBER & MAHOGANY BAR COUNTER
    const barGroup = new THREE.Group();
    const barFront = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.25, 1.1), amberBarFrontMat);
    barFront.position.set(2.2, 0.625, 0.0);
    barFront.castShadow = true;
    barGroup.add(barFront);

    const barCurve = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 1.25, 24, 1, false, 0, Math.PI / 2),
      amberBarFrontMat
    );
    barCurve.position.set(-1.05, 0.625, 0.55);
    barCurve.rotation.y = Math.PI / 2;
    barGroup.add(barCurve);

    const barReturn = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.25, 5.0), amberBarFrontMat);
    barReturn.position.set(5.5, 0.625, -2.5);
    barGroup.add(barReturn);

    // Bar tops
    const barTopMain = new THREE.Mesh(new THREE.BoxGeometry(6.9, 0.12, 1.4), barTopMat);
    barTopMain.position.set(2.2, 1.31, 0.0);
    barTopMain.castShadow = true;
    barGroup.add(barTopMain);

    // Polished brass edge trim along bar counter
    const barBrassNosing = new THREE.Mesh(new THREE.BoxGeometry(6.92, 0.04, 0.04), brassMat);
    barBrassNosing.position.set(2.2, 1.35, 0.7);
    barGroup.add(barBrassNosing);

    const barTopReturn = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 5.2), barTopMat);
    barTopReturn.position.set(5.5, 1.31, -2.5);
    barTopReturn.castShadow = true;
    barGroup.add(barTopReturn);

    // Brass footrail
    const footrail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 6.8, 12), brassMat);
    footrail.rotation.z = Math.PI / 2;
    footrail.position.set(2.2, 0.22, 0.7);
    barGroup.add(footrail);

    // Objects on bar:
    // Chai Urn
    const chaiUrnGroup = new THREE.Group();
    chaiUrnGroup.position.set(1.2, 1.37, 0.15);
    const urnBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.55, 16), brassMat);
    urnBody.position.y = 0.28;
    chaiUrnGroup.add(urnBody);
    const urnLid = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), brassMat);
    urnLid.position.y = 0.58;
    chaiUrnGroup.add(urnLid);
    barGroup.add(chaiUrnGroup);

    // Glasses
    for (let g = 0; g < 4; g++) {
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.16, 12), glassAquaMat);
      glass.position.set(0.6 + g * 0.14, 1.45, 0.15);
      barGroup.add(glass);
    }

    // Pastry Cloche
    const clocheGroup = new THREE.Group();
    clocheGroup.position.set(2.8, 1.37, -1.8);
    const clochePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16), teakWoodMat);
    clochePlate.position.y = 0.02;
    clocheGroup.add(clochePlate);
    const clocheDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      glassAquaMat
    );
    clocheDome.position.y = 0.04;
    clocheGroup.add(clocheDome);
    barGroup.add(clocheGroup);

    // Dishoom Cookbook
    const bookGroup = new THREE.Group();
    bookGroup.position.set(-0.2, 1.38, 0.2);
    const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.32), turquoiseLeatherMat);
    bookGroup.add(bookCover);
    const bookSpine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.32), teakWoodMat);
    bookSpine.position.x = -0.21;
    bookGroup.add(bookSpine);
    barGroup.add(bookGroup);

    scene.add(barGroup);

    // 11. RETRO CHROME SWIVEL BAR STOOLS (WITH TURQUOISE BLUE CUSHIONS)
    const stoolPositions = [
      [-0.8, 0, 1.5],
      [-0.1, 0, 1.35],
      [0.8, 0, 1.1],
      [1.7, 0, 1.1], // Featured VIP Permit Room Bar Stool
      [2.6, 0, 1.1],
      [3.5, 0, 1.1],
      [4.4, 0, 1.1],
      [5.4, 0, 0.5],
      [5.4, 0, -0.6],
      [5.4, 0, -1.7],
      [5.4, 0, -2.8],
    ];

    stoolPositions.forEach(([sx, sy, sz], idx) => {
      const stoolGroup = new THREE.Group();
      stoolGroup.position.set(sx, sy, sz);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.28, 0.32, 16), chromeMat);
      base.position.y = 0.16;
      stoolGroup.add(base);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12), chromeMat);
      stem.position.y = 0.52;
      stoolGroup.add(stem);

      const footrest = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 20), chromeMat);
      footrest.rotation.x = Math.PI / 2;
      footrest.position.y = 0.38;
      stoolGroup.add(footrest);

      // Turquoise Blue Cushion
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), turquoiseLeatherMat);
      seat.position.y = 0.88;
      seat.castShadow = true;
      stoolGroup.add(seat);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.03, 24), chromeMat);
      rim.position.y = 0.82;
      stoolGroup.add(rim);

      // Highlight the VIP Permit Room Stool 4 at [1.7, 0, 1.1]
      if (idx === 3) {
        const brassStoolTrim = new THREE.Mesh(new THREE.CylinderGeometry(0.272, 0.272, 0.02, 24), brassMat);
        brassStoolTrim.position.y = 0.94;
        stoolGroup.add(brassStoolTrim);

        const highlightRing = new THREE.Mesh(
          new THREE.RingGeometry(0.32, 0.38, 24),
          new THREE.MeshBasicMaterial({ color: 0xD4A750, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
        );
        highlightRing.rotation.x = -Math.PI / 2;
        highlightRing.position.y = 0.015;
        stoolGroup.add(highlightRing);
      }

      scene.add(stoolGroup);
    });

    // 12. FOREFRONT DINING TABLE
    const frontDiningGroup = new THREE.Group();
    frontDiningGroup.position.set(-1.8, 0, 3.2);

    const dTableTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 1.6), teakWoodMat);
    dTableTop.position.y = 0.95;
    dTableTop.castShadow = true;
    frontDiningGroup.add(dTableTop);

    const dTableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 12), darkPanellingMat);
    dTableLeg.position.y = 0.45;
    frontDiningGroup.add(dTableLeg);
    const dTableFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 16), darkPanellingMat);
    dTableFoot.position.y = 0.03;
    frontDiningGroup.add(dTableFoot);

    // Plate & Tumbler
    const plateStack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.12, 20),
      new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.2 })
    );
    plateStack.position.set(-0.6, 1.05, 0.2);
    frontDiningGroup.add(plateStack);

    const tumbler = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.22, 16), chromeMat);
    tumbler.position.set(-0.9, 1.1, 0.2);
    frontDiningGroup.add(tumbler);

    // Turquoise Chairs
    for (let c = -1; c <= 1; c += 2) {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(c * 0.9, 0, 1.2);
      chairGroup.rotation.y = Math.PI;

      const chairBack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.35, 16, 1, true, 0, Math.PI),
        turquoiseLeatherMat
      );
      chairBack.position.y = 0.85;
      chairGroup.add(chairBack);

      const chairSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16), turquoiseLeatherMat);
      chairSeat.position.y = 0.62;
      chairGroup.add(chairSeat);

      for (let leg = 0; leg < 4; leg++) {
        const cl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), chromeMat);
        cl.position.set(leg % 2 === 0 ? 0.2 : -0.2, 0.3, leg < 2 ? 0.2 : -0.2);
        chairGroup.add(cl);
      }
      frontDiningGroup.add(chairGroup);
    }

    // 12B. PLATED DISH ON TABLE (VISIBLE UPON SERVICE)
    const servedDishGroup = new THREE.Group();
    servedDishGroup.position.set(0, 0.96, 0.1);
    servedDishGroup.visible = false;

    const tableSteamGeo = new THREE.BufferGeometry();
    const steamCount = 24;
    const steamPos = new Float32Array(steamCount * 3);
    for (let s = 0; s < steamCount; s++) {
      steamPos[s * 3] = (Math.random() - 0.5) * 0.25;
      steamPos[s * 3 + 1] = 0.15 + Math.random() * 0.45;
      steamPos[s * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    tableSteamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const tableSteam = new THREE.Points(
      tableSteamGeo,
      new THREE.PointsMaterial({ color: 0xFFFDF8, size: 0.055, transparent: true, opacity: 0.5 })
    );
    tableSteam.name = 'tableSteam';
    servedDishGroup.add(tableSteam);

    // Initial 3D culinary plating (House Black Daal by default)
    updatePlatedDish(servedDishGroup, { id: 'house-black-daal' }, { brassMat, teakWoodMat, chromeMat });

    frontDiningGroup.add(servedDishGroup);
    servedDishGroupRef.current = servedDishGroup;

    scene.add(frontDiningGroup);

    // 12C. PLATED DISH ON BAR COUNTER (FOR BAR SEATING SERVICE)
    const servedBarDishGroup = new THREE.Group();
    servedBarDishGroup.position.set(1.7, 1.34, 0.22);
    servedBarDishGroup.visible = false;

    const barSteamGeo = new THREE.BufferGeometry();
    const barSteamCount = 20;
    const barSteamPos = new Float32Array(barSteamCount * 3);
    for (let s = 0; s < barSteamCount; s++) {
      barSteamPos[s * 3] = (Math.random() - 0.5) * 0.2;
      barSteamPos[s * 3 + 1] = 0.12 + Math.random() * 0.4;
      barSteamPos[s * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    barSteamGeo.setAttribute('position', new THREE.BufferAttribute(barSteamPos, 3));
    const barSteam = new THREE.Points(
      barSteamGeo,
      new THREE.PointsMaterial({ color: 0xFFFDF8, size: 0.05, transparent: true, opacity: 0.5 })
    );
    barSteam.name = 'tableSteam';
    servedBarDishGroup.add(barSteam);

    updatePlatedDish(servedBarDishGroup, { id: 'masala-chai' }, { brassMat, teakWoodMat, chromeMat });
    scene.add(servedBarDishGroup);
    servedBarDishGroupRef.current = servedBarDishGroup;

    // 13. 3D CUSTOMER CHARACTER (THE DINER)
    const charcoalSuitMat = new THREE.MeshStandardMaterial({ color: 0x2A2438, roughness: 0.7 });
    const pocketSquareMat = new THREE.MeshStandardMaterial({ color: 0x3CAFB8, roughness: 0.5 });
    const trousersMat = new THREE.MeshStandardMaterial({ color: 0xE8DDC8, roughness: 0.8 });
    const leatherShoesMat = new THREE.MeshStandardMaterial({ color: 0x28160E, roughness: 0.4 });
    const skinToneMat = new THREE.MeshStandardMaterial({ color: 0xD8A082, roughness: 0.6 });
    const darkHairMat = new THREE.MeshStandardMaterial({ color: 0x1A141A, roughness: 0.8 });
    const waiterCoatMat = new THREE.MeshStandardMaterial({ color: 0xFFFDF8, roughness: 0.5 });
    const waiterPantsMat = new THREE.MeshStandardMaterial({ color: 0x18171E, roughness: 0.7 });
    const silverPlatterMat = new THREE.MeshStandardMaterial({ color: 0xDFE6EC, metalness: 0.85, roughness: 0.2 });
    const shadowDiscMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });

    const playerGroup = new THREE.Group();
    // Start standing in the open aisle beside Table 4
    playerGroup.position.set(0.1, 0, 3.8);
    playerGroupRef.current = playerGroup;

    const playerShadow = new THREE.Mesh(new THREE.CircleGeometry(0.35, 16), shadowDiscMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.y = 0.02;
    playerGroup.add(playerShadow);

    const playerBody = new THREE.Group();
    playerGroup.add(playerBody);

    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.54, 0.22), charcoalSuitMat);
    torsoMesh.position.y = 1.05;
    torsoMesh.castShadow = true;
    playerBody.add(torsoMesh);

    const pocketSquare = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.02), pocketSquareMat);
    pocketSquare.position.set(0.1, 1.18, 0.12);
    playerBody.add(pocketSquare);

    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.1, 12), skinToneMat);
    neckMesh.position.y = 1.34;
    playerBody.add(neckMesh);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinToneMat);
    headMesh.position.y = 1.48;
    playerBody.add(headMesh);

    const hairMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.135, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      darkHairMat
    );
    hairMesh.position.y = 1.5;
    playerBody.add(hairMesh);

    // Limbs for walking & sitting animation
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.11, 0.8, 0);
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.14), trousersMat);
    leftLeg.position.y = -0.32;
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.2), leatherShoesMat);
    leftShoe.position.set(0, -0.62, 0.04);
    leftLegGroup.add(leftLeg);
    leftLegGroup.add(leftShoe);
    playerBody.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.11, 0.8, 0);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.14), trousersMat);
    rightLeg.position.y = -0.32;
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.2), leatherShoesMat);
    rightShoe.position.set(0, -0.62, 0.04);
    rightLegGroup.add(rightLeg);
    rightLegGroup.add(rightShoe);
    playerBody.add(rightLegGroup);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.25, 1.25, 0);
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.48, 0.1), charcoalSuitMat);
    leftArm.position.y = -0.22;
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), skinToneMat);
    leftHand.position.y = -0.48;
    leftArmGroup.add(leftArm);
    leftArmGroup.add(leftHand);
    playerBody.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.25, 1.25, 0);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.48, 0.1), charcoalSuitMat);
    rightArm.position.y = -0.22;
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), skinToneMat);
    rightHand.position.y = -0.48;
    rightArmGroup.add(rightArm);
    rightArmGroup.add(rightHand);
    playerBody.add(rightArmGroup);

    scene.add(playerGroup);

    // 14. 3D WAITER CAPTAIN (BAWAJI SERVICE)
    const waiterGroup = new THREE.Group();
    // Waiter stationed attentively in the open dining aisle
    waiterGroup.position.set(0.6, 0, 1.8);

    const waiterShadow = new THREE.Mesh(new THREE.CircleGeometry(0.35, 16), shadowDiscMat);
    waiterShadow.rotation.x = -Math.PI / 2;
    waiterShadow.position.y = 0.02;
    waiterGroup.add(waiterShadow);

    const waiterBody = new THREE.Group();
    waiterGroup.add(waiterBody);

    const wTorso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.58, 0.24), waiterCoatMat);
    wTorso.position.y = 1.05;
    waiterBody.add(wTorso);

    for (let b = 0; b < 4; b++) {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.01, 8), brassMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0, 0.9 + b * 0.1, 0.13);
      waiterBody.add(btn);
    }

    const wBow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.03), waiterPantsMat);
    wBow.position.set(0, 1.3, 0.13);
    waiterBody.add(wBow);

    const wHead = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinToneMat);
    wHead.position.y = 1.48;
    waiterBody.add(wHead);

    const wHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.135, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      darkHairMat
    );
    wHair.position.y = 1.5;
    waiterBody.add(wHair);

    const wMoustache = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 12, Math.PI), darkHairMat);
    wMoustache.rotation.z = Math.PI;
    wMoustache.position.set(0, 1.45, 0.13);
    waiterBody.add(wMoustache);

    // Waiter Walking Limbs
    const wLegLeftGroup = new THREE.Group();
    wLegLeftGroup.position.set(-0.1, 0.75, 0);
    const wLegLeft = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.68, 0.16), waiterPantsMat);
    wLegLeft.position.y = -0.34;
    const wShoeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.2), leatherShoesMat);
    wShoeLeft.position.set(0, -0.66, 0.03);
    wLegLeftGroup.add(wLegLeft, wShoeLeft);
    waiterBody.add(wLegLeftGroup);

    const wLegRightGroup = new THREE.Group();
    wLegRightGroup.position.set(0.1, 0.75, 0);
    const wLegRight = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.68, 0.16), waiterPantsMat);
    wLegRight.position.y = -0.34;
    const wShoeRight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.2), leatherShoesMat);
    wShoeRight.position.set(0, -0.66, 0.03);
    wLegRightGroup.add(wLegRight, wShoeRight);
    waiterBody.add(wLegRightGroup);

    // Silver Tray & Cloche & Brass Bell
    const wTray = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24), silverPlatterMat);
    wTray.position.set(0.28, 1.05, 0.24);
    waiterBody.add(wTray);

    const wBell = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.07, 16), brassMat);
    wBell.position.set(0.28, 1.1, 0.24);
    waiterBody.add(wBell);

    const clocheMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      silverPlatterMat
    );
    const clocheHandle = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), brassMat);
    clocheHandle.position.y = 0.13;
    clocheMesh.add(clocheHandle);
    clocheMesh.position.set(0.28, 1.06, 0.24);
    clocheMesh.visible = false;
    waiterBody.add(clocheMesh);
    clocheMeshRef.current = clocheMesh;

    scene.add(waiterGroup);

    // 15. KEYBOARD CONTROLS FOR PLAYER
    const keys = {};

    const handleSitAtInternal = (targetLoc) => {
      if (targetLoc === 'standing') {
        playClick();
        const prevLoc = seatingLocationRef.current;
        seatingLocationRef.current = 'standing';
        setSeatingLocation('standing');
        setIsSeated(false);
        isSeatedRef.current = false;
        if (playerGroupRef.current) {
          if (prevLoc === 'bar') {
            playerGroupRef.current.position.set(1.7, 0, 1.95);
          } else {
            playerGroupRef.current.position.set(0.1, 0, 4.0);
          }
          playerGroupRef.current.rotation.y = 0;
        }
        setStatusBanner('🧍 Standing in the open aisle. Use WASD / Arrows to explore the café.');
      } else if (targetLoc === 'bar') {
        playGlassClink();
        seatingLocationRef.current = 'bar';
        setSeatingLocation('bar');
        setIsSeated(true);
        isSeatedRef.current = true;
        setStatusBanner('🍸 Seated at the Permit Room Bar! Ring bell or press [C] to call Captain Sorabji for drinks & snacks.');
      } else if (targetLoc === 'table') {
        playClick();
        seatingLocationRef.current = 'table';
        setSeatingLocation('table');
        setIsSeated(true);
        isSeatedRef.current = true;
        setStatusBanner('🪑 Seated at Table 4! Ring the table bell or press [C] to call Captain Sorabji.');
      }
    };

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      keys[key] = true;

      // Contextual Sit / Stand [F]
      if (key === 'f') {
        if (seatingLocationRef.current !== 'standing') {
          handleSitAtInternal('standing');
        } else if (isNearBarRef.current) {
          handleSitAtInternal('bar');
        } else {
          handleSitAtInternal('table');
        }
      }

      // Sit at Bar [B]
      if (key === 'b') {
        if (seatingLocationRef.current === 'bar') {
          handleSitAtInternal('standing');
        } else {
          handleSitAtInternal('bar');
        }
      }

      // Sit at Table 4 [T]
      if (key === 't') {
        if (seatingLocationRef.current === 'table') {
          handleSitAtInternal('standing');
        } else {
          handleSitAtInternal('table');
        }
      }

      // Call Waiter [C]
      if (key === 'c') {
        playBell();
        if (seatingLocationRef.current === 'standing') {
          if (isNearBarRef.current) {
            handleSitAtInternal('bar');
          } else {
            handleSitAtInternal('table');
          }
        }
        waiterStateRef.current = 'walking_to_table';
        const locName = seatingLocationRef.current === 'bar' ? 'the Permit Room Bar' : 'Table 4';
        setStatusBanner(`🔔 Captain Sorabji heard your call and is walking to ${locName}...`);
      }

      // Open Menu [M] or [Space]
      if (key === 'm' || key === ' ') {
        if (onOpenMenu) {
          playClick();
          onOpenMenu();
        }
      }

      // Speak directly [E]
      if (key === 'e') {
        if (isNearWaiterRef.current && onSpeakWaiter) {
          playBell();
          onSpeakWaiter();
        }
      }
    };
    const handleKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 16. MOUSE / TOUCH ORBIT CONTROLS
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevPointerX = e.clientX || (e.touches && e.touches[0].clientX);
      prevPointerY = e.clientY || (e.touches && e.touches[0].clientY);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      const deltaX = x - prevPointerX;
      const deltaY = y - prevPointerY;

      const offset = camera.position.clone().sub(targetLookAt.current);
      const radius = offset.length();

      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

      theta -= deltaX * 0.0055;
      phi = Math.max(0.65, Math.min(1.45, phi - deltaY * 0.004));

      offset.x = radius * Math.sin(phi) * Math.sin(theta);
      offset.y = radius * Math.cos(phi);
      offset.z = radius * Math.sin(phi) * Math.cos(theta);

      camera.position.copy(targetLookAt.current).add(offset);
      camera.lookAt(targetLookAt.current);

      prevPointerX = x;
      prevPointerY = y;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    canvasElem.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 17. ANIMATION LOOP
    let animId;
    let walkCycle = 0;
    let waiterWalkCycle = 0;
    let stepSoundTimer = 0;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Fans rotating
      fansList.forEach((fan) => {
        fan.rotation.y += 0.025;
      });

      // Subtle volumetric sunbeam shimmer in Day Mode
      if (sunbeams.length > 0) {
        sunbeams.forEach((beam) => {
          beam.material.opacity = 0.14 + Math.sin(Date.now() * 0.0015) * 0.03;
        });
      }

      // Animate steam particles on served table dish
      if (servedDishGroup.visible) {
        const sPos = tableSteamGeo.attributes.position.array;
        for (let s = 0; s < steamCount; s++) {
          sPos[s * 3 + 1] += 0.006;
          sPos[s * 3] += Math.sin(Date.now() * 0.0025 + s) * 0.001;
          if (sPos[s * 3 + 1] > 0.6) {
            sPos[s * 3 + 1] = 0.15;
          }
        }
        tableSteamGeo.attributes.position.needsUpdate = true;
      }

      // Animate steam particles on served bar dish
      if (servedBarDishGroup.visible) {
        const sPos = barSteamGeo.attributes.position.array;
        for (let s = 0; s < barSteamCount; s++) {
          sPos[s * 3 + 1] += 0.006;
          sPos[s * 3] += Math.sin(Date.now() * 0.0025 + s) * 0.001;
          if (sPos[s * 3 + 1] > 0.6) {
            sPos[s * 3 + 1] = 0.15;
          }
        }
        barSteamGeo.attributes.position.needsUpdate = true;
      }

      // ========================================================
      // A. SEATED DINER VS WALKING CUSTOMER
      // ========================================================
      if (isSeatedRef.current) {
        if (seatingLocationRef.current === 'bar') {
          // Seated at Permit Room VIP Stool 4:
          // Stool 4 is at (1.7, 0, 1.1), facing the mahogany counter (z: 0)
          playerGroup.position.set(1.7, 0, 1.1);
          playerGroup.rotation.y = Math.PI; // Face the bar counter
          playerBody.position.y = -0.06; // Stool cushion is higher (y=0.88), so higher torso elevation

          leftLegGroup.position.set(-0.11, 0.62, 0.1);
          leftLegGroup.rotation.x = Math.PI / 2.3; // Thighs resting forward over stool rim
          rightLegGroup.position.set(0.11, 0.62, 0.1);
          rightLegGroup.rotation.x = Math.PI / 2.3;

          leftArmGroup.position.set(-0.25, 1.15, 0.14);
          leftArmGroup.rotation.x = -Math.PI / 3.2; // Arms resting on mahogany bar counter
          rightArmGroup.position.set(0.25, 1.15, 0.14);
          rightArmGroup.rotation.x = -Math.PI / 3.2;

          // Intimate Bar Camera POV
          if (cameraMode === 'follow' && !isDragging) {
            const barCamPos = new THREE.Vector3(1.7, 1.82, 2.55);
            camera.position.lerp(barCamPos, 0.04);
            targetLookAt.current.lerp(new THREE.Vector3(1.7, 1.35, -0.2), 0.04);
            camera.lookAt(targetLookAt.current);
          }
        } else {
          // Position player seated at Table 4 looking across into the restaurant
          playerGroup.position.set(-1.8, 0, 4.05);
          playerGroup.rotation.y = Math.PI; // Face towards the bar and waiter approach
          playerBody.position.y = -0.32; // Lower torso to chair cushion

          leftLegGroup.position.set(-0.11, 0.45, 0.1);
          leftLegGroup.rotation.x = Math.PI / 2; // Thighs extended forward
          rightLegGroup.position.set(0.11, 0.45, 0.1);
          rightLegGroup.rotation.x = Math.PI / 2;

          leftArmGroup.position.set(-0.25, 1.05, 0.12);
          leftArmGroup.rotation.x = -Math.PI / 4; // Rest arms on table
          rightArmGroup.position.set(0.25, 1.05, 0.12);
          rightArmGroup.rotation.x = -Math.PI / 4;

          // Seated dining camera overlooking table and the Permit Room
          if (cameraMode === 'follow' && !isDragging) {
            const seatedCamPos = new THREE.Vector3(-1.8, 1.55, 4.85);
            camera.position.lerp(seatedCamPos, 0.04);
            targetLookAt.current.lerp(new THREE.Vector3(-1.8, 1.05, 2.6), 0.04);
            camera.lookAt(targetLookAt.current);
          }
        }
      } else {
        // Normal standing / walking posture
        playerBody.position.y = 0;
        leftLegGroup.position.set(-0.11, 0.8, 0);
        rightLegGroup.position.set(0.11, 0.8, 0);
        leftArmGroup.position.set(-0.25, 1.25, 0);
        rightArmGroup.position.set(0.25, 1.25, 0);

        // Customer locomotion
        let moveX = 0;
        let moveZ = 0;
        if (keys['w'] || keys['arrowup']) moveZ -= 1;
        if (keys['s'] || keys['arrowdown']) moveZ += 1;
        if (keys['a'] || keys['arrowleft']) moveX -= 1;
        if (keys['d'] || keys['arrowright']) moveX += 1;

        if (touchMoveRef.current.x !== 0 || touchMoveRef.current.z !== 0) {
          moveX += touchMoveRef.current.x;
          moveZ += touchMoveRef.current.z;
        }

        const isWalking = moveX !== 0 || moveZ !== 0;
        if (isWalking) {
          const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
          const dirX = moveX / len;
          const dirZ = moveZ / len;
          const speed = 0.052;

          const prevX = playerGroup.position.x;
          const prevZ = playerGroup.position.z;

          // Candidate positions
          const candX = prevX + dirX * speed;
          const candZ = prevZ + dirZ * speed;

          // SOLID FURNITURE & OBSTACLE COLLISION DETECTOR
          const isObstacle = (cx, cz) => {
            // 1. Perimeter boundary walls
            if (cx < -5.2 || cx > 5.4 || cz < -3.6 || cz > 4.5) return true;

            // 2. Table 4 & Dining Chairs (when customer is walking)
            // Table 4 is at (-1.8, 0, 3.2), box extends x: -3.45 to -0.15, z: 2.25 to 4.2
            if (cx >= -3.45 && cx <= -0.15 && cz >= 2.25 && cz <= 4.2) return true;

            // 3. Main Bar Counter & Front Chrome Stool Line
            // Bar counter front is at z: -0.55 to 0.55, chrome stools row at z: 1.1 to 1.55, x: -1.25 to 5.6
            if (cx >= -1.25 && cx <= 5.6 && cz >= -0.75 && cz <= 1.55) return true;

            // 4. Curved Bar Corner at (-1.05, 0.55)
            if (Math.hypot(cx - (-1.05), cz - 0.55) < 1.25) return true;

            // 5. Bar Return Counter on Right
            if (cx >= 4.7 && cx <= 6.2 && cz >= -4.8 && cz <= 0.6) return true;

            // 6. Back Liquor Display & Shelves
            if (cx >= 1.8 && cx <= 6.0 && cz <= -3.2) return true;

            // 7. Waiter Character (Captain Sorabji) - Solid character collision
            if (waiterGroup) {
              if (Math.hypot(cx - waiterGroup.position.x, cz - waiterGroup.position.z) < 0.65) return true;
            }

            return false;
          };

          // Smooth sliding collision response along obstacle edges
          if (!isObstacle(candX, candZ)) {
            playerGroup.position.x = candX;
            playerGroup.position.z = candZ;
          } else if (!isObstacle(candX, prevZ)) {
            playerGroup.position.x = candX; // slide along X
          } else if (!isObstacle(prevX, candZ)) {
            playerGroup.position.z = candZ; // slide along Z
          }

          const movedX = playerGroup.position.x - prevX;
          const movedZ = playerGroup.position.z - prevZ;
          if (Math.hypot(movedX, movedZ) > 0.001) {
            const targetRotation = Math.atan2(movedX, movedZ);
            playerGroup.rotation.y = targetRotation;
          }

          walkCycle += 0.22;
          leftLegGroup.rotation.x = Math.sin(walkCycle) * 0.45;
          rightLegGroup.rotation.x = -Math.sin(walkCycle) * 0.45;
          leftArmGroup.rotation.x = -Math.sin(walkCycle) * 0.35;
          rightArmGroup.rotation.x = Math.sin(walkCycle) * 0.35;
          playerBody.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.035;

          stepSoundTimer += 1;
          if (stepSoundTimer > 18) {
            playFootstep();
            stepSoundTimer = 0;
          }

          if (cameraMode === 'follow' && !isDragging) {
            const desiredCamPos = new THREE.Vector3(
              playerGroup.position.x - 0.4,
              playerGroup.position.y + 2.3,
              playerGroup.position.z + 4.0
            );
            camera.position.lerp(desiredCamPos, 0.04);
            targetLookAt.current.lerp(
              new THREE.Vector3(playerGroup.position.x, playerGroup.position.y + 1.2, playerGroup.position.z - 0.6),
              0.04
            );
            camera.lookAt(targetLookAt.current);
          }
        } else {
          leftLegGroup.rotation.x *= 0.8;
          rightLegGroup.rotation.x *= 0.8;
          leftArmGroup.rotation.x *= 0.8;
          rightArmGroup.rotation.x *= 0.8;
          playerBody.position.y *= 0.8;
        }
      }

      // ========================================================
      // B. AUTONOMOUS WAITER STATE MACHINE & PATHFINDING
      // ========================================================
      const wState = waiterStateRef.current;
      const isBar = seatingLocationRef.current === 'bar';

      if (wState === 'walking_to_table') {
        // Destination depends on whether customer is at Permit Room Bar or Table 4
        const customerTarget = isBar
          ? new THREE.Vector3(0.85, 0, 1.45) // Standing in open aisle right beside Bar VIP Stool 4
          : new THREE.Vector3(-0.05, 0, 3.4); // Beside Table 4
        const diff = customerTarget.clone().sub(waiterGroup.position);
        diff.y = 0;
        const dist = diff.length();
        if (dist > 0.08) {
          diff.normalize();
          waiterGroup.position.addScaledVector(diff, 0.052);
          waiterGroup.rotation.y = Math.atan2(diff.x, diff.z);

          waiterWalkCycle += 0.22;
          wLegLeftGroup.rotation.x = Math.sin(waiterWalkCycle) * 0.45;
          wLegRightGroup.rotation.x = -Math.sin(waiterWalkCycle) * 0.45;
        } else {
          waiterStateRef.current = 'at_table';
          wLegLeftGroup.rotation.x = 0;
          wLegRightGroup.rotation.x = 0;
          if (isBar) {
            waiterGroup.lookAt(1.7, 0, 1.1); // Face seated diner at Bar VIP Stool 4
            playGlassClink();
            setStatusBanner('🤵 Captain Sorabji: "Namaste! Welcome to the Permit Room Bar. What cocktail, chai, or snack may we bring?"');
          } else {
            waiterGroup.lookAt(-1.8, 0, 3.2); // Face seated diner & table
            playBell();
            setStatusBanner('🤵 Captain Sorabji: "Namaste! Welcome to Table 4. What may we bring from the menu today?"');
          }
          setTimeout(() => {
            onOpenMenu && onOpenMenu();
          }, 600);
        }
      } else if (wState === 'walking_to_kitchen') {
        // Walk directly across the open dining floor to the Kitchen Pass Counter in clear view
        const kitchenPassPos = new THREE.Vector3(0.4, 0, 1.8);
        const diff = kitchenPassPos.clone().sub(waiterGroup.position);
        diff.y = 0;
        const dist = diff.length();
        if (dist > 0.08) {
          diff.normalize();
          waiterGroup.position.addScaledVector(diff, 0.055);
          waiterGroup.rotation.y = Math.atan2(diff.x, diff.z);

          waiterWalkCycle += 0.22;
          wLegLeftGroup.rotation.x = Math.sin(waiterWalkCycle) * 0.45;
          wLegRightGroup.rotation.x = -Math.sin(waiterWalkCycle) * 0.45;
        } else {
          // Arrived at Kitchen Pass!
          waiterStateRef.current = 'cooking';
          wLegLeftGroup.rotation.x = 0;
          wLegRightGroup.rotation.x = 0;
          waiterGroup.lookAt(0.4, 0, 0.5); // Face the bar pass counter
          playBell();
          playSizzle();
          const dishName = currentCookingDishRef.current?.name || 'dish';
          const locName = isBar ? 'the Permit Room Bar' : 'Table 4';
          setStatusBanner(`🔥 Kitchen Pass: Chef Naved is slow-cooking your ${dishName} in the tandoor hearth...`);

          // 1.3 seconds of sizzling cooking at the pass
          setTimeout(() => {
            if (clocheMeshRef.current) clocheMeshRef.current.visible = true;
            waiterStateRef.current = 'bringing_food';
            setStatusBanner(`🤵 Captain Sorabji is bringing your freshly prepared ${dishName} under silver cloche to ${locName}!`);
          }, 1300);
        }
      } else if (wState === 'bringing_food') {
        // Return directly to customer's chosen seating location holding silver cloche platter
        const customerTarget = isBar
          ? new THREE.Vector3(0.85, 0, 1.45)
          : new THREE.Vector3(-0.05, 0, 3.4);
        const diff = customerTarget.clone().sub(waiterGroup.position);
        diff.y = 0;
        const dist = diff.length();
        if (dist > 0.08) {
          diff.normalize();
          waiterGroup.position.addScaledVector(diff, 0.055);
          waiterGroup.rotation.y = Math.atan2(diff.x, diff.z);

          waiterWalkCycle += 0.22;
          wLegLeftGroup.rotation.x = Math.sin(waiterWalkCycle) * 0.45;
          wLegRightGroup.rotation.x = -Math.sin(waiterWalkCycle) * 0.45;
        } else {
          // Arrived with hot food!
          waiterStateRef.current = 'served';
          wLegLeftGroup.rotation.x = 0;
          wLegRightGroup.rotation.x = 0;

          // Lift the silver cloche with a flourish!
          if (clocheMeshRef.current) clocheMeshRef.current.visible = false;

          const servedDish = currentCookingDishRef.current;
          if (isBar) {
            waiterGroup.lookAt(1.7, 0, 1.1);
            if (servedBarDishGroupRef.current && servedDish) {
              updatePlatedDish(servedBarDishGroupRef.current, servedDish, { brassMat, teakWoodMat, chromeMat });
              servedBarDishGroupRef.current.visible = true;
            }
            playGlassClink();
            playCollect();
            setStatusBanner(`🍸 Plated at the Permit Room Bar: ${servedDish?.name || 'Dish'}! Captain Sorabji: "Enjoy your specialty, served fresh at the bar."`);

            // Look towards the steaming dish on the mahogany counter
            if (cameraMode === 'follow' && !isDragging) {
              targetLookAt.current.set(1.7, 1.35, 0.2);
            }

            // 2.0 seconds of bar viewing before recipe explanation modal opens
            setTimeout(() => {
              if (onFinishServing && servedDish) {
                onFinishServing(servedDish, 'bar');
              }
            }, 2000);
          } else {
            waiterGroup.lookAt(-1.8, 0, 3.2);
            if (servedDishGroupRef.current && servedDish) {
              updatePlatedDish(servedDishGroupRef.current, servedDish, { brassMat, teakWoodMat, chromeMat });
              servedDishGroupRef.current.visible = true;
            }
            playCollect();
            setStatusBanner(`✨ Plated at Table 4: ${servedDish?.name || 'Dish'}! Captain Sorabji: "Your dish is served fresh and piping hot."`);

            // Gently angle camera to celebrate the steaming dish on the table
            if (cameraMode === 'follow' && !isDragging) {
              targetLookAt.current.set(-1.8, 0.95, 3.2);
            }

            // 2.0 seconds of table viewing before recipe explanation modal opens
            setTimeout(() => {
              if (onFinishServing && servedDish) {
                onFinishServing(servedDish, 'table');
              }
            }, 2000);
          }
        }
      } else if (wState === 'idle') {
        waiterBody.position.y = Math.sin(Date.now() * 0.003) * 0.015;
      }

      // Proximity to Waiter
      const distToWaiter = playerGroup.position.distanceTo(waiterGroup.position);
      const nearW = distToWaiter < 2.5;
      isNearWaiterRef.current = nearW;
      if (nearW && wState === 'idle') {
        waiterGroup.lookAt(playerGroup.position.x, waiterGroup.position.y, playerGroup.position.z);
        tempVec.copy(waiterGroup.position);
        tempVec.y += 1.85;
        tempVec.project(camera);
        const wx = (tempVec.x * 0.5 + 0.5) * width;
        const wy = (-(tempVec.y * 0.5) + 0.5) * height;
        setWaiterBeacon({ screenX: wx, screenY: wy, visible: tempVec.z <= 1.0 });
      } else {
        setWaiterBeacon(null);
      }

      // Proximity to Dining Table 4
      const distToTable = playerGroup.position.distanceTo(frontDiningGroup.position);
      const nearT = distToTable < 2.4;
      isNearTableRef.current = nearT;
      if (nearT && seatingLocationRef.current !== 'table') {
        tempVec.copy(frontDiningGroup.position);
        tempVec.y += 1.35;
        tempVec.project(camera);
        const tx = (tempVec.x * 0.5 + 0.5) * width;
        const ty = (-(tempVec.y * 0.5) + 0.5) * height;
        setTableBeacon({ screenX: tx, screenY: ty, visible: tempVec.z <= 1.0 });
      } else {
        setTableBeacon(null);
      }

      // Proximity to Permit Room Bar (VIP Stool 4)
      const barStoolPos = new THREE.Vector3(1.7, 0.88, 1.1);
      const distToBar = playerGroup.position.distanceTo(barStoolPos);
      const nearB = distToBar < 2.5;
      isNearBarRef.current = nearB;
      if (nearB && seatingLocationRef.current !== 'bar') {
        tempVec.copy(barStoolPos);
        tempVec.y += 0.85;
        tempVec.project(camera);
        const bx = (tempVec.x * 0.5 + 0.5) * width;
        const by = (-(tempVec.y * 0.5) + 0.5) * height;
        setBarBeacon({ screenX: bx, screenY: by, visible: tempVec.z <= 1.0 });
      } else {
        setBarBeacon(null);
      }

      // Project 3D hotspots to 2D screen positions
      const projList = HOTSPOTS_3D.map((h) => {
        tempVec.copy(h.position);
        tempVec.project(camera);

        const x = (tempVec.x * 0.5 + 0.5) * width;
        const y = (-(tempVec.y * 0.5) + 0.5) * height;
        const isBehind = tempVec.z > 1.0;

        return {
          ...h,
          screenX: x,
          screenY: y,
          visible: !isBehind && x > 20 && x < width - 20 && y > 20 && y < height - 20,
        };
      });
      setScreenHotspots(projList);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', onResize);
      canvasElem.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvasElem.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
    };
  }, [isNightMode]);

  // Switch Camera Presets
  const handleSelectPreset = (index) => {
    setActivePreset(index);
    playClick();
    const preset = CAMERA_PRESETS[index];
    if (cameraRef.current) {
      targetLookAt.current.set(...preset.target);
      cameraRef.current.position.set(...preset.pos);
      cameraRef.current.lookAt(targetLookAt.current);
    }
  };

  const handleHotspotClick = (h) => {
    playDrawerOpen();
    onSelectHotspot(h);
  };

  const handleSitAt = (targetLoc) => {
    if (targetLoc === 'standing') {
      playClick();
      const prevLoc = seatingLocationRef.current;
      seatingLocationRef.current = 'standing';
      setSeatingLocation('standing');
      setIsSeated(false);
      isSeatedRef.current = false;
      if (playerGroupRef.current) {
        if (prevLoc === 'bar') {
          playerGroupRef.current.position.set(1.7, 0, 1.95);
        } else {
          playerGroupRef.current.position.set(0.1, 0, 4.0);
        }
        playerGroupRef.current.rotation.y = 0;
      }
      setStatusBanner('🧍 Standing in the open aisle. Use WASD / Arrows to explore the café.');
    } else if (targetLoc === 'bar') {
      playGlassClink();
      seatingLocationRef.current = 'bar';
      setSeatingLocation('bar');
      setIsSeated(true);
      isSeatedRef.current = true;
      setStatusBanner('🍸 Seated at the Permit Room Bar! Ring bell or press [C] to call Captain Sorabji for drinks & snacks.');
    } else if (targetLoc === 'table') {
      playClick();
      seatingLocationRef.current = 'table';
      setSeatingLocation('table');
      setIsSeated(true);
      isSeatedRef.current = true;
      setStatusBanner('🪑 Seated at Table 4! Ring the table bell or press [C] to call Captain Sorabji.');
    }
  };

  const handleCallWaiter = () => {
    playBell();
    if (seatingLocationRef.current === 'standing') {
      if (isNearBarRef.current) {
        handleSitAt('bar');
      } else {
        handleSitAt('table');
      }
    }
    waiterStateRef.current = 'walking_to_table';
    const locName = seatingLocationRef.current === 'bar' ? 'the Permit Room Bar' : 'Table 4';
    setStatusBanner(`🔔 Captain Sorabji heard your call and is walking to ${locName}...`);
  };

  return (
    <div className={`relative w-full max-w-6xl mx-auto rounded-2xl border transition-colors duration-500 editorial-shadow-lg overflow-hidden select-none my-3 ${
      isNightMode ? 'bg-[#180D07] border-[#D4A750]/30' : 'bg-[#EBD8C4] border-[#211C32]/20'
    }`}>
      {/* Top Controls Overlay */}
      <div className="absolute top-3.5 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Style Tag & Time Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#211C32]/90 backdrop-blur-md border border-[#D4A750]/35 rounded-full px-3.5 py-1 text-xs font-sans font-medium text-[#FFFDF8] shadow-md flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3CAFB8] animate-pulse" />
            <span className="font-fraunces font-bold text-[#E9B49F]">3D Bombay Café</span>
            <span className="text-[#3CAFB8] text-[10.5px] font-mono">• Irani Permit Room</span>
          </div>

          {/* DAY / NIGHT MODE TOGGLE BUTTON */}
          <button
            onClick={() => {
              playClick();
              onToggleTimeMode && onToggleTimeMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold border shadow-md cursor-pointer transition-all tactile-btn ${
              isNightMode
                ? 'bg-[#D4A750] text-[#211C32] border-[#D4A750]'
                : 'bg-[#211C32] text-[#FFFDF8] border-[#FFFDF8]/25 hover:bg-[#3CAFB8] hover:text-[#211C32]'
            }`}
            title={`Switch to ${isNightMode ? 'Day Mode (Natural Sunbeams)' : 'Night Mode (Atmospheric Bar Glow)'}`}
          >
            {isNightMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#211C32]" />
                <span>Night Mode Active</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Day Mode Active</span>
              </>
            )}
          </button>
        </div>

        {/* Camera Preset Quick Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto overflow-x-auto scrollbar-none bg-[#211C32]/85 backdrop-blur-md p-1 rounded-xl border border-[#FFFDF8]/15 shadow-md">
          {CAMERA_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer whitespace-nowrap ${
                activePreset === idx
                  ? 'bg-[#3CAFB8] text-[#211C32] font-bold shadow-xs'
                  : 'text-[#FFFDF8]/80 hover:bg-[#FFFDF8]/15 hover:text-[#FFFDF8]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Animated Status Banner */}
      <div className="absolute top-15 sm:top-16 left-4 right-4 z-30 pointer-events-none flex justify-center">
        <div className="max-w-xl bg-[#211C32]/94 backdrop-blur-md border border-[#D4A750]/50 rounded-full px-4 py-2 text-xs font-sans text-[#FFFDF8] shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4A750] animate-ping shrink-0" />
          <span className="text-[11.5px] leading-snug font-medium">{statusBanner}</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="relative w-full aspect-16/10 min-h-[480px] sm:min-h-[620px] overflow-hidden cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* 3D Projected Screen Hotspot Badges */}
        {screenHotspots.map((h) => {
          if (!h.visible) return null;
          const isMatching = isHotspotMatchingDiet(h);
          const isSelected = activeHotspot?.id === h.id;
          const isHovered = hoveredHotspot?.id === h.id;

          return (
            <div
              key={h.id}
              style={{
                left: `${h.screenX}px`,
                top: `${h.screenY}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-30 flex items-center justify-center pointer-events-auto"
            >
              {/* Comfortable 44px touch target */}
              <button
                onClick={() => handleHotspotClick(h)}
                onMouseEnter={() => {
                  setHoveredHotspot(h);
                  playBoop();
                }}
                onMouseLeave={() => setHoveredHotspot(null)}
                aria-label={`Open ${h.title}`}
                className={`w-11 h-11 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3CAFB8] rounded-full transition-all ${
                  isMatching ? 'opacity-100' : 'opacity-25 pointer-events-none'
                }`}
              >
                {/* Refined Circular 3D Pin */}
                <div 
                  className={`w-8 h-8 rounded-full border-2 border-[#FFFDF8] flex items-center justify-center transition-all duration-200 shadow-lg ${
                    isSelected
                      ? 'bg-[#3CAFB8] text-[#211C32] scale-115 ring-4 ring-[#3CAFB8]/50'
                      : 'bg-[#211C32] text-[#FFFDF8] hover:bg-[#3CAFB8] hover:text-[#211C32] hover:scale-110'
                  }`}
                >
                  <span className="text-sm select-none">{h.icon}</span>
                </div>
              </button>

              {/* Floating Contextual Tooltip */}
              <div 
                className={`absolute bottom-full mb-2 whitespace-nowrap px-3 py-1 rounded-lg bg-[#211C32]/95 backdrop-blur-sm border border-[#D4A750]/40 text-[#FFFDF8] text-xs font-sans font-medium tracking-tight shadow-xl transition-all duration-150 pointer-events-none z-40 ${
                  isHovered || isSelected ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                }`}
              >
                <span className="font-fraunces font-bold text-[#E9B49F]">{h.title}</span>
                <span className="text-[#3CAFB8] ml-2 text-[10.5px] font-mono">• {h.subtitle}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#211C32]" />
              </div>
            </div>
          );
        })}

        {/* 3D Dynamic Waiter Interaction Beacon */}
        {waiterBeacon && waiterBeacon.visible && (
          <div
            style={{
              left: `${waiterBeacon.screenX}px`,
              top: `${waiterBeacon.screenY}px`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute z-40 flex flex-col items-center pointer-events-auto cursor-pointer animate-bounce"
            onClick={() => {
              playBell();
              onSpeakWaiter && onSpeakWaiter();
            }}
          >
            <div className="px-3.5 py-1.5 rounded-full bg-[#D4A750] hover:bg-[#E5B860] text-[#211C32] font-sans font-bold text-xs shadow-2xl flex items-center gap-1.5 border-2 border-[#FFFDF8] transition-transform active:scale-95">
              <span>🤵</span>
              <span>Speak with Captain [E]</span>
            </div>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#D4A750]" />
          </div>
        )}

        {/* 3D Dynamic Table Sitting Beacon (when near table) */}
        {tableBeacon && tableBeacon.visible && seatingLocation !== 'table' && (
          <div
            style={{
              left: `${tableBeacon.screenX}px`,
              top: `${tableBeacon.screenY}px`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute z-40 flex flex-col items-center pointer-events-auto cursor-pointer animate-pulse"
            onClick={() => handleSitAt('table')}
          >
            <div className="px-3.5 py-1.5 rounded-full bg-[#3CAFB8] hover:bg-[#4AC0C9] text-[#211C32] font-sans font-bold text-xs shadow-2xl flex items-center gap-1.5 border-2 border-[#FFFDF8] transition-transform active:scale-95">
              <span>🪑</span>
              <span>Sit at Table 4 [T]</span>
            </div>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#3CAFB8]" />
          </div>
        )}

        {/* 3D Dynamic Bar Sitting Beacon (when near Bar VIP Stool 4) */}
        {barBeacon && barBeacon.visible && seatingLocation !== 'bar' && (
          <div
            style={{
              left: `${barBeacon.screenX}px`,
              top: `${barBeacon.screenY}px`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute z-40 flex flex-col items-center pointer-events-auto cursor-pointer animate-pulse"
            onClick={() => handleSitAt('bar')}
          >
            <div className="px-3.5 py-1.5 rounded-full bg-[#E87C28] hover:bg-[#F98C38] text-[#FFFDF8] font-sans font-bold text-xs shadow-2xl flex items-center gap-1.5 border-2 border-[#FFFDF8] transition-transform active:scale-95">
              <span>🍸</span>
              <span>Sit at Bar [B]</span>
            </div>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#E87C28]" />
          </div>
        )}

        {/* Bottom Game HUD & Controls */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Movement & Navigation Guide */}
          <div className="bg-[#211C32]/90 backdrop-blur-md border border-[#FFFDF8]/20 text-[#FFFDF8] text-[11px] font-sans px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 pointer-events-auto">
            <span className="font-mono text-[#3CAFB8] font-bold">
              {seatingLocation === 'bar' ? '🍸 Permit Room Bar' : seatingLocation === 'table' ? '🪑 Table 4 Dining' : 'WASD / Arrows'}
            </span>
            <span className="text-[#FFFDF8]/80">
              {seatingLocation !== 'standing' ? 'Press [C] or bell to call waiter' : 'to walk Diner'}
            </span>
            <span className="opacity-40">•</span>
            <button
              onClick={() => {
                playClick();
                setCameraMode((m) => (m === 'follow' ? 'free' : 'follow'));
              }}
              className="text-[#E9DDC7] hover:underline cursor-pointer font-medium"
            >
              Cam: {cameraMode === 'follow' ? 'Follow Track' : 'Free Orbit'}
            </button>
          </div>

          {/* Quick-Action Buttons */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Contextual Seating Buttons */}
            {seatingLocation === 'standing' ? (
              <>
                <button
                  onClick={() => handleSitAt('table')}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#211C32] text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Sit down at Table 4 [T or F]"
                >
                  <span>🪑</span>
                  <span>Sit at Table 4 [F]</span>
                </button>
                <button
                  onClick={() => handleSitAt('bar')}
                  className="px-3 py-1.5 rounded-xl bg-[#E87C28] hover:bg-[#F98C38] text-[#FFFDF8] text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Sit at the Permit Room Bar [B]"
                >
                  <span>🍸</span>
                  <span>Sit at Bar [B]</span>
                </button>
              </>
            ) : seatingLocation === 'table' ? (
              <>
                <button
                  onClick={() => handleSitAt('standing')}
                  className="px-3 py-1.5 rounded-xl bg-[#E9B49F] hover:bg-[#F2C2AE] text-[#211C32] text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Stand up to explore [F]"
                >
                  <span>🧍</span>
                  <span>Stand Up [F]</span>
                </button>
                <button
                  onClick={() => handleSitAt('bar')}
                  className="px-3 py-1.5 rounded-xl bg-[#211C32] hover:bg-[#E87C28] text-[#E87C28] hover:text-white border border-[#E87C28]/40 text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Switch to the Permit Room Bar Stool [B]"
                >
                  <span>🍸</span>
                  <span>Switch to Bar [B]</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSitAt('standing')}
                  className="px-3 py-1.5 rounded-xl bg-[#E9B49F] hover:bg-[#F2C2AE] text-[#211C32] text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Step down from bar stool to walk [F]"
                >
                  <span>🧍</span>
                  <span>Stand Up [F]</span>
                </button>
                <button
                  onClick={() => handleSitAt('table')}
                  className="px-3 py-1.5 rounded-xl bg-[#211C32] hover:bg-[#3CAFB8] text-[#3CAFB8] hover:text-[#211C32] border border-[#3CAFB8]/40 text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                  title="Switch to Dining Table 4 [T]"
                >
                  <span>🪑</span>
                  <span>Switch to Table [T]</span>
                </button>
              </>
            )}

            {/* Call Waiter */}
            <button
              onClick={handleCallWaiter}
              className="px-3 py-1.5 rounded-xl bg-[#D4A750] hover:bg-[#E5B860] text-[#211C32] text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              title="Call Captain Sorabji to your seat [C]"
            >
              <span>🔔</span>
              <span>Call Waiter [C]</span>
            </button>

            {/* View Table Menu */}
            <button
              onClick={() => {
                playClick();
                onOpenMenu && onOpenMenu();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#211C32] hover:bg-[#3CAFB8] text-[#FFFDF8] hover:text-[#211C32] text-xs font-sans font-bold flex items-center gap-1.5 border border-[#FFFDF8]/20 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Menu [M]</span>
            </button>

            {/* Culinary POVs */}
            <button
              onClick={() => {
                playClick();
                onOpenPov && onOpenPov('cook');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#C85226] hover:bg-[#D45E30] text-[#FFFDF8] text-xs font-sans font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Cook's POV</span>
            </button>
          </div>
        </div>

        {/* On-Screen Mobile Touch D-Pad (Visible on small screens / touch) */}
        <div className="absolute bottom-14 left-3 z-30 sm:hidden pointer-events-auto flex flex-col items-center gap-1 bg-[#211C32]/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#FFFDF8]/15 shadow-xl">
          <button
            onTouchStart={() => (touchMoveRef.current.z = -1)}
            onTouchEnd={() => (touchMoveRef.current.z = 0)}
            onMouseDown={() => (touchMoveRef.current.z = -1)}
            onMouseUp={() => (touchMoveRef.current.z = 0)}
            className="w-8 h-8 rounded-lg bg-[#FFFDF8]/20 active:bg-[#3CAFB8] flex items-center justify-center text-white"
            aria-label="Walk Forward"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onTouchStart={() => (touchMoveRef.current.x = -1)}
              onTouchEnd={() => (touchMoveRef.current.x = 0)}
              onMouseDown={() => (touchMoveRef.current.x = -1)}
              onMouseUp={() => (touchMoveRef.current.x = 0)}
              className="w-8 h-8 rounded-lg bg-[#FFFDF8]/20 active:bg-[#3CAFB8] flex items-center justify-center text-white"
              aria-label="Walk Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onTouchStart={() => (touchMoveRef.current.z = 1)}
              onTouchEnd={() => (touchMoveRef.current.z = 0)}
              onMouseDown={() => (touchMoveRef.current.z = 1)}
              onMouseUp={() => (touchMoveRef.current.z = 0)}
              className="w-8 h-8 rounded-lg bg-[#FFFDF8]/20 active:bg-[#3CAFB8] flex items-center justify-center text-white"
              aria-label="Walk Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onTouchStart={() => (touchMoveRef.current.x = 1)}
              onTouchEnd={() => (touchMoveRef.current.x = 0)}
              onMouseDown={() => (touchMoveRef.current.x = 1)}
              onMouseUp={() => (touchMoveRef.current.x = 0)}
              className="w-8 h-8 rounded-lg bg-[#FFFDF8]/20 active:bg-[#3CAFB8] flex items-center justify-center text-white"
              aria-label="Walk Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Information & Legend Bar */}
      <div className={`border-t px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans transition-colors duration-500 ${
        isNightMode ? 'bg-[#150B06] border-[#D4A750]/20 text-[#FFFDF8]/85' : 'bg-[#E3CEB8] border-[#211C32]/12 text-[#211C32]'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3CAFB8]" />
            <span className="text-[#3CAFB8] font-bold">Interactive Diner Avatar</span> in the Permit Room
          </span>
          <span className="hidden sm:inline text-current opacity-30">•</span>
          <span className="hidden sm:inline">
            Walk up to Captain Sorabji or the marble table to order dishes and hear culinary secrets!
          </span>
        </div>
        <div className="text-[11.5px] font-mono font-medium text-[#BA5836]">
          Tip: [B] Bar Stool • [T] Table 4 • [F] Sit/Stand • [C] Call Captain • [M] Menu
        </div>
      </div>
    </div>
  );
}
