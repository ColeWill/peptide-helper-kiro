# Design Document — React Implementation

## 1. Overview

This spec produces a fully runnable single-page application (SPA) built with **Vite + React + TypeScript + SCSS**. The output is a complete project that can be started immediately with `npm install && npm run dev`. It faithfully reproduces the approved design system from `/design-mockups/` — dark health-tech aesthetic, deep green/blue palette, Inter typeface, CSS custom properties — as interactive React components with live search, tag filtering, client-side routing, and responsive layout across mobile (< 768 px) and desktop (≥ 768 px) viewports.

No backend or network requests are required. All peptide data is served from the static JSON file at `src/data/peptides.json` via a typed React context. The application exposes four route areas: public Explore page (`/`), Peptide Detail page (`/peptide/:id`), Agent Insights internal page (`/agent-insights`), and Completed Specs internal page (`/completed-specs`).

---

## 2. Technology Stack

All versions are pinned exactly as specified.

| Package            | Version   | Role                    |
| ------------------ | --------- | ----------------------- |
| `react`            | `18.3.1`  | UI library              |
| `react-dom`        | `18.3.1`  | DOM renderer            |
| `react-router-dom` | `6.26.2`  | Client-side routing     |
| `vite`             | `5.4.10`  | Build tool / dev server |
| `sass`             | `1.80.3`  | SCSS compilation        |
| `@types/react`     | `18.3.12` | TypeScript types        |
| `@types/react-dom` | `18.3.1`  | TypeScript types        |
| `typescript`       | `5.6.3`   | Type checking           |

### `package.json` shape

```json
{
  "name": "peptide-helper",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.26.2"
  },
  "devDependencies": {
    "@types/react": "18.3.12",
    "@types/react-dom": "18.3.1",
    "sass": "1.80.3",
    "typescript": "5.6.3",
    "vite": "5.4.10",
    "@vitejs/plugin-react": "4.3.3"
  }
}
```

### `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // root defaults to project root; build output goes to dist/
});
```

### `tsconfig.json` (strict mode required)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

## 3. Project File Structure

Every file that will be created is listed here. This is the authoritative directory tree.

```
peptide-helper-kiro/
├── index.html                          # Vite entry HTML — <div id="root">
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── src/
    ├── main.tsx                        # ReactDOM.createRoot mount
    ├── App.tsx                         # BrowserRouter + Routes + Layout
    │
    ├── styles/
    │   ├── _variables.scss             # All SCSS variables / design tokens
    │   └── global.scss                 # :root block, reset, body, @import Inter
    │
    ├── types/
    │   └── peptide.ts                  # Peptide interface, PeptideTag union
    │
    ├── data/
    │   ├── peptides.json               # (existing) — static import source
    │   ├── agentData.ts                # Agent mock data + TypeScript interfaces
    │   └── specsData.ts                # Specs/prompts mock data + interfaces
    │
    ├── context/
    │   └── PeptideContext.tsx          # createContext, PeptideProvider, usePeptides hook
    │
    ├── components/
    │   ├── Nav/
    │   │   ├── Nav.tsx
    │   │   └── Nav.module.scss
    │   ├── InternalBanner/
    │   │   ├── InternalBanner.tsx
    │   │   └── InternalBanner.module.scss
    │   ├── TagBadge/
    │   │   ├── TagBadge.tsx
    │   │   └── TagBadge.module.scss
    │   ├── PeptideCard/
    │   │   ├── PeptideCard.tsx
    │   │   └── PeptideCard.module.scss
    │   ├── FilterBar/
    │   │   ├── FilterBar.tsx
    │   │   └── FilterBar.module.scss
    │   ├── SearchBar/
    │   │   ├── SearchBar.tsx
    │   │   └── SearchBar.module.scss
    │   ├── DetailModal/
    │   │   ├── DetailModal.tsx
    │   │   └── DetailModal.module.scss
    │   └── Layout/
    │       ├── Layout.tsx              # <Nav> + <Outlet>
    │       └── Layout.module.scss
    │
    └── pages/
        ├── Explore/
        │   ├── ExplorePage.tsx
        │   └── ExplorePage.module.scss
        ├── Detail/
        │   ├── DetailPage.tsx
        │   └── DetailPage.module.scss
        ├── AgentInsights/
        │   ├── AgentInsightsPage.tsx
        │   ├── AgentFlowchart.tsx      # Inline SVG flowchart sub-component
        │   ├── NodeDetailPanel.tsx     # Agent detail panel sub-component
        │   └── AgentInsightsPage.module.scss
        └── CompletedSpecs/
            ├── CompletedSpecsPage.tsx
            └── CompletedSpecsPage.module.scss
```

---

## 4. Design System (SCSS)

### 4.1 `src/styles/_variables.scss`

All token values are taken verbatim from the `:root` block in `/design-mockups/index.html`.

```scss
// ============================================================
// COLOURS
// ============================================================
$color-bg-primary: #0a1628;
$color-bg-secondary: #0d2b1e;
$color-bg-card: #0f1f35;
$color-bg-modal: #0d1e30;
$color-accent: #1db954;
$color-accent-hover: #17a349;
$color-blue-mid: #1a3a5c;
$color-blue-bright: #4a9eff;
$color-text-primary: #f0f4f0;
$color-text-secondary: #a0b0a8;
$color-border: #1e3a52;
$color-overlay: rgba(0, 0, 0, 0.75);
$color-amber: #f59e0b;
$color-amber-bg: rgba(245, 158, 11, 0.12);

// ============================================================
// TAG COLOURS
// ============================================================
$tag-fat-loss: #e85d04;
$tag-anti-aging: #7b2d8b;
$tag-youthful-skin: #0077b6;
$tag-muscle-recovery: #1db954;

// ============================================================
// TYPOGRAPHY
// ============================================================
$font-family: "Inter", system-ui, sans-serif;
$font-size-label: 12px;
$font-size-body: 16px;
$font-size-heading-sm: 20px;
$font-size-heading-lg: 36px;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// ============================================================
// SPACING
// ============================================================
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-6: 24px;
$space-8: 32px;
$space-12: 48px;
$space-16: 64px;

