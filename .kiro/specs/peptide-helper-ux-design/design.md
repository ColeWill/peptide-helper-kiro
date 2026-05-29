# Design Document — Peptide Helper UX Design

## Overview

This document describes the technical design of the static HTML/CSS/JS mockup system for PeptideHelper. The mockup phase produces four self-contained HTML files that serve as the visual and interaction blueprint for the React implementation. No build step, server, or bundler is required — every file opens directly in a browser via `file://`.

The deliverables are:

| File                                  | Audience | Purpose                                                       |
| ------------------------------------- | -------- | ------------------------------------------------------------- |
| `design-mockups/index.html`           | Public   | Homepage: hero, filter bar, search, card grid, detail view    |
| `design-mockups/detail.html`          | Public   | Full peptide detail page (static, pre-populated with BPC-157) |
| `design-mockups/agent-insights.html`  | Internal | Agent flowchart and task status dashboard                     |
| `design-mockups/completed-specs.html` | Internal | Spec history, prompt log, and progress overview               |
| `src/data/peptides.json`              | Shared   | Canonical data file — 10 real peptide objects                 |

A human approval gate separates this phase from React implementation. No React work begins until all four mockups are explicitly signed off.

---

## Architecture

### Mockup System Architecture

Each mockup is a single-file HTML document. All CSS lives in `<style>` tags, all JavaScript in `<script>` tags. The only permitted external dependency is the Google Fonts CDN link for Inter (with a `system-ui` fallback).

```
design-mockups/
├── index.html          ← public homepage (interactive, data-driven)
├── detail.html         ← public detail page (static, BPC-157 pre-populated)
├── agent-insights.html ← internal dashboard (data-driven from inline JS constants)
└── completed-specs.html← internal dashboard (data-driven from inline JS constants)

src/
└── data/
    └── peptides.json   ← canonical data source (imported into React later)
```

### Data Flow

```
peptides.json  ──(copy/inline)──▶  const PEPTIDES = [...] in index.html
                                         │
                                    filteredPeptides()
                                         │
                                    renderCards()
                                         │
                              ┌──────────┴──────────┐
                         desktop                  mobile
                        openModal(p)         openMobileDetail(p)
```

The `PEPTIDES` constant in `index.html` is a verbatim copy of the data from `peptides.json`. During React implementation, this constant is replaced by a direct `import` of the JSON file. The shape of the data objects is identical — no transformation is needed.

`detail.html` is statically pre-populated with BPC-157 data (the first object in the array). In the React app, this page becomes a dynamic route (`/peptides/:id`) that reads from the same JSON.

The two internal pages (`agent-insights.html`, `completed-specs.html`) each declare their own inline data constants (`AGENTS`, `SPECS`, `AGENT_TASKS`, `PROMPTS`) that are updated manually as the project progresses.

### Relationship to React Implementation

The mockups are the authoritative source for:

- All CSS custom property names and values (design tokens)
- All component structure and class names
- All interaction patterns and state logic
- All responsive breakpoint rules

During React implementation, developers reference the mockups as living specs. The mapping is:

| Mockup element                 | React equivalent                              |
| ------------------------------ | --------------------------------------------- |
| `:root` CSS custom properties  | CSS Modules or a `tokens.css` global          |
| `.peptide-card` HTML structure | `<PeptideCard />` component                   |
| `.modal` + `.modal-overlay`    | `<PeptideModal />` component                  |
| `.mobile-detail`               | `<MobileDetailView />` component              |
| `filteredPeptides()` function  | `usePeptideFilter()` hook                     |
| `PEPTIDES` constant            | `import peptides from '@/data/peptides.json'` |
| `detail.html` layout           | `/peptides/[id]` route page                   |

---

## Components and Interfaces

### Shared Components (appear on all pages)

**Nav Bar** (`.nav`)

