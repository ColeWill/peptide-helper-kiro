# Implementation Plan: React Implementation

## Overview

This task list covers the full implementation of the `react-implementation` spec: converting the approved static HTML/CSS/JS mockups in `/design-mockups/` into a production-ready Vite + React + TypeScript + SCSS single-page application. Tasks are ordered by dependency wave so they can be executed in sequence or in parallel within each wave.

The output must be a complete, runnable project where `npm install && npm run dev` starts the application immediately. All peptide data is served from the existing `src/data/peptides.json` static file — no backend or network requests are required.

**Reference documents:**

- Requirements: `.kiro/specs/react-implementation/requirements.md`
- Design: `.kiro/specs/react-implementation/design.md`
- Approved mockups: `/design-mockups/` (index.html, detail.html, agent-insights.html, completed-specs.html)

---

## Tasks

- [x] 1. Project scaffold and configuration
  - Create `index.html` with `<div id="root">` and a `<script type="module" src="/src/main.tsx">` entry point
  - Create `package.json` with exact pinned versions: `react@18.3.1`, `react-dom@18.3.1`, `react-router-dom@6.26.2`, `vite@5.4.10`, `sass@1.80.3`, `@types/react@18.3.12`, `@types/react-dom@18.3.1`, `typescript@5.6.3`, `@vitejs/plugin-react@4.3.3`; include `dev`, `build`, and `preview` scripts
  - Create `vite.config.ts` importing `@vitejs/plugin-react` and exporting `defineConfig({ plugins: [react()] })`
  - Create `tsconfig.json` with `"strict": true`, `"noEmit": true`, `"jsx": "react-jsx"`, `"module": "ESNext"`, `"moduleResolution": "bundler"`, `"resolveJsonModule": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`, and `"include": ["src"]`
  - Create `tsconfig.node.json` for the Vite config file
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Design system and global styles
  - Create `src/styles/_variables.scss` with all colour tokens (`$color-bg-primary`, `$color-bg-secondary`, `$color-bg-card`, `$color-bg-modal`, `$color-accent`, `$color-accent-hover`, `$color-blue-mid`, `$color-blue-bright`, `$color-text-primary`, `$color-text-secondary`, `$color-border`, `$color-overlay`, `$color-amber`, `$color-amber-bg`), tag colour tokens (`$tag-fat-loss: #e85d04`, `$tag-anti-aging: #7b2d8b`, `$tag-youthful-skin: #0077b6`, `$tag-muscle-recovery: #1db954`), typography tokens, spacing tokens (`$space-1` through `$space-16`), radius tokens, shadow tokens, and the `@mixin mobile` breakpoint mixin (`@media (max-width: 767px)`)
  - Create `src/styles/global.scss` that `@use`s `_variables.scss`, declares the full `:root` CSS custom properties block mirroring the approved mockup, applies CSS reset (`box-sizing: border-box`, zeroed margin/padding), sets `body` font/colour/background from design tokens, and imports the Inter font from Google Fonts
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Data layer and types
  - Create `src/types/peptide.ts` with the `PeptideTag` union type (`'Fat Loss' | 'Anti-Aging' | 'Youthful Skin' | 'Muscle Recovery'`) and the `Peptide` interface (`id`, `name`, `tags`, `shortDescription`, `benefits`, `imagePlaceholderUrl`, `researchNotes`, `suggestedDosage`)
  - Create `src/data/agentData.ts` with TypeScript interfaces `AgentStatus`, `TokenUsage`, `AgentHistoryItem`, `Agent`, and an exported `agents` array containing mock data for all 5 agents (Requirements Agent, UX Design Mockup Agent, Data Seed Agent, Human Review Gate, React Implementation Agent) including token usage figures per history item matching the design doc
  - Create `src/data/specsData.ts` with TypeScript interfaces `Spec`, `PromptHistoryItem`, `AgentTaskSummary`, and exported mock data arrays for all specs, prompt history entries, and agent task summaries matching the `completed-specs.html` mockup
  - Create `src/context/PeptideContext.tsx` with `PeptideContextValue` interface, `PeptideContext` created via `React.createContext`, `PeptideProvider` component (holding `activeFilter` and `searchQuery` state, computing `filteredPeptides` via `useMemo` with case-insensitive substring matching on `name` and `shortDescription` combined with tag filter), and exported `usePeptides` hook that throws if used outside the provider
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 4. Entry point and routing
  - Create `src/main.tsx` that calls `ReactDOM.createRoot` on `document.getElementById('root')` and renders `<React.StrictMode><BrowserRouter><PeptideProvider><App /></PeptideProvider></BrowserRouter></React.StrictMode>` with `global.scss` imported at the top
  - Create `src/App.tsx` that renders `<Routes>` with a single `<Route element={<Layout />}>` parent containing child routes: `path="/"` → `<ExplorePage>`, `path="/peptide/:id"` → `<DetailPage>`, `path="/agent-insights"` → `<AgentInsightsPage>`, `path="/completed-specs"` → `<CompletedSpecsPage>`
  - Create `src/components/Layout/Layout.tsx` that renders `<Nav />` followed by `<Outlet />` and `src/components/Layout/Layout.module.scss` for any layout-level styles
  - _Requirements: 1.3, 1.4, 4.1_