// ============================================================
// RADII
// ============================================================
$radius-sm: 4px;
$radius-md: 8px;
$radius-pill: 9999px;

// ============================================================
// SHADOWS
// ============================================================
$shadow-card: 0 4px 20px rgba(0, 0, 0, 0.4);
$shadow-modal: 0 24px 80px rgba(0, 0, 0, 0.7);
```

### 4.2 `src/styles/global.scss`

`global.scss` is imported once in `src/main.tsx`. It declares the `:root` CSS custom properties block (identical to the approved mockup) alongside the CSS reset, body styles, and Inter font import.

```scss
@use "./variables" as *;

// Google Fonts — Inter
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

// ============================================================
// :root — CSS custom properties (mirrors approved mockup :root)
// ============================================================
:root {
  // Colours
  --color-bg-primary: #{$color-bg-primary};
  --color-bg-secondary: #{$color-bg-secondary};
  --color-bg-card: #{$color-bg-card};
  --color-bg-modal: #{$color-bg-modal};
  --color-accent: #{$color-accent};
  --color-accent-hover: #{$color-accent-hover};
  --color-blue-mid: #{$color-blue-mid};
  --color-blue-bright: #{$color-blue-bright};
  --color-text-primary: #{$color-text-primary};
  --color-text-secondary: #{$color-text-secondary};
  --color-border: #{$color-border};
  --color-overlay: #{$color-overlay};
  --color-amber: #{$color-amber};
  --color-amber-bg: #{$color-amber-bg};
  // Tag colours
  --tag-fat-loss: #{$tag-fat-loss};
  --tag-anti-aging: #{$tag-anti-aging};
  --tag-youthful-skin: #{$tag-youthful-skin};
  --tag-muscle-recovery: #{$tag-muscle-recovery};
  // Typography
  --font-family: #{$font-family};
  --font-size-label: #{$font-size-label};
  --font-size-body: #{$font-size-body};
  --font-size-heading-sm: #{$font-size-heading-sm};
  --font-size-heading-lg: #{$font-size-heading-lg};
  --font-weight-normal: #{$font-weight-normal};
  --font-weight-medium: #{$font-weight-medium};
  --font-weight-semibold: #{$font-weight-semibold};
  --font-weight-bold: #{$font-weight-bold};
  // Spacing
  --space-1: #{$space-1};
  --space-2: #{$space-2};
  --space-3: #{$space-3};
  --space-4: #{$space-4};
  --space-6: #{$space-6};
  --space-8: #{$space-8};
  --space-12: #{$space-12};
  --space-16: #{$space-16};
  // Radii
  --radius-sm: #{$radius-sm};
  --radius-md: #{$radius-md};
  --radius-pill: #{$radius-pill};
  // Shadows
  --shadow-card: #{$shadow-card};
  --shadow-modal: #{$shadow-modal};
}

// ============================================================
// RESET
// ============================================================
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  scroll-behavior: smooth;
}

// ============================================================
// BASE
// ============================================================
body {
  font-family: var(--font-family);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  min-height: 100vh;
  line-height: 1.6;
}
img {
  display: block;
  max-width: 100%;
}
button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}
a {
  color: inherit;
  text-decoration: none;
}
```

### 4.3 Responsive mixin (`_variables.scss` or a `_mixins.scss` partial)

All mobile breakpoint rules use this single mixin. Desktop-first — the base styles target desktop and the mixin overrides for mobile.

```scss
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}
```

Usage in component SCSS modules:

```scss
@use "../../styles/variables" as *;

.hero-title {
  font-size: var(--font-size-heading-lg);

  @include mobile {
    font-size: var(--font-size-heading-sm);
  }
}
```

---

## 5. Data Layer

### 5.1 `src/types/peptide.ts`

```ts
export type PeptideTag =
  | "Fat Loss"
  | "Anti-Aging"
  | "Youthful Skin"
  | "Muscle Recovery";

export interface Peptide {
  id: string;
  name: string;
  tags: PeptideTag[];
  shortDescription: string;
  benefits: string[];
  imagePlaceholderUrl: string;
  researchNotes: string[];
  suggestedDosage: string;
}
```

### 5.2 `src/context/PeptideContext.tsx`

```ts
import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Peptide } from '../types/peptide';
import peptidesJson from '../data/peptides.json';

const peptides = peptidesJson as Peptide[];

interface PeptideContextValue {
  peptides: Peptide[];
  filteredPeptides: Peptide[];
  activeFilter: string;
  searchQuery: string;
  setActiveFilter: (tag: string) => void;
  setSearchQuery: (query: string) => void;
}

const PeptideContext = createContext<PeptideContextValue | null>(null);

