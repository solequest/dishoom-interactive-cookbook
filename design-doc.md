# Design Doc: Dishoom, From Page to Plate (Website)

Status: draft v0.1. Owner: communication design student project. Companion files: `prd.md`, `text.md`.

## 1. Design intent

A lookbook website where the **homepage is an interactive illustrated café**. People discover recipes by tapping objects in the scene, not by scrolling a list. It should feel warm, tactile, nostalgic, playful and editorial, like stepping inside the cookbook.

### Principles

1. **One screen, little scrolling.** The homepage is a fixed viewport. Detail opens in drawers, never in long pages.
2. **Everything is visible and tappable.** Every interactive object signals that it is interactive (glow, wobble, label on hover or tap).
3. **Obvious in five seconds.** A first-time visitor should understand: "tap things in the café to find recipes."
4. **Flat and illustrated.** Colour planes and chunky shapes, not realism.
5. **Graceful fallback.** The 2D scene works everywhere. 3D, AR and VR are enhancements.

## 2. References (what we take, what we don't)

| Reference | Take | Don't take |
|---|---|---|
| 100seatsofindia.com/interactive (book-companion site) | Interactive browsing of a book's contents with little scrolling | Its layout, graphics or code |
| A café site template the user likes (Webild link; design not reviewed) | Soft, aesthetic, café feel | Its layout, graphics or code |
| Equal Parts kitchen illustration (user's reference image) | Flat planes, chunky type, layered counters, tiny chef (not its colours) | Its actual artwork or palette; redraw everything |
| Dishoom book cover | Aqua blue, navy, beige, fine line illustration | Its artwork; draw your own |

Note: the two websites were not visually reviewed (they render with JavaScript). Add screenshots to `/design/references` and update this table.

## 3. Visual language

### Palette: blue and beige, taken from the book's cover

The cover is a bright aqua blue with a deep navy spine, a blush-peach title and fine teal line illustration. The values below were sampled from the cover (peach is estimated by eye; confirm all with a colour-picker on your own copy).

| Role | Hex | Use |
|---|---|---|
| Cover aqua (primary blue) | `#74C7D5` | Main counter, buttons, large colour planes |
| Deep navy (spine) | `#1C182F` | Text, outlines, dark cookware |
| Ink teal | `#487A87` | Line illustration, icons, secondary text |
| Pale aqua | `#CDEBEF` | Tints, hover states, window light |
| Cream paper | `#F1E6D3` | Recipe cards, panels, page background |
| Warm beige wall | `#E8DCC6` | Walls, floor, base |
| Sand beige | `#D9C7A8` | Tile lines, counters, shelves |
| Blush peach (title accent) | `#E8B9A0` | Logo highlight, small accents, selected state |

Rules:
- Two families only: blues and beiges. Use blush peach sparingly, as a single warm accent.
- Avoid neon, high gloss and heavy saturation. Keep flat colour planes with fine line detail, like the cover illustration.
- Text is navy on cream or beige (about 14:1 contrast). Navy on aqua also passes. Do not put white text on aqua; it fails contrast.
- Diet tags must not rely on colour alone (use text plus an icon), so no green or red coding is needed.

### Typography (free Google Fonts; confirm licences)

- Display: **Shrikhand** (or Bagel Fat One). Colour the logo in navy with a blush-peach highlight (or alternate navy and ink teal letters).
- Body and UI: **Space Mono** (or DM Mono).
- Minimum body size 16 px on mobile; buttons at least 44 px tall.

### Shape and texture

- Rounded rectangles, thick muted borders, flat buttons with a hard offset shadow.
- Subtle paper grain over everything; slightly imperfect edges.
- Layered parallax depth (wall, counter, island) for a pop-up-book feel.

## 4. Information architecture

```
Home (café scene)
├── Zone drawer (per hotspot): list of recipes in that meal section
│   └── Recipe card / detail
├── Filter bar: Diet (Veg / Egg / Non-veg) + Meal section
├── My Cookbook (collected recipes)
├── Step Inside (3D café, enhancement)
├── View on your table (AR, per dish)
└── About and credits
```

### Meal sections (mirror the book's chapters)

Breakfast, Mid-morning snacks, Lunch, Afternoon refreshments, Sunset snacks, Dinner (three sub-chapters), Pudding, Drinks (including alcoholic, age-flagged), Basics (masalas, breads, chutneys).

## 5. Homepage layout

```
+----------------------------------------------------------+
| [logo]  DISHOOM  FROM PAGE TO PLATE    [Filters] [Cookbook]|
|  hanging pans/rail     shelf + pot + plant                |
|  [tiles ......................................... ]       |
|  [STOVE ]  [ PINK COUNTER ]   [PASTRY SHELF]  [WINDOW]    |
|            [ BLUE ISLAND: teapot  plate  saucepan ]       |
|  (tiny chef walks along the counter)                      |
|  [ Step inside ]   [ Veg | Egg | Non-veg ]                |
+----------------------------------------------------------+
```

### Hotspot map

| Hotspot | Opens | Idle cue |
|---|---|---|
| Window | Breakfast | Light shimmer |
| Pastry shelf | Mid-morning snacks | Small bounce |
| Counter | Lunch | Glow |
| Teapot | Afternoon refreshments | Steam |
| Street cart | Sunset snacks | Flicker |
| Stove | Dinner | Rising steam |
| Dessert cabinet | Pudding | Sparkle |
| Cookbook on wall | My Cookbook | Page flutter |
| Tiny chef | Tour / "What's good today?" | Walks and waves |

## 6. Interaction specs

### Hotspot
- Hover or focus: scale 1.06, outline, tooltip label. Tap on mobile shows the label, a second tap opens.
- Open: object bounces once (200 ms), the drawer slides in (300 ms ease-out).

### Drawer
- Right side on desktop (about 420 px), bottom sheet on mobile.
- Header: meal section name, close button, small illustration.
- Body: recipe cards in a vertical list; each shows illustration, name, diet tag, time of day.
- The café stays visible and slightly dimmed behind it.

### Filters
- Diet toggle (Veg / Egg / Non-veg): non-matching hotspots dim and cards hide. An "All" state is the default.
- Meal section chips scroll the scene's focus to that zone.
- Filter state persists during the session and shows a count ("12 recipes").

### Recipe card
- Illustration, name, diet tag, section, short description (own words), book page reference, "Add to my cookbook", "View on your table (AR)" when a model exists.
- Do not reproduce the book's recipe text.

### My Cookbook
- Wall of collectible cards; locked ones show "?". Collected state saves for the session (local storage later).

### Motion
Short and intentional (150 to 400 ms). Ambient motion only on a few objects (steam, chef). Respect `prefers-reduced-motion`: turn off parallax and ambient loops.

### Audio
Off by default. Optional ambience toggle. Small UI sounds only after a user gesture.

## 7. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| Desktop (1024+) | Full scene, right drawer |
| Tablet | Scene scales, drawer 50% width |
| Mobile | Scene pans horizontally (swipe), bottom-sheet drawer, large tap targets |

## 8. 3D, AR and VR

- **Step Inside (3D café):** same palette, flat materials, drag to look 360°, click floor or WASD to move the chef. A working desktop prototype exists (`dishoom-page-to-plate.html`).
- **AR dish viewer:** one small GLB per dish, viewed via `<model-viewer>` with the AR attribute. Target under 3 MB per model.
- **VR (optional, last):** WebXR mode for headsets, stationary and seated, comfort first. A separate Unity prototype covers the college VR brief.
- The 2D scene is the default; 3D loads only on request.

## 9. Accessibility

- Every hotspot is a real button with an `aria-label` and keyboard focus order.
- A "list view" toggle shows all recipes as a plain list, with the same filters.
- Colour is never the only signal (diet tags use text plus an icon).
- Contrast at least 4.5:1 for body text.

## 10. Assets to produce

1. Café scene illustration, split into layers (wall, counters, objects, chef).
2. Hotspot object illustrations (about 8).
3. Recipe card illustrations (start with 10 to 12).
4. Diet tag icons (veg, egg, non-veg), meal section icons.
5. Logo lockup with multicolour letters.
6. 3D models for AR (start with 3 dishes).
7. Audio: ambience loop and 4 to 5 UI sounds (check licences).

## 11. Technical approach (options)

| Approach | Pros | Cons |
|---|---|---|
| Design tool (Framer, Webflow, Spline) | Fast, designer-friendly, good motion | Less control, 3D and AR can be limited |
| Code (HTML/CSS/JS, three.js, model-viewer) | Full control, WebXR possible | More work, needs debugging |

Recommendation: prototype the scene and drawer in a design tool for feel, and use code for the 3D, AR and VR parts if time allows. Final choice is open (see PRD).

## 12. QA checklist

- [ ] Every hotspot opens the right drawer.
- [ ] Filters hide and dim correctly; counts update.
- [ ] Works at 375 px, 768 px and 1440 px widths.
- [ ] Keyboard-only navigation works; list view works.
- [ ] Reduced-motion setting respected.
- [ ] Page loads in under 3 seconds on a mid-range phone.
- [ ] No book text copied; every recipe has a book page reference.
- [ ] AR opens on a supported phone; a fallback shows otherwise.