- [ ] 5. Shared components
  - [x] 5.1 Nav component
    - Create `src/components/Nav/Nav.tsx` with sticky positioning (`position: sticky; top: 0; z-index: 100`), frosted-glass background (`rgba(10,22,40,0.92)` with `backdrop-filter: blur(12px)`), bottom border, logo ("Peptide" in `var(--color-accent)` + "Helper" in `var(--color-text-primary)`), and `<NavLink>` links for Explore / Agent Insights / Completed Specs with active state applying `color: var(--color-accent)`
    - Create `src/components/Nav/Nav.module.scss` with all nav styles including `display: none` for `.nav-links` at `@include mobile`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 5.2 InternalBanner component
    - Create `src/components/InternalBanner/InternalBanner.tsx` rendering the amber warning banner "⚠ Internal Tool — Not part of the public app" (no props required)
    - Create `src/components/InternalBanner/InternalBanner.module.scss` with `background: var(--color-amber-bg)`, `border-bottom: 1px solid var(--color-amber)`, centred small uppercase amber text
    - _Requirements: 4.5_
  - [x] 5.3 TagBadge component
    - Create `src/components/TagBadge/TagBadge.tsx` accepting `{ tag: PeptideTag }` props and rendering a pill with the correct background colour per tag (`--tag-fat-loss`, `--tag-anti-aging`, `--tag-youthful-skin`, `--tag-muscle-recovery`); Muscle Recovery uses dark text (`var(--color-bg-primary)`) while the other three use white
    - Create `src/components/TagBadge/TagBadge.module.scss` with base pill styles (`border-radius: var(--radius-pill)`, 10px font, uppercase, semibold) and per-variant colour rules
    - _Requirements: 5.4_
  - [x] 5.4 PeptideCard component
    - Create `src/components/PeptideCard/PeptideCard.tsx` accepting `{ peptide: Peptide; onClick: (peptide: Peptide) => void }` props and rendering the card image (180 px height, `object-fit: cover`), name heading, `shortDescription`, and `<TagBadge>` components for each tag; the card root element handles the `onClick` prop
    - Create `src/components/PeptideCard/PeptideCard.module.scss` with card styles matching the mockup (dark card background, border, border-radius) and a desktop-only hover state (`transform: translateY(-4px)`, `box-shadow: var(--shadow-card)`, `border-color: var(--color-accent)`)
    - _Requirements: 5.4, 5.8_
  - [x] 5.5 FilterBar component
    - Create `src/components/FilterBar/FilterBar.tsx` accepting `{ activeFilter: string; onFilterChange: (tag: string) => void }` props and rendering 5 pill `<button>` elements ("All", "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery") with `aria-pressed` attributes reflecting active state; active button gets filled accent background with dark text, inactive gets transparent background with border
    - Create `src/components/FilterBar/FilterBar.module.scss` with desktop-centred flex layout and mobile horizontally-scrollable layout (`overflow-x: auto; scrollbar-width: none; justify-content: flex-start`)
    - _Requirements: 5.2, 5.9, 10.3_
  - [x] 5.6 SearchBar component
    - Create `src/components/SearchBar/SearchBar.tsx` accepting `{ searchQuery: string; onSearchChange: (query: string) => void }` props and rendering a search icon (inline SVG, absolutely positioned) beside a controlled `<input type="text">` with placeholder "Search peptides…"
    - Create `src/components/SearchBar/SearchBar.module.scss` with pill-shaped input (`border-radius: var(--radius-pill)`), left-padding to clear the icon, focus state that changes border to `var(--color-accent)`, and max-width 480 px centred
    - _Requirements: 5.3_
  - [x] 5.7 DetailModal component
    - Create `src/components/DetailModal/DetailModal.tsx` accepting `{ peptide: Peptide | null; onClose: () => void }` props; when `peptide` is null return null; when open render a fixed full-screen overlay (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-name"`) containing a scrollable inner panel with: full-width image (240 px), tag pills, `<h2 id="modal-name">`, `shortDescription`, Key Benefits (`✓`-prefixed list), Research Notes (blue-left-border cards), Suggested Dosage (gradient card), and "View Full Detail Page →" `<Link>`; implement `useEffect` Escape key listener; implement overlay-click-to-close (checking `event.target === overlayRef`); implement `useEffect` focus trap on open; restore focus to the triggering element on close
    - Create `src/components/DetailModal/DetailModal.module.scss` with overlay styles, inner modal panel styles (max-width 760 px, `max-height: 90vh`, `overflow-y: auto`), and `@keyframes modalIn` animation (`translateY(20px) → translateY(0)` + opacity, 0.25 s ease)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 11.3_

- [x] 6. Explore page
  - Create `src/pages/Explore/ExplorePage.tsx` consuming `usePeptides()` for `filteredPeptides`, `activeFilter`, `searchQuery`, `setActiveFilter`, `setSearchQuery`; render a hero section (eyebrow, `<h1>` with "Regenerative Potential" wrapped in `<em>` styled in accent colour, subtitle, smooth-scroll CTA `<a href="#explore">`); render a sticky controls bar (`top: 57px; z-index: 90`, `id="explore"`) containing `<SearchBar>` and `<FilterBar>`; render the card grid (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`); render a "No peptides found" empty state with 🔬 icon when `filteredPeptides.length === 0`; render `<DetailModal>` at component bottom with `selectedPeptide` state; implement `handleCardClick` using a `useWindowWidth`/`useIsMobile` hook — navigate to `/peptide/:id` on mobile, open modal on desktop
  - Create `src/pages/Explore/ExplorePage.module.scss` with hero styles, sticky controls bar, grid layout, single-column override at `@include mobile`, and empty-state styles
  - Implement `useIsMobile` hook (or `useWindowWidth`) using `window.matchMedia('(max-width: 767px)')` with an event listener for responsive changes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.9, 5.10, 5.11_

- [x] 7. Detail page
  - Create `src/pages/Detail/DetailPage.tsx` reading `:id` via `useParams()`, finding the peptide in `usePeptides().peptides`; if not found render a "Peptide not found" message with a `<Link to="/">` back link; if found render: `← Back to all peptides` `<Link to="/">` at the top, then a two-column desktop layout — left column (hero image, tag pills, `<h1>` name, `shortDescription`, dosage gradient card), right column (Benefits `✓`-list, Research Notes blue-border cards, Quick Stats sidebar, disclaimer text); include `useParams`-based URL handling for deep links and bookmarking
  - Create `src/pages/Detail/DetailPage.module.scss` with two-column grid on desktop and single-column stacked layout at `@include mobile` (image stacks above all text content)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 8. Agent Insights page
  - [x] 8.1 Agent status cards and history table
    - Create `src/pages/AgentInsights/AgentInsightsPage.tsx` rendering `<InternalBanner>` first, then a page header (eyebrow "Internal Dashboard", `<h1>Agent Insights</h1>`, subtitle), then the agent status cards grid (`grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))` — one card per agent showing name, status badge, description, current task), then `<AgentFlowchart>`, then the past task history table (columns: Agent, Task, Status, Date; rows from all agent history arrays sorted most-recent-first)
    - Create `src/pages/AgentInsights/AgentInsightsPage.module.scss` with page section styles, agent card styles, status badge colour variants (Completed green, In Progress blue, Pending grey, Blocked orange-red), and table styles
    - _Requirements: 8.1, 8.5, 8.6_
  - [x] 8.2 SVG flowchart and node detail panel
    - Create `src/pages/AgentInsights/AgentFlowchart.tsx` rendering an inline SVG flowchart matching the approved `agent-insights.html` mockup node layout; each node is a `<g>` element with an `onClick` handler that sets the selected agent ID; display total token usage computed by summing all agent history `tokenUsage.total` values as an always-visible summary metric (e.g., "Total tokens used: X") within the flowchart area
    - Create `src/pages/AgentInsights/NodeDetailPanel.tsx` accepting the selected `Agent | null` and an `onClose` callback; when an agent is selected render a panel showing agent name, description, status badge, and close button; apply `fadeIn` CSS animation on mount
    - _Requirements: 8.2, 8.3, 8.4_

- [x] 9. Completed Specs page
  - Create `src/pages/CompletedSpecs/CompletedSpecsPage.tsx` rendering `<InternalBanner>` first, then a page header (eyebrow "Internal Dashboard", `<h1>Completed Specs</h1>`, subtitle), then the progress overview grid (`grid-template-columns: repeat(4, 1fr)`, 2 cols on mobile) with four count cards (Vibe-Coded blue, Spec-Coded amber, Completed green, Yet to Complete grey), then the all-specs table (columns: Spec Name, Status badge, Description, Agent, Timestamp, Summary, Token Usage with input/output/total columns), then a token usage summary card displaying the sum of all spec row totals, then the agent task summary table (columns: Agent, Completed Tasks list, Count), then the prompt history section (chronological cards each showing date, prompt text, task chips)
  - Create `src/pages/CompletedSpecs/CompletedSpecsPage.module.scss` with grid styles, table styles, status badge colour variants matching the approved mockup, token summary card styles, and prompt history card styles
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 10. Responsive layout verification
  - Verify all SCSS modules use `@include mobile` (from `_variables.scss`) for all breakpoint overrides and contain no hardcoded colour, spacing, or font-size values
  - Verify Explore page card grid renders single column on mobile (`grid-template-columns: 1fr` at `@include mobile`) and multi-column on desktop
  - Verify FilterBar renders as horizontally scrollable single row on mobile (`overflow-x: auto; scrollbar-width: none`) and centred on desktop
  - Verify DetailPage stacks image above text content in a single column at `@include mobile` and shows two-column layout on desktop
  - Verify hero headline font size switches from `var(--font-size-heading-lg)` (desktop) to `var(--font-size-heading-sm)` (mobile) at the 768 px breakpoint
  - Verify nav links hidden on mobile (`display: none` at `@include mobile`) matching approved mockup behaviour
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 11. Accessibility and final verification
  - Verify all interactive elements (buttons, links, modal close button, filter pills, card click targets) have discernible accessible names via visible text or `aria-label`
  - Verify `DetailModal` focus trap is implemented correctly: first focusable element receives focus on open, Tab/Shift+Tab cycle only within the modal, focus returns to the triggering card element on close
  - Confirm `aria-pressed` attribute is applied to FilterBar pill buttons reflecting the current active state
  - Run `npm run build` (`tsc -b && vite build`) and confirm it exits with no TypeScript errors — strict mode (`noUnusedLocals`, `noUnusedParameters`) must pass clean
  - Navigate through all four routes and confirm no console errors or warnings appear during normal navigation and interaction
  - Verify no file under `src/` exceeds 300 lines of TypeScript/TSX and that all components are functional (no class components)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3"] },
    { "id": 2, "tasks": ["4"] },
    { "id": 3, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7"] },
    { "id": 4, "tasks": ["6", "7", "8.1", "9"] },
    { "id": 5, "tasks": ["8.2"] },
    { "id": 6, "tasks": ["10"] },
    { "id": 7, "tasks": ["11"] }
  ]
}
```