export function PeptideProvider({ children }: { children: React.ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPeptides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return peptides.filter((p) => {
      const matchesTag =
        activeFilter === 'All' || p.tags.includes(activeFilter as Peptide['tags'][number]);
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      return matchesTag && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <PeptideContext.Provider
      value={{ peptides, filteredPeptides, activeFilter, searchQuery, setActiveFilter, setSearchQuery }}
    >
      {children}
    </PeptideContext.Provider>
  );
}

export function usePeptides(): PeptideContextValue {
  const ctx = useContext(PeptideContext);
  if (!ctx) throw new Error('usePeptides must be used inside PeptideProvider');
  return ctx;
}
```

Key implementation notes:

- `filteredPeptides` is derived entirely via `useMemo` — no separate state needed.
- `peptides.json` is imported as a static ES module and cast to `Peptide[]`. No `fetch()` is used.
- `PeptideProvider` wraps the entire app in `main.tsx` (inside `<BrowserRouter>`, outside `<Routes>`).

---

## 6. Routing

### 6.1 `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PeptideProvider } from "./context/PeptideContext";
import App from "./App";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PeptideProvider>
        <App />
      </PeptideProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

### 6.2 `src/App.tsx`

```tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ExplorePage from "./pages/Explore/ExplorePage";
import DetailPage from "./pages/Detail/DetailPage";
import AgentInsightsPage from "./pages/AgentInsights/AgentInsightsPage";
import CompletedSpecsPage from "./pages/CompletedSpecs/CompletedSpecsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/peptide/:id" element={<DetailPage />} />
        <Route path="/agent-insights" element={<AgentInsightsPage />} />
        <Route path="/completed-specs" element={<CompletedSpecsPage />} />
      </Route>
    </Routes>
  );
}
```

### 6.3 `src/components/Layout/Layout.tsx`

```tsx
import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav";

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
```

The `InternalBanner` is rendered inside `AgentInsightsPage` and `CompletedSpecsPage` themselves (above the page header), not in `Layout`, so it only appears on those routes.

### 6.4 Route summary

| Path               | Component            | Notes                                    |
| ------------------ | -------------------- | ---------------------------------------- |
| `/`                | `ExplorePage`        | Public — hero, filters, card grid, modal |
| `/peptide/:id`     | `DetailPage`         | Public — full peptide detail             |
| `/agent-insights`  | `AgentInsightsPage`  | Internal — banner + flowchart            |
| `/completed-specs` | `CompletedSpecsPage` | Internal — banner + specs table          |

---

## 7. Component Breakdown

Each component lives in its own file. SCSS is co-located as a CSS Module (`*.module.scss`). No hardcoded colour, size, or spacing values appear in component SCSS — only `var(--...)` references or `@use '../../styles/variables' as *` SCSS variables.

---

### 7.1 `src/components/Nav/Nav.tsx`

**Props:** none (reads route from React Router internally)

```ts
// No props — uses useLocation() from react-router-dom
```

**Description:**
Sticky navigation bar rendered on every route via `<Layout>`. The logo reads "Peptide" (in `var(--color-accent)`) + "Helper" (in `var(--color-text-primary)`). Navigation links use React Router's `<NavLink>` with an `isActive` callback to apply `color: var(--color-accent)` to the matching route. On mobile (< 768 px) the `.nav-links` container is `display: none`.

Key styles (from approved mockup):

- `position: sticky; top: 0; z-index: 100`
- `background: rgba(10, 22, 40, 0.92); backdrop-filter: blur(12px)`
- `border-bottom: 1px solid var(--color-border)`
- `padding: var(--space-4) var(--space-8)`
- Nav link font: `font-size: var(--font-size-label); font-weight: var(--font-weight-medium); text-transform: uppercase; letter-spacing: 0.08em`

---

### 7.2 `src/components/InternalBanner/InternalBanner.tsx`

**Props:** none

**Description:**
Amber warning banner reading `⚠ Internal Tool — Not part of the public app`. Rendered at the very top of `AgentInsightsPage` and `CompletedSpecsPage` (before the page header section, not inside `<Layout>`).

Key styles (from approved mockups):

- `background: var(--color-amber-bg); border-bottom: 1px solid var(--color-amber)`
- `padding: var(--space-2) var(--space-8); text-align: center`
- `font-size: var(--font-size-label); font-weight: var(--font-weight-semibold); color: var(--color-amber); letter-spacing: 0.06em`

---

### 7.3 `src/components/TagBadge/TagBadge.tsx`

**Props:**

```ts
interface TagBadgeProps {
  tag: PeptideTag;
}
```

**Description:**
Coloured pill badge for a single `PeptideTag`. Applies one of four background colours based on the tag value. Used inside `PeptideCard` and `DetailModal`/`DetailPage`.

Tag → colour mapping (from approved mockup `:root`):

- `'Fat Loss'` → `var(--tag-fat-loss)` (#e85d04) — white text
- `'Anti-Aging'` → `var(--tag-anti-aging)` (#7b2d8b) — white text
- `'Youthful Skin'` → `var(--tag-youthful-skin)` (#0077b6) — white text
- `'Muscle Recovery'` → `var(--tag-muscle-recovery)` (#1db954) — `var(--color-bg-primary)` text (dark)

Base tag styles: `font-size: 10px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.06em; padding: 3px var(--space-2); border-radius: var(--radius-pill); color: #fff`

---

### 7.4 `src/components/PeptideCard/PeptideCard.tsx`

**Props:**

```ts
interface PeptideCardProps {
  peptide: Peptide;
  onClick: (peptide: Peptide) => void;
}
```

**Description:**
Clickable card tile for the Explore page grid. Renders the peptide image (`<img>` at 180 px height, `object-fit: cover`), name as heading, `shortDescription` as secondary text, and `<TagBadge>` components for each tag in `tags[]`.

Hover state (desktop only): `transform: translateY(-4px); box-shadow: var(--shadow-card); border-color: var(--color-accent)`

Card structure:

```
.card (background: var(--color-bg-card), border: 1px solid var(--color-border), border-radius: var(--radius-md))
  ├── <img> 180px height
  └── .card-body (padding: var(--space-4), flex-direction: column)
        ├── .card-name (font-size: var(--font-size-heading-sm), font-weight: bold)
        ├── .card-tagline (font-size: var(--font-size-label), color: var(--color-text-secondary))
        └── .card-tags (flex-wrap, gap: var(--space-1)) → <TagBadge> ×N
```

---

### 7.5 `src/components/FilterBar/FilterBar.tsx`

**Props:**

```ts
interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}
```

**Description:**
Row of 5 pill buttons: "All", "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery". Active button has `background: var(--color-accent); border-color: var(--color-accent); color: var(--color-bg-primary)`. Inactive buttons: `background: transparent; border: 1.5px solid var(--color-border); color: var(--color-text-primary)`. On mobile: `justify-content: flex-start; overflow-x: auto; scrollbar-width: none`. On desktop: `justify-content: center`.

---

### 7.6 `src/components/SearchBar/SearchBar.tsx`

**Props:**

```ts
interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

**Description:**
Search input with an absolutely-positioned magnifying glass SVG icon on the left. Input has `background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-pill); padding: var(--space-3) var(--space-4) var(--space-3) 44px`. On focus: `border-color: var(--color-accent)`. Max width 480 px, centred with `margin: 0 auto var(--space-4)`.

---

### 7.7 `src/components/DetailModal/DetailModal.tsx`

**Props:**

```ts
interface DetailModalProps {
  peptide: Peptide | null; // null = closed
  onClose: () => void;
}
```

**Description:**
Fixed overlay modal displayed on desktop (≥ 768 px) when a card is clicked from `ExplorePage`. When `peptide` is `null` the modal does not render (returns null). When open, it renders with `position: fixed; inset: 0; z-index: 200; background: var(--color-overlay); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: var(--space-8)`.

The inner modal panel: `background: var(--color-bg-modal); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-modal); max-width: 760px; width: 100%; max-height: 90vh; overflow-y: auto`.

**Animation:** CSS `@keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }` applied with `animation: modalIn 0.25s ease`.

**Closing:** Clicking the `✕` button OR clicking the overlay background (`.modal-overlay` element directly, not the inner `.modal` panel) calls `onClose`. The `Escape` key listener is added via `useEffect` on mount.

**Modal body sections:**

1. Full-width image at top (240 px height)
2. `.modal-body` with padding `var(--space-6)`:
   - Tag pills via `<TagBadge>`
   - `<h2>` peptide name — `font-size: var(--font-size-heading-lg); font-weight: bold` — `id="modal-name"` for `aria-labelledby`
   - `shortDescription` — `color: var(--color-text-secondary); line-height: 1.7`
   - **Key Benefits** section: `<ul>` with `list-style: none`, each `<li>` prefixed with `✓` in `var(--color-accent)`
   - **Research Notes** section: each note in a card with `border-left: 3px solid var(--color-blue-bright)`, `background: var(--color-bg-card)`, `padding: var(--space-3) var(--space-4)`
   - **Suggested Dosage** section: gradient card `background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-blue-mid))`
   - "View Full Detail Page →" `<Link>` to `/peptide/:id` — `color: var(--color-accent); font-size: var(--font-size-label); text-transform: uppercase; letter-spacing: 0.08em`

**Accessibility:** See Section 11.

---

### 7.8 `src/pages/Explore/ExplorePage.tsx`

**Props:** none (reads `filteredPeptides`, `activeFilter`, `searchQuery`, setters from `usePeptides()`)

**Description:**
The home route (`/`). Composed of:

1. **Hero section** — eyebrow text, `<h1>` with `<em>Regenerative Potential</em>` in accent colour, subtitle, CTA `<a href="#explore">` button with smooth scroll.
2. **Controls bar** — `position: sticky; top: 57px; z-index: 90` — contains `<SearchBar>` and `<FilterBar>` reading/writing PeptideContext. `id="explore"` for CTA scroll target.
3. **Grid section** — `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6)` — renders `<PeptideCard>` for each `filteredPeptide`.
4. **No-results state** — renders when `filteredPeptides.length === 0`: `🔬` icon, "No peptides found" heading, hint text.
5. **`<DetailModal>`** — rendered at the bottom of `ExplorePage`, receives `selectedPeptide` state.

**Click handling:**

```ts
const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null);
const isMobile = window.innerWidth < 768; // or use a custom hook