- Logo: "Peptide" in `--color-accent`, "Helper" in `--color-text-primary`
- Links: uppercase, 12px, `--color-text-secondary` default, `--color-accent` on hover/active
- Sticky on `index.html` and `detail.html` (position: sticky, backdrop-filter: blur)
- On mobile (< 768px): nav links hidden, logo only

**Footer** (`.footer`)

- Centered, 12px, `--color-text-secondary`
- Public pages: disclaimer text + internal links
- Internal pages: copyright + "Back to App" link

**Internal Banner** (`.internal-banner`)

- Amber background (`rgba(245,158,11,0.12)`), amber border and text
- Text: "⚠ Internal Tool — Not part of the public app"
- Present on `agent-insights.html` and `completed-specs.html` only

### index.html Components

**Hero Section** (`.hero`)

- Full-width gradient band: `--color-bg-secondary` → `--color-bg-primary` → `--color-blue-mid`
- Radial green glow overlay (pseudo-element, non-interactive)
- Eyebrow label, `h1` headline with `<em>` accent, subtitle, pill CTA button
- Mobile: reduced padding, `heading-sm` font size

**Controls Bar** (`.controls`)

- Sticky below nav (`top: 57px` desktop, `top: 53px` mobile)
- Contains: search input + filter bar
- Search input: pill-shaped, `--color-bg-card` background, accent border on focus
- Filter bar: horizontally scrollable row of pill buttons, `justify-content: center` on desktop, `flex-start` on mobile

**Peptide Card** (`.peptide-card`)

- `--color-bg-card` background, `--color-border` border, `--radius-md`
- Image placeholder (180px height, `object-fit: cover`)
- Card body: name (`heading-sm`, bold), tagline (12px, secondary), tag badges
- Hover (desktop only): `translateY(-4px)`, `--shadow-card`, `--color-accent` border
- Keyboard accessible: `tabindex="0"`, `role="button"`, Enter/Space triggers detail open

**Tag Badge** (`.tag`)

- 10px, semibold, uppercase, pill shape
- Four colour variants:
  - `.tag-fat-loss`: `#e85d04` (orange)
  - `.tag-anti-aging`: `#7b2d8b` (purple)
  - `.tag-youthful-skin`: `#0077b6` (blue)
  - `.tag-muscle-recovery`: `#1db954` (green, dark text)

**Desktop Modal** (`.modal-overlay` + `.modal`)

- Fixed overlay, `rgba(0,0,0,0.75)` + `backdrop-filter: blur(4px)`
- Modal panel: max-width 760px, max-height 90vh, scrollable
- Sections: image (240px), tags, name, description, Key Benefits, Research Notes, Suggested Dosage, "View Full Detail Page →" link
- Close: circular button top-right, Escape key, click-outside-modal
- Entry animation: `modalIn` keyframe (fade + translateY + scale)
- Hidden on mobile via `display: none !important` in media query

**Mobile Detail View** (`.mobile-detail`)

- Fixed full-screen overlay (`position: fixed; inset: 0; z-index: 300`)
- Back button bar at top, scrollable content below
- Renders same content as modal body
- Hidden on desktop via `display: none !important` in media query

**No Results State** (`.no-results`)

- Centered, hidden by default, shown via `.visible` class
- 🔬 icon, "No peptides found" heading, hint text

### detail.html Components

**Detail Hero** (`.detail-hero`)

- Two-column grid on desktop: image left (3:2 aspect ratio), metadata right
- Single column on mobile: image stacked above metadata
- Metadata: tag badges, `h1` name, subtitle, dosage pill card

**Dosage Pill Card** (`.detail-dosage-pill`)

- `--color-bg-card` background, flex row with 💉 icon
- Label: "Suggested Dosage" in accent, value in secondary text

**Benefits List** (`.benefits-list`)

- `<ul>` with no list-style
- Each `<li>`: card-style (`--color-bg-card`, border, `--radius-md`), green checkmark prefix
- Hover: accent border

**Research Notes** (`.research-notes`)

- Each note: left blue border (`--color-blue-bright`), card background, 📄 icon (pseudo-element)

**Sidebar** (`.detail-sidebar`)