### Wave rationale

| Wave | Tasks        | Reason                                                                                                                                            |
| ---- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | 1            | Project scaffold must exist before any source files can be created                                                                                |
| 1    | 2, 3         | Design tokens (SCSS) and data types are independent; both can be written once the project root exists                                             |
| 2    | 4            | Entry point and routing depend on the context provider (task 3) and global styles (task 2)                                                        |
| 3    | 5.1–5.7      | Shared components depend on types (3), styles (2), and context (3); all seven sub-tasks are independent of each other                             |
| 4    | 6, 7, 8.1, 9 | Pages depend on all shared components (wave 3); Explore, Detail, AgentInsights (status cards only), and CompletedSpecs can be written in parallel |
| 5    | 8.2          | AgentFlowchart and NodeDetailPanel depend on AgentInsightsPage scaffold (8.1) being in place                                                      |
| 6    | 10           | Responsive verification requires all pages and components to be implemented                                                                       |
| 7    | 11           | Accessibility and build verification is the final gate after all implementation is complete                                                       |

---

## Notes

- All component SCSS modules must import variables via `@use '../../styles/variables' as *` and use only `var(--...)` CSS custom properties or `$`-prefixed SCSS variables — no hardcoded colour, spacing, or font-size values.
- The `@mixin mobile` breakpoint is defined in `_variables.scss` and must be used for all responsive overrides across every SCSS module.
- `peptides.json` is imported as a static ES module (`import peptidesJson from '../data/peptides.json'`) and cast to `Peptide[]` — no `fetch()` calls are used anywhere in the data layer.
- The `<InternalBanner>` component is rendered inside `AgentInsightsPage` and `CompletedSpecsPage` themselves (not in `Layout`), so it only appears on those routes.
- The `DetailModal` is only shown on Breakpoint_Desktop (≥ 768 px); on Breakpoint_Mobile card clicks navigate directly to `/peptide/:id`.
- All pinned dependency versions must match the design document exactly — do not upgrade or widen version ranges.
- Run `npm run build` after completing task 11 to confirm the full TypeScript strict-mode build passes before marking the spec complete.