function handleCardClick(peptide: Peptide) {
  if (isMobile) {
    navigate(`/peptide/${peptide.id}`);
  } else {
    setSelectedPeptide(peptide);
  }
}
```

Use a `useEffect`-based `window.matchMedia('(max-width: 767px)')` listener or a `useWindowWidth` hook for reliable SSR-safe breakpoint detection. `navigate` comes from `useNavigate()`.

---

### 7.9 `src/pages/Detail/DetailPage.tsx`

**Props:** none (reads `:id` from `useParams()`)

**Description:**
Full-page detail view at `/peptide/:id`. Reads `useParams().id`, finds the peptide from `usePeptides().peptides`. If not found renders a "Peptide not found" message and a back link.

**Two-column layout (desktop):**

- Left column: hero image (full width of column), tag pills, `<h1>` name, `shortDescription`, dosage gradient card
- Right column: Benefits list (`✓`-prefixed `<ul>`), Research Notes cards (blue left border), Quick Stats sidebar (tags count, dosage snippet), disclaimer text

**Mobile:** single column — image stacks above all text content.

Includes `← Back to all peptides` `<Link to="/">` at the top.

---

### 7.10 `src/pages/AgentInsights/AgentInsightsPage.tsx`

**Props:** none (reads `agentData` from `src/data/agentData.ts`)

**Description:**
Internal agent monitoring page. Renders:

1. `<InternalBanner>`
2. Page header (eyebrow "Internal Dashboard", `<h1>Agent Insights</h1>`, subtitle)
3. **Agent Status Cards grid** — `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))` — one card per agent with header (name + status badge), body (description, current-task label + value)
4. **`<AgentFlowchart>`** — see Section 9
5. **Past Task History table** — columns: Agent, Task, Status, Date — rows from `agentData` history arrays, sorted most-recent-first

---

### 7.11 `src/pages/CompletedSpecs/CompletedSpecsPage.tsx`

**Props:** none (reads `specsData` from `src/data/specsData.ts`)

**Description:**
Internal specs audit page. Renders:

1. `<InternalBanner>`
2. Page header (eyebrow "Internal Dashboard", `<h1>Completed Specs</h1>`, subtitle)
3. **Progress Overview grid** — `grid-template-columns: repeat(4, 1fr)` (2 cols on mobile) — four count cards: Vibe-Coded (blue `var(--color-blue-bright)`), Spec-Coded (amber `var(--color-amber)`), Completed (green `var(--color-accent)`), Yet to Complete (grey `var(--color-text-secondary)`)
4. **All Specs table** — columns: Spec Name, Status (badge), Description, Agent, Timestamp, Summary, Token Usage (input / output / total)
5. **Token Usage Summary** — single card displaying sum of all `total` token values across all spec rows
6. **Agent Task Summary table** — columns: Agent, Completed Tasks (list), Count
7. **Prompt History list** — chronological cards, each showing date, prompt text, task chips

---

## 8. Mock Data Files

### 8.1 `src/data/agentData.ts`

Full TypeScript interfaces and mock data matching the `agent-insights.html` mockup:

```ts
export type AgentStatus = "Completed" | "In Progress" | "Pending" | "Blocked";