- Quick Stats card: label/value rows with bottom borders
- Categories card: tag badges
- Disclaimer card: green-tinted background, warning text

### agent-insights.html Components

**Agent Status Cards** (`.agent-card`)

- Grid: `auto-fill, minmax(320px, 1fr)`
- Header: gradient background, agent name + status badge
- Body: description, "Current Task" label + value box
- Status badge variants: Completed (green), In Progress (blue), Pending (grey), Blocked (orange)

**Flowchart** (inline SVG, `.flowchart`)

- `viewBox="0 0 700 260"`, horizontally scrollable container
- Nodes: `<rect>` + `<text>` + status dot `<circle>`
- Edges: `<line>` with arrowhead `<marker>`
- Clickable nodes (`cursor: pointer`, `data-agent` attribute)
- Node detail panel (`.node-panel`): shown/hidden via `.visible` class, fade-in animation

**Task History Table** (`.history-table`)

- Columns: Agent, Task, Status, Date
- Row hover: `--color-bg-card` background
- Agent column: accent colour

### completed-specs.html Components

**Progress Overview Grid** (`.progress-grid`)

- 4-column grid on desktop, 2-column on mobile
- Each card: large count number (colour-coded by status), label
- Status colours: Vibe-Coded (blue), Spec-Coded (amber), Completed (green), Yet to Complete (grey)

**Specs Table** (`.specs-table`)

- Columns: Spec Name, Status (badge), Description

**Agent Tasks Table** (`.agent-tasks-table`)

- Columns: Agent, Completed Tasks (checkmark list), Count

**Prompt History** (`.prompt-list`)

- Card per prompt: meta row (badge + date), prompt text, task chips

---

## Data Models

### Peptide Object

```typescript
interface Peptide {
  id: string; // kebab-case, unique (e.g. "bpc-157")
  name: string; // display name (e.g. "BPC-157")
  tags: PeptideTag[]; // 1+ tags from the allowed set
  shortDescription: string; // 1–160 characters
  benefits: string[]; // 1+ benefit strings
  imagePlaceholderUrl: string; // absolute HTTPS URL (placehold.co)
  researchNotes: string[]; // 1+ research note strings
  suggestedDosage: string; // 1–200 characters
}

type PeptideTag =
  | "Fat Loss"
  | "Anti-Aging"
  | "Youthful Skin"
  | "Muscle Recovery";
```

### Filter + Search State (index.html)

```typescript
// Mutable module-level state in index.html <script>
let activeFilter: string = "All"; // 'All' | PeptideTag
let searchQuery: string = ""; // raw input value

// Saved before opening detail view, restored on close
let savedFilter: string = "All";
let savedSearch: string = "";
```

The `filteredPeptides()` function computes the visible set as the intersection of:

1. Tag match: `activeFilter === 'All'` OR `p.tags.includes(activeFilter)`
2. Search match: `searchQuery === ''` OR `p.name.toLowerCase().includes(q)` OR `p.shortDescription.toLowerCase().includes(q)`

Both conditions must be true simultaneously — filter and search are ANDed, not ORed.

### Agent Data (agent-insights.html)

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  currentTask: string;
  status: "Completed" | "In Progress" | "Pending" | "Blocked";
  history: Array<{ task: string; date: string }>;
}
```

### Spec Data (completed-specs.html)

```typescript
interface Spec {
  name: string;
  status: "Vibe-Coded" | "Spec-Coded" | "Completed" | "Yet to be Completed";
  description: string; // ≤ 160 characters
}

interface AgentTaskSummary {
  agent: string;
  tasks: string[];
}

