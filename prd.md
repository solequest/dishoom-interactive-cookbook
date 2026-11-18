# PRD: Dishoom, From Page to Plate (Interactive Lookbook Website)

Status: draft v0.1. Related: `design-doc.md`, `text.md`.

## 1. Overview

An interactive lookbook website inspired by the cookbook *Dishoom: From Bombay with Love*. The homepage is an illustrated café that people explore to discover recipes, filter by diet and meal time, and collect favourites. Optional AR and VR features let people view dishes on their own table or step inside the café.

This is a college communication design project, so the priority is a polished, working, small experience over a large unfinished one.

## 2. Problem and opportunity

Cookbooks and recipe sites are usually long lists to scroll. Readers lose the sense of place and story that makes this book special. There is an opportunity to turn browsing a cookbook into something spatial and playful, where the user discovers recipes by exploring a café.

## 3. Goals

1. Make recipe discovery feel like exploring a place, with little scrolling.
2. Let users find recipes quickly by diet (veg, egg, non-veg) and meal time.
3. Show a distinctive, art-directed illustrated visual identity.
4. Demonstrate working interaction, plus one AR or 3D/VR enhancement.

## 4. Non-goals

- Reproducing the book's recipe text, photos or illustrations.
- A full copy of every recipe (about 113 exist; the MVP covers a small selection).
- Accounts, payments, or a backend database.
- A native app, or a full Unity game on the website.

## 5. Users

| Persona | Needs |
|---|---|
| Curious browser (primary) | Understands the site at once, finds something appealing fast |
| Home cook | Filters by diet and meal, wants a clear overview before opening the book |
| Design reviewer (tutors, college) | Sees strong visual thinking and working interaction |

## 6. Scope

### MVP (must have)
1. **Homepage café scene** with 6 to 8 hotspots.
2. **Zone drawer** listing recipes for the chosen meal section.
3. **Filters:** diet (Veg, Egg, Non-veg) and meal section.
4. **Recipe card** for 10 to 12 starter recipes (own-words description, book page reference).
5. **My Cookbook:** collect a recipe, view collected cards (session only).
6. **List view** alternative for accessibility.
7. **About and credits** page with clear attribution to the book.
8. Responsive on phone, tablet and desktop.

### Should have
9. **Step Inside:** 3D café with 360° look and a walking chef (prototype exists).
10. **AR dish viewer** for 3 dishes.
11. Ambient audio toggle and UI sounds.

### Could have
12. **WebXR VR mode** for headsets.
13. Persistent saving of the cookbook across visits.
14. Tour mode led by the chef character.

## 7. User stories

- As a visitor, I tap the teapot and see afternoon drinks and snacks, so I discover recipes without scrolling.
- As a vegetarian, I choose "Veg" and only matching recipes appear, so I don't have to read everything.
- As a cook, I choose "Dinner" and compare options at a glance.
- As a user, I add a recipe to my cookbook and find it again later in the same visit.
- As a phone user, I view a dish on my table in AR to see its size and look.
- As a keyboard or screen-reader user, I switch to list view and still reach everything.

## 8. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| F1 | Homepage shows a fixed-viewport illustrated café with labelled, focusable hotspots | Must |
| F2 | Selecting a hotspot opens a drawer with the matching meal section's recipes | Must |
| F3 | Diet filter (Veg / Egg / Non-veg / All) updates scene dimming and lists | Must |
| F4 | Meal-section filter focuses the scene and filters lists | Must |
| F5 | Recipe card shows image, name, diet tag, section, description, book page reference | Must |
| F6 | "Add to my cookbook" saves for the session; My Cookbook shows collected cards, locked ones as "?" | Must |
| F7 | List view toggle provides all recipes with the same filters | Must |
| F8 | Alcohol-containing recipes carry a flag and an age-aware note | Must |
| F9 | Step Inside opens a 3D café with drag-to-look, click-to-move chef | Should |
| F10 | AR button appears only where a model exists and the device supports AR | Should |
| F11 | VR entry button appears only on WebXR-capable devices | Could |

## 9. Content requirements

- **Source:** recipe names and page references come from the book's index. Descriptions are written in the student's own words.
- **No copying:** no recipe method text, quantities or photos from the book. Link to or credit the book for those.
- **Diet tagging:** every recipe is tagged Veg, Egg or Non-veg by checking the recipe itself; unverified tags are marked `[verify]`.
- **Cultural and historical notes:** only include facts that have been checked against the book.
- **Starter set:** Masala chai, Bacon naan roll, House black daal, Kejriwal, Chole bhature, Mattar paneer, Fresh lime soda, Falooda, Bhel, Gulab jamun, Pau bhaji, plus one more.

## 10. Non-functional requirements

- **Performance:** initial load under 3 seconds on a mid-range phone; 3D, AR and audio load on demand.
- **Compatibility:** latest two versions of Chrome, Safari, Edge and Firefox; AR on supported iOS and Android devices; VR on Meta Quest browser.
- **Accessibility:** keyboard navigation, aria labels, 4.5:1 contrast, reduced-motion support.
- **Privacy:** no accounts, no tracking beyond basic analytics (if any); session data stays in the browser.

## 11. Success measures (college context)

- 5 out of 5 test users can open a recipe within 10 seconds without help.
- 5 out of 5 can apply the Veg filter correctly.
- At least 4 out of 5 describe the experience as "clear" and "fun" in short feedback.
- A full walkthrough video shows entry, filter, recipe, collect, and one AR or 3D moment.

## 12. Milestones

| Phase | Deliverable |
|---|---|
| 1 | Moodboard, IA, wireframes, hotspot map |
| 2 | Illustrated café scene and recipe card designs |
| 3 | Working homepage with hotspots, drawer, filters (12 recipes) |
| 4 | My Cookbook and list view; usability test round 1 |
| 5 | Step Inside 3D café; AR viewer for 3 dishes |
| 6 | Polish (motion, audio, accessibility) and test round 2 |
| 7 | Walkthrough video, screenshots, case-study write-up |

## 13. Risks

| Risk | Mitigation |
|---|---|
| Copyright issues with the book | Own-words text, own illustrations, clear credit, page references only |
| Scope too large | Build the MVP first; treat VR as optional |
| 3D heavy on phones | Plain 2D default; 3D loads on request |
| Wrong diet tags | Verify each tag against the recipe |
| Illustration workload | Reuse layers and objects; start with 10 to 12 recipes |
| AR device support varies | Show a fallback image gallery |

## 14. Open questions

1. Design tool (Framer, Webflow, Spline) or code? Decide before Phase 3.
2. Which headset or devices will be used for AR and VR testing?
3. Final starter recipe list and diet tags.
4. How should alcohol-containing recipes be handled in a college setting?
5. Is the website the main deliverable, with the Unity VR prototype as a companion, or the reverse?