export interface AgentHistoryItem {
  task: string;
  date: string; // ISO date string YYYY-MM-DD
  status: AgentStatus;
  tokenUsage: TokenUsage;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  total: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  currentTask: string;
  status: AgentStatus;
  history: AgentHistoryItem[];
}

export const agents: Agent[] = [
  {
    id: "requirements-agent",
    name: "Requirements Agent",
    description:
      "Gathers and documents project requirements using EARS-pattern acceptance criteria and INCOSE-compliant language.",
    currentTask: "Requirements document complete for peptide-helper-ux-design",
    status: "Completed",
    history: [
      {
        task: "Created requirements.md for peptide-helper-ux-design (9 requirements, EARS-pattern)",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 4210, outputTokens: 6340, total: 10550 },
      },
      {
        task: "Ran automatic requirements detailing pass across all 9 requirements",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 7820, outputTokens: 11240, total: 19060 },
      },
    ],
  },
  {
    id: "design-agent",
    name: "UX Design Mockup Agent",
    description:
      "Produces static single-file HTML/CSS/JS mockups for all pages in the approved design system.",
    currentTask: "All 4 mockup HTML files complete and approved",
    status: "Completed",
    history: [
      {
        task: "Built /design-mockups/index.html — homepage with hero, filter bar, search, card grid, modal",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 12450, outputTokens: 18900, total: 31350 },
      },
      {
        task: "Built /design-mockups/detail.html — full peptide detail page",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 8930, outputTokens: 14220, total: 23150 },
      },
      {
        task: "Built /design-mockups/agent-insights.html — internal agent dashboard",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 9870, outputTokens: 15640, total: 25510 },
      },
      {
        task: "Built /design-mockups/completed-specs.html — internal spec history tracker",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 8110, outputTokens: 12880, total: 20990 },
      },
    ],
  },
  {
    id: "data-agent",
    name: "Data Seed Agent",
    description:
      "Generates and validates the peptides.json data file with real peptide research data.",
    currentTask: "peptides.json created and validated (10 peptides)",
    status: "Completed",
    history: [
      {
        task: "Generated /src/data/peptides.json with 10 real peptide objects",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 5340, outputTokens: 9870, total: 15210 },
      },
      {
        task: "Validated all field constraints (id uniqueness, URL format, tag membership)",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 2100, outputTokens: 1450, total: 3550 },
      },
    ],
  },
  {
    id: "review-agent",
    name: "Human Review Gate",
    description:
      "Awaits explicit human approval of all mockups before React implementation begins.",
    currentTask: "Mockups approved — React implementation greenlit",
    status: "Completed",
    history: [
      {
        task: "Human sign-off received on all 4 design mockups",
        date: "2026-05-29",
        status: "Completed",
        tokenUsage: { inputTokens: 0, outputTokens: 0, total: 0 },
      },
    ],
  },
  {
    id: "react-agent",
    name: "React Implementation Agent",
    description:
      "Converts approved mockups into production React components with routing, state management, and data layer.",
    currentTask: "Writing design.md — implementation in progress",
    status: "In Progress",
    history: [
      {
        task: "Wrote technical design document for react-implementation spec",
        date: "2026-05-30",
        status: "Completed",
        tokenUsage: { inputTokens: 14200, outputTokens: 22800, total: 37000 },
      },
    ],
  },
];

// Convenience: flat list of all history items for the history table
export const allHistoryItems = agents
  .flatMap((a) => a.history.map((h) => ({ ...h, agentName: a.name })))
  .sort((a, b) => b.date.localeCompare(a.date));

// Total token usage across all agents
export const totalTokenUsage: TokenUsage = agents
  .flatMap((a) => a.history)
  .reduce(
    (acc, h) => ({
      inputTokens: acc.inputTokens + h.tokenUsage.inputTokens,
      outputTokens: acc.outputTokens + h.tokenUsage.outputTokens,
      total: acc.total + h.tokenUsage.total,
    }),
    { inputTokens: 0, outputTokens: 0, total: 0 },
  );
```

### 8.2 `src/data/specsData.ts`

Full interfaces and mock data matching the `completed-specs.html` mockup. The specs table now includes the full columns required by Requirement 9 (Agent, Timestamp, Summary, Token Usage).

```ts
import type { TokenUsage } from "./agentData";

export type SpecStatus =
  | "Vibe-Coded"
  | "Spec-Coded"
  | "Completed"
  | "Yet to be Completed";

export interface Spec {
  id: string;
  name: string;
  status: SpecStatus;
  description: string;
  agent: string;
  timestamp: string; // ISO date string
  summary: string;
  tokenUsage: TokenUsage;
}

export interface AgentTaskSummary {
  agent: string;
  tasks: string[];
}

export interface PromptHistoryItem {
  id: string;
  date: string;
  text: string;
  tasks: string[];
}

export const specs: Spec[] = [
  {
    id: "peptide-helper-ux-design",
    name: "peptide-helper-ux-design",
    status: "Spec-Coded",
    description:
      "UX Design phase: static HTML/CSS/JS mockups for index, detail, agent-insights, and completed-specs pages plus peptides.json data file.",
    agent: "UX Design Mockup Agent",
    timestamp: "2026-05-28T14:22:00Z",
    summary:
      "Four fully interactive HTML mockups delivered with dark health-tech design system, responsive layout, and integrated peptides.json data.",
    tokenUsage: { inputTokens: 39160, outputTokens: 61530, total: 100690 },
  },
  {
    id: "react-implementation",
    name: "React Implementation",
    status: "In Progress" as unknown as SpecStatus, // mapped to "Yet to be Completed" badge visually
    description:
      "Convert approved mockups into production React components with routing, state management, and data layer.",
    agent: "React Implementation Agent",
    timestamp: "2026-05-30T09:00:00Z",
    summary: "Design document written. Component implementation in progress.",
    tokenUsage: { inputTokens: 14200, outputTokens: 22800, total: 37000 },
  },
];