interface Prompt {
  date: string; // YYYY-MM-DD
  text: string;
  tasks: string[];
}
```

---

## Design System Token Structure

All tokens are declared as CSS custom properties in a single `:root` block at the top of each mockup file. This block is the sole source of truth — no hardcoded values appear outside it.

```css
:root {
  /* ── Colours ─────────────────────────────────────── */
  --color-bg-primary: #0a1628; /* page background */
  --color-bg-secondary: #0d2b1e; /* hero / header gradient start */
  --color-bg-card: #0f1f35; /* card / panel backgrounds */
  --color-bg-modal: #0d1e30; /* modal panel background */
  --color-accent: #1db954; /* primary green accent */
  --color-accent-hover: #17a349; /* accent on hover */
  --color-blue-mid: #1a3a5c; /* mid-blue for gradients */
  --color-blue-bright: #4a9eff; /* bright blue for research note borders */
  --color-text-primary: #f0f4f0; /* body text */
  --color-text-secondary: #a0b0a8; /* muted / secondary text */
  --color-border: #1e3a52; /* card and divider borders */
  --color-overlay: rgba(0, 0, 0, 0.75); /* modal backdrop */

  /* ── Tag colours ─────────────────────────────────── */
  --tag-fat-loss: #e85d04;
  --tag-anti-aging: #7b2d8b;
  --tag-youthful-skin: #0077b6;
  --tag-muscle-recovery: #1db954;

  /* ── Typography ──────────────────────────────────── */
  --font-family: "Inter", system-ui, sans-serif;
  --font-size-label: 12px;
  --font-size-body: 16px;
  --font-size-heading-sm: 20px;
  --font-size-heading-lg: 36px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ── Spacing (4px base grid) ─────────────────────── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── Radii ───────────────────────────────────────── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 9999px;

  /* ── Shadows ─────────────────────────────────────── */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-modal: 0 24px 80px rgba(0, 0, 0, 0.7);
}
```

The internal pages (`agent-insights.html`, `completed-specs.html`) use the same token names and values but add two extra tokens not needed on public pages:

```css
--color-amber: #f59e0b;
--color-amber-bg: rgba(245, 158, 11, 0.12);
```

---

## Responsive Strategy

Single breakpoint at **768px**. Below this threshold is "mobile", at or above is "desktop".

### Breakpoint Rules

| Element                         | Mobile (< 768px)                          | Desktop (≥ 768px)                |
| ------------------------------- | ----------------------------------------- | -------------------------------- |
| Nav links                       | Hidden                                    | Visible                          |
| Hero headline                   | `heading-sm` (20px)                       | `heading-lg` (36px)              |
| Filter bar                      | `justify-content: flex-start`, scrollable | `justify-content: center`        |
| Card grid                       | `grid-template-columns: 1fr`              | `auto-fill, minmax(280px, 1fr)`  |
| Detail view trigger             | Full-page swap (`.mobile-detail`)         | Modal overlay (`.modal-overlay`) |
| Detail hero layout              | Single column, image stacked              | Two-column grid                  |
| Detail content                  | Single column                             | `2fr 1fr` (main + sidebar)       |
| Progress grid (completed-specs) | 2 columns                                 | 4 columns                        |
| Agent cards grid                | 1 column                                  | `auto-fill, minmax(320px, 1fr)`  |

### Implementation Pattern

CSS media queries use `max-width: 767px` for mobile overrides. The desktop layout is the default (no media query needed for desktop-first rules). The modal and mobile detail view are mutually exclusive via CSS:

```css
/* Modal: hidden on mobile */
@media (max-width: 767px) {
  .modal-overlay {
    display: none !important;
  }
}

/* Mobile detail: hidden on desktop */
@media (min-width: 768px) {
  .mobile-detail {
    display: none !important;
  }
}
```

A `resize` event listener in `index.html` handles the edge case where a user resizes the viewport while a detail view is open — it closes the active view to prevent both being open simultaneously.

---

## Interaction Patterns

### Filter + Search Combined State

Filter and search operate as independent dimensions that are ANDed together. The state machine:

```
State: { activeFilter: string, searchQuery: string }

Events:
  FILTER_CLICK(category) → activeFilter = category, re-render
  SEARCH_INPUT(value)    → searchQuery = value, re-render

