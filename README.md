# DISHOOM: From Page to Plate ☕✨
### Modern Indian Café × Interactive Lookbook & 3D Culinary Experience

> *"From Page to Plate — An Interactive Café Experience"*  
> Inspired by the food, heritage, and atmosphere of traditional Bombay Irani cafés and Permit Rooms.

---

## 🌟 Highlights & Key Features

* **3D Bombay Café Permit Room**: Fully interactive 3D WebGL café environment with teak wood booths, fluted turquoise leather banquettes, backlit spirits arches, rotating ceiling fans, and vintage Crittall windows.
* **Atmospheric Day & Night Lighting Modes**:
  * **Day Mode**: Warm volumetric sunbeams pouring through tall south-facing Crittall windows.
  * **Night Mode**: Intimate amber tavern glow with warm bar accents and deep evening shadows.
* **Interactive Seating & Dining**:
  * **Table 4 Dining**: Settle into marble tables with vintage chairs (`[T]`).
  * **Permit Room Bar Stools**: Sit at VIP Stool 4 along the mahogany bar counter (`[B]`).
  * **Standing Locomotion**: Walk your diner avatar freely through open aisles with WASD/arrow keys and solid obstacle collision detection (`[F]`).
* **Autonomous Waiter AI & Cloche Service**:
  * Summon **Captain Sorabji** with the table bell or key `[C]`.
  * Sorabji pathfinds across the floor to your seat, takes your order, walks to the tandoor pass, and returns with dishes under a silver cloche.
  * Steaming 3D dishes (Masala Chai in fluted glass, House Black Daal, Bacon Naan Roll, etc.) are plated directly before you.
* **Culinary POVs & Recipe Stories**:
  * **Cook's POV**: Hearth-side view of the tandoor, spices, and Chef Naved's cooking secrets.
  * **Waiter's POV**: Service ticket (KOT), brass tray presentation, and vintage etiquette.
  * **Editorial Recipe Drawer**: Ingredient checkboxes, cultural origins, prep/cook timings, and "Add to My Cookbook".
* **Personal Cookbook & Recipe Index**: Save personal favorites, filter by dietary requirements (Veg, Non-Veg, Vegan, Gluten-Free), and search the menu.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
* **3D Graphics & Physics**: [Three.js](https://threejs.org/) (WebGL scenes, custom shaders, volumetric sunbeams, particle steam systems)
* **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) with editorial print typography (Fraunces, DM Sans, IBM Plex Mono)
* **Sound Design**: Synthesized Web Audio API (crystal glass clinks, service bells, hearth sizzles, tactile clicks)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/solequest/dishoom-interactive-cookbook.git

# Enter project directory
cd dishoom-interactive-cookbook

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 📜 Keyboard & Interaction Guide

| Key | Action |
| :---: | :--- |
| **`W A S D`** / **Arrows** | Walk Diner avatar around the café floor |
| **`B`** | Sit at the Permit Room Bar stool |
| **`T`** | Sit at Table 4 |
| **`F`** | Contextual Sit / Stand toggle |
| **`C`** | Call Captain Sorabji (service bell) |
| **`M`** or **`Space`** | Open Table Menu |
| **`E`** | Speak with Captain Sorabji when nearby |

---

## 📄 License

ISC License. Inspired by the Dishoom Bombay Café aesthetic and cookbook.