// Note: "In Progress" is treated as "Yet to be Completed" for progress overview counting
// The badge logic maps it: if status not in the four badge keys, use "Yet to be Completed"

export const agentTaskSummaries: AgentTaskSummary[] = [
  {
    agent: "Requirements Agent",
    tasks: [
      "Created requirements.md for peptide-helper-ux-design (9 requirements, EARS-pattern)",
      "Ran automatic requirements detailing pass across all 9 requirements",
    ],
  },
  {
    agent: "Data Seed Agent",
    tasks: [
      "Generated /src/data/peptides.json with 10 real peptide objects",
      "Validated all field constraints (id uniqueness, URL format, tag membership, character limits)",
    ],
  },
  {
    agent: "UX Design Mockup Agent",
    tasks: [
      "Built /design-mockups/index.html — homepage with hero, filter bar, search, card grid, modal, mobile detail view",
      "Built /design-mockups/detail.html — full peptide detail page with benefits, research notes, dosage",
      "Built /design-mockups/agent-insights.html — internal agent flowchart and status dashboard",
      "Built /design-mockups/completed-specs.html — internal spec history and progress tracker",
    ],
  },
  {
    agent: "Human Review Gate",
    tasks: ["Human sign-off received on all 4 design mockups"],
  },
  {
    agent: "React Implementation Agent",
    tasks: ["Wrote technical design document for react-implementation spec"],
  },
];

export const promptHistory: PromptHistoryItem[] = [
  {
    id: "prompt-1",
    date: "2026-05-28",
    text: "UX Design phase for Peptide-Helper (react app). Create a complete set of static, single-file HTML/CSS/JS mockups saved in /design-mockups. Pages: index.html (hero, filter, search, card grid), detail.html (full peptide detail), agent-insights.html (internal agent flowcharts), completed-specs.html (internal spec history). Also generate /src/data/peptides.json with 10 real peptides. Modern dark health-tech theme, deep greens/blues, fully responsive, interactive JS. Human approval gate before React implementation.",
    tasks: [
      "Create requirements.md (peptide-helper-ux-design)",
      "Generate /src/data/peptides.json (10 peptides)",
      "Build /design-mockups/index.html",
      "Build /design-mockups/detail.html",
      "Build /design-mockups/agent-insights.html",
      "Build /design-mockups/completed-specs.html",
    ],
  },
  {
    id: "prompt-2",
    date: "2026-05-30",
    text: "Write a complete technical design document for the react-implementation spec. The design document should cover: overview, file structure, technology stack, design system SCSS, data layer, routing, component breakdown, mock data files, agent flowchart, responsive strategy, accessibility, and state management summary.",
    tasks: [
      "Read all design mockup HTML files",
      "Read peptides.json data file",
      "Read requirements.md",
      "Write design.md to .kiro/specs/react-implementation/",
    ],
  },
];