Derived:
  visiblePeptides = PEPTIDES.filter(p =>
    (activeFilter === 'All' || p.tags.includes(activeFilter)) &&
    (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  )
```

Both dimensions are always active simultaneously. Changing the filter does not reset the search, and typing in the search does not reset the filter. The result count label updates on every render.

### Modal vs Mobile Swap

The detail view has two rendering modes selected by viewport width at the moment of card click:

```
openDetail(id):
  if window.innerWidth >= 768 → openModal(p)
  else                        → openMobileDetail(p)
```

Before opening either view, the current `activeFilter` and `searchQuery` are saved to `savedFilter` / `savedSearch`. These saved values are not used to restore state on close — the live `activeFilter` and `searchQuery` variables are preserved throughout (they are never mutated by the detail view). The save/restore pattern exists as a safety net for future use.

**Modal close triggers:**

1. Click the ✕ button
2. Click outside the modal panel (on the overlay)
3. Press Escape

**Mobile detail close triggers:**

1. Click "← Back to all peptides" button
2. Press Escape

On close, `document.body.style.overflow` is restored to `''` (re-enabling scroll).

### Detail View Content

Both the modal and mobile detail view render the same content via `buildDetailHTML(p)`:

- Tag badges
- Peptide name (`h2` in modal, inline in mobile)
- Short description
- Key Benefits section (checkmark list)
- Research Notes section (left-bordered cards)
- Suggested Dosage section

The modal additionally shows a hero image at the top and a "View Full Detail Page →" link to `detail.html`.

### Flowchart Node Interaction (agent-insights.html)

SVG nodes have `data-agent` attributes. A click listener on each `<g class="flow-node">` element:

1. Reads `NODE_INFO[id]` for title, description, and status
2. Populates the `.node-panel` div
3. Adds `.visible` class to show the panel with a fade-in animation
4. The ✕ button removes `.visible` to hide the panel

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Peptide field validity

_For any_ peptide object in the `PEPTIDES` array (or `peptides.json`), every required field must be present and satisfy its constraint: `id` is a non-empty kebab-case string, `name` is non-empty, `tags` is a non-empty array whose every element is one of the four allowed tag values, `shortDescription` is between 1 and 160 characters inclusive, `benefits` is a non-empty array, `imagePlaceholderUrl` is an absolute HTTPS URL, `researchNotes` is a non-empty array, and `suggestedDosage` is between 1 and 200 characters inclusive.

**Validates: Requirements 2.2, 2.5**

### Property 2: Filter + search intersection correctness

_For any_ combination of `activeFilter` (one of: "All", "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery") and `searchQuery` (any string), the set of peptides returned by `filteredPeptides()` must equal exactly the set of peptides that satisfy both the tag condition and the search condition simultaneously — no more, no fewer.

**Validates: Requirements 3.3, 3.6**

### Property 3: Card render completeness

_For any_ peptide object `p`, the HTML string produced by the card rendering function must contain `p.name`, `p.shortDescription`, `p.imagePlaceholderUrl`, and a tag badge element for each entry in `p.tags`.

**Validates: Requirements 3.4, 3.5**

### Property 4: Filter/search state preservation across detail view open/close

_For any_ `(activeFilter, searchQuery)` state, opening a peptide detail view and then closing it must leave `activeFilter` and `searchQuery` unchanged, and `filteredPeptides()` must return the same set before and after the open/close cycle.

**Validates: Requirements 3.10**

### Property 5: Token exclusivity

_For any_ CSS declaration block outside the `:root` selector in any mockup file, the declared values must not contain hardcoded hex colour literals, bare `px` font-size values, or bare `px` spacing values that duplicate a token defined in `:root`.

**Validates: Requirements 1.5**

---

## Error Handling

### No Search/Filter Results

When `filteredPeptides()` returns an empty array, `renderCards()` hides the card grid and shows the `.no-results` element (`.visible` class toggle). The "No peptides found" message and hint text are always present in the DOM — only their visibility changes.

### Missing Peptide on Detail Open

`openDetail(id)` calls `PEPTIDES.find(x => x.id === id)`. If the result is `undefined` (e.g., a stale `data-id` attribute), the function returns early without opening any view. No error is thrown.

### Invalid JSON Data File

The `peptides.json` file is validated at authoring time. If any object fails field constraints (Requirement 2.3), the entire file is considered invalid and must be corrected before use. The mockups inline the data as a JS constant, so a malformed JSON file would surface as a JS syntax error on page load.

### Viewport Resize During Open Detail

The `resize` event listener handles the case where a detail view is open and the user crosses the 768px breakpoint:

- If mobile detail is open and viewport grows to ≥ 768px → close mobile detail
- If modal is open and viewport shrinks to < 768px → close modal

This prevents both views from being simultaneously open or a view being rendered in the wrong mode.

### CDN Font Unavailable

The font stack `'Inter', system-ui, sans-serif` ensures the page remains fully functional if the Google Fonts CDN is unreachable. The visual appearance degrades gracefully to the system UI font.

---

## Testing Strategy

This feature is a static HTML/CSS/JS mockup system. The primary testing approach is **example-based** (structural verification) with **property-based tests** for the two core logic functions: data validation and filter/search computation.

### Property-Based Tests

Use a property-based testing library appropriate for the target language. For the mockup phase (vanilla JS), [fast-check](https://github.com/dubzzz/fast-check) is recommended. For the React phase, the same library integrates with Vitest.

Minimum 100 iterations per property test.

**Property 1 — Peptide field validity**

- Generator: random index into the `PEPTIDES` array (or random peptide-shaped object)
- Assertion: all field constraints hold
- Tag: `Feature: peptide-helper-ux-design, Property 1: peptide field validity`

**Property 2 — Filter + search intersection correctness**

- Generator: random `activeFilter` from the allowed set × random `searchQuery` string
- Assertion: `filteredPeptides()` result equals manual intersection of tag-match and search-match sets
- Tag: `Feature: peptide-helper-ux-design, Property 2: filter+search intersection correctness`

**Property 3 — Card render completeness**

- Generator: random peptide object (valid shape, arbitrary field values)
- Assertion: rendered HTML string contains all required fields
- Tag: `Feature: peptide-helper-ux-design, Property 3: card render completeness`

**Property 4 — Filter/search state preservation**

- Generator: random `(activeFilter, searchQuery)` state × random peptide id
- Assertion: state is unchanged after open/close cycle
- Tag: `Feature: peptide-helper-ux-design, Property 4: filter/search state preservation`

**Property 5 — Token exclusivity**

- Generator: parse CSS from each mockup file, extract all declarations outside `:root`
- Assertion: no declaration value matches a hardcoded token value
- Tag: `Feature: peptide-helper-ux-design, Property 5: token exclusivity`

### Example-Based Unit Tests

- `peptides.json` contains exactly 10 objects
- All 10 peptide IDs are unique
- `index.html` on load: "All" filter active, 10 cards rendered
- `detail.html`: contains `<h1>` with "BPC-157", benefits list, research notes section, dosage section, back link
- `agent-insights.html`: contains internal banner, 5 agent cards, SVG flowchart
- `completed-specs.html`: contains internal banner, progress grid with 4 cells, specs table
- Filter bar contains exactly 5 buttons with correct labels
- CSS media query at `max-width: 767px` sets card grid to single column

### Smoke Tests

- All four mockup files exist at the correct paths
- `src/data/peptides.json` exists and is valid JSON
- Each mockup file opens without JS errors in Chrome (manual verification)
- Human approval gate: explicit written sign-off received before React phase begins

### Integration / Manual Review Checklist (Approval Gate)

Per Requirement 8.4, the approval gate review covers:

1. Visual design consistency with the design system tokens
2. Responsive behaviour at < 768px and ≥ 768px
3. Interactive JS: filter, search, modal open/close, mobile swap, hover states
4. Data accuracy and completeness of `peptides.json`
5. All four HTML mockup files present and functional via `file://`