// Computed total token usage across all specs
export const totalSpecTokenUsage: TokenUsage = specs.reduce(
  (acc, s) => ({
    inputTokens: acc.inputTokens + s.tokenUsage.inputTokens,
    outputTokens: acc.outputTokens + s.tokenUsage.outputTokens,
    total: acc.total + s.tokenUsage.total,
  }),
  { inputTokens: 0, outputTokens: 0, total: 0 },
);
```

---

## 9. Agent Flowchart

### 9.1 File: `src/pages/AgentInsights/AgentFlowchart.tsx`

The flowchart is an inline SVG React component — no external SVG library required. It mirrors the node layout from `agent-insights.html` exactly.

**Props:**

```ts
interface AgentFlowchartProps {
  agents: Agent[];
  totalTokens: number;
}
```

**State:**

```ts
const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
```

**SVG structure (`viewBox="0 0 700 300"`):**

```tsx
<svg
  className={styles.flowchart}
  viewBox="0 0 700 300"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <marker
      id="arrow"
      markerWidth="8"
      markerHeight="8"
      refX="6"
      refY="3"
      orient="auto"
    >
      <path d="M0,0 L0,6 L8,3 z" fill="#4a9eff" />
    </marker>
  </defs>

  {/* Connection lines */}
  <line
    x1="130"
    y1="80"
    x2="230"
    y2="80"
    stroke="#4a9eff"
    strokeWidth="1.5"
    markerEnd="url(#arrow)"
  />
  <line
    x1="370"
    y1="80"
    x2="470"
    y2="80"
    stroke="#4a9eff"
    strokeWidth="1.5"
    markerEnd="url(#arrow)"
  />
  <line
    x1="300"
    y1="110"
    x2="300"
    y2="160"
    stroke="#4a9eff"
    strokeWidth="1.5"
    markerEnd="url(#arrow)"
  />
  <line
    x1="300"
    y1="200"
    x2="300"
    y2="225"
    stroke="#1db954"
    strokeWidth="1.5"
    strokeDasharray="4,3"
    markerEnd="url(#arrow)"
  />

  {/* Node: Requirements Agent */}
  <g
    style={{ cursor: "pointer" }}
    onClick={() => setSelectedAgentId("requirements-agent")}
    role="button"
    aria-label="Requirements Agent node"
  >
    <rect
      x="10"
      y="55"
      width="120"
      height="50"
      rx="8"
      fill="#0f1f35"
      stroke="#1db954"
      strokeWidth="1.5"
    />
    <text
      x="70"
      y="76"
      textAnchor="middle"
      fill="#f0f4f0"
      fontSize="11"
      fontFamily="Inter,sans-serif"
      fontWeight="600"
    >
      Requirements
    </text>
    <text
      x="70"
      y="92"
      textAnchor="middle"
      fill="#1db954"
      fontSize="10"
      fontFamily="Inter,sans-serif"
    >
      Agent
    </text>
    <circle cx="108" cy="62" r="5" fill="#1db954" />
  </g>

  {/* Node: UX Design Mockup Agent */}
  <g
    style={{ cursor: "pointer" }}
    onClick={() => setSelectedAgentId("design-agent")}
    role="button"
    aria-label="UX Design Mockup Agent node"
  >
    <rect
      x="230"
      y="55"
      width="140"
      height="50"
      rx="8"
      fill="#0f1f35"
      stroke="#4a9eff"
      strokeWidth="1.5"
    />
    <text
      x="300"
      y="76"
      textAnchor="middle"
      fill="#f0f4f0"
      fontSize="11"
      fontFamily="Inter,sans-serif"
      fontWeight="600"
    >
      UX Design
    </text>
    <text
      x="300"
      y="92"
      textAnchor="middle"
      fill="#4a9eff"
      fontSize="10"
      fontFamily="Inter,sans-serif"
    >
      Mockup Agent
    </text>
    <circle cx="358" cy="62" r="5" fill="#4a9eff" />
  </g>

  {/* Node: Data Seed Agent */}
  <g
    style={{ cursor: "pointer" }}
    onClick={() => setSelectedAgentId("data-agent")}
    role="button"
    aria-label="Data Seed Agent node"
  >
    <rect
      x="470"
      y="55"
      width="120"
      height="50"
      rx="8"
      fill="#0f1f35"
      stroke="#7b2d8b"
      strokeWidth="1.5"
    />
    <text
      x="530"
      y="76"
      textAnchor="middle"
      fill="#f0f4f0"
      fontSize="11"
      fontFamily="Inter,sans-serif"
      fontWeight="600"
    >
      Data
    </text>
    <text
      x="530"
      y="92"
      textAnchor="middle"
      fill="#c084fc"
      fontSize="10"
      fontFamily="Inter,sans-serif"
    >
      Seed Agent
    </text>
    <circle cx="578" cy="62" r="5" fill="#7b2d8b" />
  </g>

  {/* Node: Human Review Gate */}
  <g
    style={{ cursor: "pointer" }}
    onClick={() => setSelectedAgentId("review-agent")}
    role="button"
    aria-label="Human Review Gate node"
  >
    <rect
      x="230"
      y="160"
      width="140"
      height="50"
      rx="8"
      fill="#0f1f35"
      stroke="#f59e0b"
      strokeWidth="1.5"
    />
    <text
      x="300"
      y="181"
      textAnchor="middle"
      fill="#f0f4f0"
      fontSize="11"
      fontFamily="Inter,sans-serif"
      fontWeight="600"
    >
      Human Review
    </text>
    <text
      x="300"
      y="197"
      textAnchor="middle"
      fill="#f59e0b"
      fontSize="10"
      fontFamily="Inter,sans-serif"
    >
      Approval Gate
    </text>
    <circle cx="358" cy="167" r="5" fill="#f59e0b" />
  </g>

  {/* Node: React Implementation (pending) */}
  <g
    style={{ cursor: "pointer" }}
    onClick={() => setSelectedAgentId("react-agent")}
    role="button"
    aria-label="React Implementation Agent node"
  >
    <rect
      x="230"
      y="230"
      width="140"
      height="30"
      rx="6"
      fill="#1a3a5c"
      stroke="#1e3a52"
      strokeWidth="1"
      strokeDasharray="4,3"
    />
    <text
      x="300"
      y="249"
      textAnchor="middle"
      fill="#a0b0a8"
      fontSize="10"
      fontFamily="Inter,sans-serif"
    >
      React Implementation
    </text>
  </g>

  {/* Token total footer — always visible */}
  <text
    x="700"
    y="292"
    textAnchor="end"
    fill="#a0b0a8"
    fontSize="11"
    fontFamily="Inter,sans-serif"
  >
    Total tokens used: {totalTokens.toLocaleString()}
  </text>
</svg>
```

### 9.2 `NodeDetailPanel` sub-component

```ts
interface NodeDetailPanelProps {
  agent: Agent | null;
  onClose: () => void;
}
```

Rendered below the SVG inside the flowchart container. When `agent` is `null`, renders nothing. When visible, animates in with `@keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }`.

Panel content:

- Close button (`✕`) top-right — calls `onClose` (sets `selectedAgentId` to `null`)
- Agent name as heading
- Description text
- Status badge (using `status-completed`, `status-in-progress`, `status-pending`, or `status-blocked` class)

The panel is styled: `background: var(--color-bg-primary); border: 1px solid var(--color-accent); border-radius: var(--radius-md); padding: var(--space-4) var(--space-6); margin-top: var(--space-4)`.

---

## 10. Responsive Strategy

### 10.1 Approach

Desktop-first. Base styles target ≥ 768 px. The `@mixin mobile` override targets < 768 px. No tablet-specific breakpoint is needed.

```scss
// _variables.scss (or _mixins.scss)
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}
```

All component SCSS modules `@use '../../styles/variables' as *` (adjust path depth as needed) to access the mixin.

### 10.2 Breakpoint rules by component

| Component              | Desktop (≥ 768 px)                                  | Mobile (< 768 px)                                |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------ |
| `Nav`                  | All links visible                                   | `.nav-links { display: none }`                   |
| `Nav` padding          | `var(--space-4) var(--space-8)`                     | `var(--space-3) var(--space-4)`                  |
| `Hero`                 | `padding: var(--space-16) var(--space-8)`           | `padding: var(--space-12) var(--space-4)`        |
| `Hero` title           | `font-size: var(--font-size-heading-lg)` (36 px)    | `font-size: var(--font-size-heading-sm)` (20 px) |
| `Hero` subtitle        | `font-size: var(--font-size-body)`                  | `font-size: 14px`                                |
| Controls bar           | `padding: var(--space-6) var(--space-8); top: 57px` | `padding: var(--space-4); top: 53px`             |
| `FilterBar`            | `justify-content: center`                           | `justify-content: flex-start; overflow-x: auto`  |
| Card grid              | `repeat(auto-fill, minmax(280px, 1fr))`             | `grid-template-columns: 1fr`                     |
| Grid section           | `padding: var(--space-8)`                           | `padding: var(--space-4)`                        |
| `DetailModal`          | Displayed                                           | `display: none !important` — navigate instead    |
| `DetailPage` layout    | Two-column side-by-side                             | Single column, image stacks above text           |
| Page header (internal) | `padding: var(--space-12) var(--space-8)`           | `padding: var(--space-8) var(--space-4)`         |
| Page title (internal)  | `font-size: var(--font-size-heading-lg)`            | `font-size: var(--font-size-heading-sm)`         |
| Main content padding   | `padding: var(--space-8)`                           | `padding: var(--space-4)`                        |
| Progress grid          | `repeat(4, 1fr)`                                    | `repeat(2, 1fr)`                                 |
| Agents grid            | `repeat(auto-fill, minmax(320px, 1fr))`             | `grid-template-columns: 1fr`                     |

### 10.3 Mobile card interaction

On mobile, `<PeptideCard>` `onClick` calls `navigate('/peptide/' + peptide.id)` instead of opening the modal. The `<DetailModal>` is hidden via CSS (`display: none !important` at `max-width: 767px`) and `selectedPeptide` state is never set on mobile, preventing any layout impact.

Breakpoint detection in `ExplorePage`: use a `useWindowWidth` custom hook or `window.matchMedia` within a `useEffect`:

```ts
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}
```

---

## 11. Accessibility

### 11.1 Focus trap for `DetailModal`

The focus trap is implemented inside `DetailModal` using `useEffect` and direct DOM queries. It runs when `peptide` is non-null (modal is open).

```ts
useEffect(() => {
  if (!peptide) return;

  // Store the element that triggered the modal so focus can be restored on close
  const previouslyFocused = document.activeElement as HTMLElement | null;

  // Query all focusable elements inside the modal
  const modal = modalRef.current;
  if (!modal) return;
  const focusableSelectors =
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), " +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusable = Array.from(
    modal.querySelectorAll<HTMLElement>(focusableSelectors),
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  // Focus the close button immediately on open
  first?.focus();

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift+Tab — backwards
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        // Tab — forwards
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    // Restore focus to the card that opened the modal
    previouslyFocused?.focus();
  };
}, [peptide, onClose]);
```

### 11.2 ARIA attributes on `DetailModal`

```tsx
<div
  className={styles.overlay}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-name"
  onClick={handleOverlayClick}
  ref={overlayRef}
>
  <div
    className={styles.modal}
    ref={modalRef}
    onClick={(e) => e.stopPropagation()}
  >
    <button className={styles.close} onClick={onClose} aria-label="Close">
      ✕
    </button>
    {/* ... */}
    <h2 id="modal-name" className={styles.name}>
      {peptide.name}
    </h2>
    {/* ... */}
  </div>
</div>
```

`aria-labelledby="modal-name"` links the dialog to the peptide name heading. The overlay click handler closes the modal only when the click target IS the overlay itself (not a child element) via `e.target === overlayRef.current` check.

### 11.3 General accessibility rules

- Every interactive element (buttons, links, modal close) has visible text or `aria-label`.
- `<NavLink>` uses `aria-current="page"` automatically via React Router when active.
- SVG flowchart nodes have `role="button"` and `aria-label` on the `<g>` wrapper.
- All `<img>` elements have meaningful `alt` text (e.g., `alt={peptide.name}`).
- Status badges do not rely on colour alone — they always include text labels.
- `<FilterBar>` buttons use `aria-pressed` to indicate the active filter state.

---

## 12. State Management Summary

### 12.1 `PeptideContext` (global)

The context manages only what needs to be shared across page boundaries:

| State              | Type                    | Description                                               |
| ------------------ | ----------------------- | --------------------------------------------------------- |
| `peptides`         | `Peptide[]`             | Full data set — never changes at runtime                  |
| `filteredPeptides` | `Peptide[]`             | Derived from `activeFilter` + `searchQuery` via `useMemo` |
| `activeFilter`     | `string`                | Currently selected tag filter (`'All'` by default)        |
| `searchQuery`      | `string`                | Current search input value (empty by default)             |
| `setActiveFilter`  | `(tag: string) => void` | Updates filter — triggers `filteredPeptides` recompute    |
| `setSearchQuery`   | `(q: string) => void`   | Updates search — triggers `filteredPeptides` recompute    |

The filter/search state must live in context (not local) so that:

- Closing the `DetailModal` on `ExplorePage` restores the previous filter/search state.
- `FilterBar` and `SearchBar` read from and write to the same shared state.

### 12.2 Local component state

All other state is local to the component that needs it:

| Component                              | Local state                        | Purpose                              |
| -------------------------------------- | ---------------------------------- | ------------------------------------ |
| `ExplorePage`                          | `selectedPeptide: Peptide \| null` | Which peptide is open in the modal   |
| `AgentInsightsPage` / `AgentFlowchart` | `selectedAgentId: string \| null`  | Which flowchart node is selected     |
| Any form input                         | `value`                            | Controlled input values where needed |

### 12.3 No Redux / Zustand

No global state library is needed. The data set is static (loaded once), the only shared state is filter/search, and no component communication requires a pub/sub pattern. `PeptideContext` + `useState` is the full state solution.

---

## 13. Entry Point Files

### `index.html` (project root)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PeptideHelper</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PeptideProvider } from "./context/PeptideContext";
import App from "./App";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PeptideProvider>
        <App />
      </PeptideProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

`global.scss` is the one and only global style import. All component styles are CSS Modules (`*.module.scss`) imported locally in each component file.

---

_End of design document. This document is the single reference for all implementation subagents. Every file path, interface shape, token value, and behaviour described here must be reproduced exactly._
