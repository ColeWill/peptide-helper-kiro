# Requirements Document

## Introduction

The React Implementation phase converts the approved static HTML/CSS/JS mockups in `/design-mockups/` into a production-ready single-page React application using Vite + React + TypeScript + SCSS. The application faithfully reproduces the dark health-tech design system (deep greens/blues, Inter font, CSS custom properties) from the approved mockups and is fully interactive: live search, tag filtering, modal/detail navigation, and responsive layout. No backend is required; all data is served from the local JSON file at `/src/data/peptides.json`. Four route/view areas are required: the public Explore page (home), the Peptide Detail page, the Agent Insights internal page, and the Completed Specs internal page. The output must be a complete, runnable project so the user can execute `npm install && npm run dev` immediately.

---

## Glossary

- **React_App**: The Vite + React + TypeScript + SCSS single-page application produced by this implementation phase.
- **Design_System**: The shared colour palette, typography scale, spacing tokens, and component styles defined in the approved mockups and reproduced as SCSS variables/mixins.
- **Peptide_Card**: A visual tile rendered in the Explore page card grid showing image, name, short description, and coloured category tags.
- **Filter_Bar**: The row of pill-style category filter buttons (All, Fat Loss, Anti-Aging, Youthful Skin, Muscle Recovery).
- **Search_Bar**: The text input that filters the card grid in real time.
- **Detail_Modal**: The overlay panel displayed on desktop (≥ 768 px) when a Peptide_Card is clicked, showing full peptide information.
- **Detail_Page**: The full-page route at `/peptide/:id` showing complete peptide information for any peptide ID.
- **Agent_Insights_Page**: The internal route showing the clickable SVG agent flowchart, per-agent status cards, token usage, and task history table.
- **Completed_Specs_Page**: The internal route showing the specs summary table with token usage per row, prompt history, agent task summary, and progress overview.
- **PeptideContext**: The React context that provides peptide data and filtering state to all components.
- **Breakpoint_Mobile**: Viewport width < 768 px.
- **Breakpoint_Desktop**: Viewport width ≥ 768 px.
- **Token_Usage**: Simulated LLM token consumption figures (input tokens, output tokens, total) associated with each agent task row, displayed in the Completed_Specs_Page table and as a total in the Agent_Insights_Page flowchart.

---

## Requirements

### Requirement 1: Project Scaffold and Build Configuration

**User Story:** As a developer, I want a correctly configured Vite + React + TypeScript project, so that I can run `npm install && npm run dev` and immediately see a working app with hot-module replacement.

#### Acceptance Criteria

1. THE React_App SHALL be scaffolded with Vite using the `react-ts` template; the root `package.json` SHALL list `vite`, `react`, `react-dom`, `react-router-dom`, `sass`, and their TypeScript type packages as dependencies or devDependencies with exact pinned versions.
2. THE React_App SHALL compile without TypeScript errors when `npm run build` is executed.
3. THE React_App entry point SHALL be `src/main.tsx`, which mounts the root `<App />` component into a `<div id="root">` element in `index.html`.
4. THE React_App SHALL configure React Router v6 with a `<BrowserRouter>` wrapping the route tree; BOTH the `<BrowserRouter>` wrapper AND routes SHALL be required — the build SHALL fail if either is missing; routes SHALL include `/` (Explore), `/peptide/:id` (Detail), `/agent-insights`, and `/completed-specs`.
5. THE React_App SHALL include a `vite.config.ts` that sets the project root and output directory; no additional server-side configuration SHALL be required.
6. IF the `npm run dev` command is executed, THEN THE React_App SHALL start a local Vite development server and serve the application at `http://localhost:5173` (or the next available port) with hot-module replacement enabled.

---

### Requirement 2: Design System (SCSS)

**User Story:** As a developer, I want all Design_System tokens from the approved mockups expressed as SCSS variables and applied via a shared stylesheet, so that the visual output is pixel-consistent with the approved mockups.

#### Acceptance Criteria

1. THE React_App SHALL include a `src/styles/_variables.scss` file declaring all CSS custom property values from the approved mockup `:root` block as SCSS variables: colours (`$color-bg-primary`, `$color-bg-secondary`, `$color-bg-card`, `$color-accent`, `$color-accent-hover`, `$color-blue-mid`, `$color-blue-bright`, `$color-text-primary`, `$color-text-secondary`, `$color-border`), typography scale (`$font-size-label`, `$font-size-body`, `$font-size-heading-sm`, `$font-size-heading-lg`), spacing tokens (`$space-1` through `$space-16`), radius tokens (`$radius-sm`, `$radius-md`, `$radius-pill`), and shadow tokens (`$shadow-card`, `$shadow-modal`).
2. THE React_App SHALL include a `src/styles/global.scss` file that imports `_variables.scss`, declares the `:root` CSS custom properties block identical to the approved mockup, applies a CSS reset (`box-sizing: border-box`, margin/padding zeroed), sets `body` font/colour/background from Design_System tokens, and imports the Inter font from Google Fonts.
3. WHEN any Design_System token value must change, THE change SHALL be made only in `_variables.scss`; no hardcoded colour, font-size, spacing, radius, or shadow value SHALL appear in component SCSS files.
4. THE React_App tag colour variables SHALL include: `$tag-fat-loss: #e85d04`, `$tag-anti-aging: #7b2d8b`, `$tag-youthful-skin: #0077b6`, `$tag-muscle-recovery: #1db954`.

---

### Requirement 3: Data Layer

**User Story:** As a developer, I want a typed data layer that imports the existing peptides.json and exposes it through a React context, so that all components have consistent, type-safe access to peptide data without any network requests.

#### Acceptance Criteria

1. THE React_App SHALL define a TypeScript interface `Peptide` in `src/types/peptide.ts` with fields matching the JSON schema: `id: string`, `name: string`, `tags: PeptideTag[]`, `shortDescription: string`, `benefits: string[]`, `imagePlaceholderUrl: string`, `researchNotes: string[]`, `suggestedDosage: string`.
2. THE React_App SHALL define a TypeScript union type `PeptideTag` equal to `'Fat Loss' | 'Anti-Aging' | 'Youthful Skin' | 'Muscle Recovery'`.
3. THE React_App SHALL import `/src/data/peptides.json` directly in the data layer using a static ES module import and cast it to `Peptide[]`; no `fetch()` calls SHALL be used for peptide data.
4. THE React_App SHALL expose peptide data via a `PeptideContext` created with `React.createContext`; the context value SHALL include: `peptides: Peptide[]`, `filteredPeptides: Peptide[]`, `activeFilter: string`, `searchQuery: string`, `setActiveFilter: (tag: string) => void`, `setSearchQuery: (query: string) => void`.
5. WHEN `activeFilter` is `'All'` and `searchQuery` is empty, THE `filteredPeptides` array SHALL equal the full `peptides` array.
6. WHEN `searchQuery` changes, THE `filteredPeptides` array SHALL be recomputed using a case-insensitive substring match against each peptide's `name` and `shortDescription` fields, combined with the active tag filter.
7. WHEN `activeFilter` is set to a specific tag, THE `filteredPeptides` array SHALL contain only peptides whose `tags` array includes that tag, also applying the current `searchQuery` filter.

---

### Requirement 4: Navigation and Layout Shell

**User Story:** As a user, I want a persistent navigation bar and consistent layout shell, so that I can move between pages without losing context.

#### Acceptance Criteria

1. THE React_App SHALL render a `<Nav>` component on every route; the nav SHALL display the logo ("Peptide" in accent colour + "Helper" in primary text colour) and navigation links: "Explore" (`/`), "Agent Insights" (`/agent-insights`), "Completed Specs" (`/completed-specs`).
2. WHEN a nav link corresponds to the currently active route, THE `<Nav>` component SHALL apply an active style using `var(--color-accent)` text colour to that link; WHEN the current route does not match any nav link, THE `<Nav>` component SHALL highlight "Explore" as the default active link.
3. THE nav SHALL be `position: sticky; top: 0` with `backdrop-filter: blur(12px)` matching the approved mockup.
4. WHEN the viewport width is below 768 px, THE `<Nav>` component SHALL hide the nav links (hamburger menu is not required; links may simply be hidden as in the mockup).
5. THE Agent_Insights_Page and Completed_Specs_Page SHALL render an internal banner reading "⚠ Internal Tool — Not part of the public app" above the nav in amber styling matching the approved mockups.

---

### Requirement 5: Explore Page (Home)

**User Story:** As a user, I want a visually engaging homepage with a hero section, filter bar, live search, and responsive card grid, so that I can quickly find peptides relevant to my health goals.

#### Acceptance Criteria

1. THE Explore page SHALL render a hero section with eyebrow text, headline ("Unlock Your Body's Regenerative Potential" with "Regenerative Potential" in accent colour), subtitle, and a CTA button that smooth-scrolls to the card grid section.
2. THE Explore page SHALL render the `Filter_Bar` with pill-style buttons for "All", "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery"; the active button SHALL have a filled `var(--color-accent)` background with `var(--color-bg-primary)` text; inactive buttons SHALL have transparent background with `var(--color-text-primary)` text.
3. THE Explore page SHALL render the `Search_Bar` with a search icon; WHEN a keystroke occurs in the `Search_Bar`, THE `filteredPeptides` list SHALL update in real time through the `PeptideContext`.
4. THE Explore page SHALL render a responsive card grid using `filteredPeptides` from `PeptideContext`; each `Peptide_Card` SHALL display the peptide image, name, `shortDescription`, and coloured category tag pills.
5. WHEN a `Peptide_Card` is clicked on a Breakpoint_Desktop viewport (≥ 768 px), THE Explore page SHALL open the `Detail_Modal` without navigating away from the page.
6. WHEN a `Peptide_Card` is clicked on a Breakpoint_Mobile viewport (< 768 px), THE Explore page SHALL navigate to `/peptide/:id`.
7. WHEN no `filteredPeptides` are present after applying filter and search, THE Explore page SHALL display a "No peptides found" empty state message with a 🔬 icon.
8. WHEN the viewport width is at or above 768 px, THE Explore page SHALL apply hover states to `Peptide_Card` components: `transform: translateY(-4px)`, `box-shadow: var(--shadow-card)`, and a `var(--color-accent)` border highlight.
9. WHEN the Explore page first loads, THE `activeFilter` SHALL be "All" and all peptides SHALL be visible.
10. THE card grid SHALL render as a single column when the viewport width is below 768 px and as a multi-column grid (minimum 280 px per column) when the viewport width is at or above 768 px.
11. THE `Filter_Bar` SHALL render as a horizontally scrollable single row without wrapping when the viewport width is below 768 px.

---

### Requirement 6: Detail Modal (Desktop)

**User Story:** As a desktop user, I want a modal overlay with full peptide details when I click a card, so that I can read comprehensive information without leaving the Explore page.

#### Acceptance Criteria

1. THE `Detail_Modal` SHALL be rendered as a fixed-position overlay with `backdrop-filter: blur(4px)` and a dark semi-transparent background.
2. WHEN the `Detail_Modal` is open, THE `Detail_Modal` SHALL display: the peptide image, coloured tag pills, peptide name as heading, `shortDescription`, "Key Benefits" section (bulleted list with `✓` markers in accent colour), "Research Notes" section (cards with blue-left border), "Suggested Dosage" section (gradient card), and a "View Full Detail Page →" link to `/peptide/:id`.
3. THE `Detail_Modal` SHALL include a close button (✕); WHEN the close button is clicked or the overlay background is clicked, THE modal SHALL close and return focus to the card grid.
4. WHEN the `Detail_Modal` opens, THE modal SHALL animate in using a `translateY(20px) → translateY(0)` + opacity transition matching the approved mockup.
5. WHEN the `Detail_Modal` is open, THE Filter_Bar selection and Search_Bar value SHALL be preserved in `PeptideContext` so that closing the modal restores the previous grid state.
6. THE `Detail_Modal` SHALL be accessible: the overlay element SHALL have `role="dialog"` and `aria-modal="true"`, and the modal SHALL trap keyboard focus while open.

---

### Requirement 7: Detail Page (`/peptide/:id`)

**User Story:** As a user navigating to a peptide detail URL directly or from mobile, I want a full-page view with comprehensive peptide information, so that I can bookmark and share a specific peptide.

#### Acceptance Criteria

1. THE Detail_Page SHALL read the `:id` URL parameter using React Router's `useParams` hook and locate the matching peptide in the `PeptideContext` `peptides` array.
2. THE Detail_Page SHALL render the two-column layout matching the approved `detail.html` mockup: left column contains the hero image and meta (tags, name, subtitle, dosage pill); right side contains benefits list and research notes; a sidebar contains Quick Stats and disclaimer.
3. THE Detail_Page SHALL display all fields: `name` as `<h1>` in `heading-lg` size, `shortDescription`, coloured tag pills, `benefits` as a bulleted list with `✓` markers, `researchNotes` as styled cards with a blue left border, and `suggestedDosage` in a dosage card.
4. THE Detail_Page SHALL include a "← Back to all peptides" navigation link that navigates to `/` using React Router's `<Link>` component.
5. IF the `:id` parameter does not match any peptide in the data, THEN THE Detail_Page SHALL render a "Peptide not found" message with a link back to `/`; all page components (navigation back link from AC4, hero area, benefits, research notes) SHALL remain visible with empty or placeholder content alongside the not-found message.
6. WHEN the viewport width is below 768 px, THE Detail_Page SHALL stack the image above the text content in a single column; WHEN the viewport width is at or above 768 px, THE Detail_Page SHALL render the two-column layout.

---

### Requirement 8: Agent Insights Page (`/agent-insights`)

**User Story:** As a project team member, I want an interactive agent insights page showing the flowchart, per-agent status cards, token usage totals, and task history, so that I can monitor the project's agent-driven progress.

#### Acceptance Criteria

1. THE Agent_Insights_Page SHALL render agent status cards for all five agents (Requirements Agent, UX Design Mockup Agent, Data Seed Agent, Human Review Gate, React Implementation Agent), each showing agent name, status badge, description, and current task label — matching the approved `agent-insights.html` mockup.
2. THE Agent_Insights_Page SHALL render the SVG flowchart matching the approved mockup's node layout; each SVG node SHALL be clickable.
3. WHEN a flowchart node is clicked, THE Agent_Insights_Page SHALL display a detail panel below the flowchart showing the agent's name, description, and current status badge; the panel SHALL animate in with a `fadeIn` transition.
4. THE Agent_Insights_Page SHALL display token usage totals within the flowchart area regardless of flowchart state; the total token usage across all agents SHALL be computed by summing all agent task token figures and displayed as a summary metric (e.g., "Total tokens used: X") that is always visible on the page.
5. THE Agent_Insights_Page SHALL render a past task history table with columns: Agent, Task, Status, Date — populated from mock task history data defined in a TypeScript data file.
6. THE status badge for each agent SHALL use one of four states — "Completed" (green), "In Progress" (blue), "Pending" (grey), "Blocked" (orange-red) — with matching background/text colours from the Design_System.

---

### Requirement 9: Completed Specs Page (`/completed-specs`)

**User Story:** As a project team member, I want a completed specs page showing a specs summary table with token usage, prompt history, agent task summary, and progress overview, so that I have a detailed audit trail of all work.

#### Acceptance Criteria

1. THE Completed_Specs_Page SHALL render a progress overview grid with four count cards: "Vibe-Coded" (blue), "Spec-Coded" (amber), "Completed" (green), "Yet to Complete" (grey) — displaying the count of specs in each category.
2. THE Completed_Specs_Page SHALL render a specs summary table with columns: Spec Name, Status (badge), Description, Agent, Timestamp, Summary, Token Usage — each row populated from a TypeScript mock data file.
3. EACH row in the specs summary table SHALL display a token usage column showing input tokens, output tokens, and total tokens for that agent's work on that spec.
4. THE Completed_Specs_Page SHALL display a total token usage figure in a summary area that sums all per-row token usage values.
5. THE Completed_Specs_Page SHALL render an agent task summary table listing each agent and the tasks that agent has completed, with a task count.
6. THE Completed_Specs_Page SHALL render a prompt history section showing each prompt with its date, prompt text, and the task chips it generated — in chronological order.
7. THE status badge for each spec SHALL use the same badge colour system as defined in the approved `completed-specs.html` mockup: Vibe-Coded (blue), Spec-Coded (amber), Completed (green), Yet to be Completed (grey).

---

### Requirement 10: Responsiveness

**User Story:** As a user on any device, I want all pages to be fully responsive, so that the experience is correct on mobile, tablet, and desktop screens.

#### Acceptance Criteria

1. THE React_App SHALL define two responsive breakpoints: Breakpoint_Mobile (< 768 px) and Breakpoint_Desktop (≥ 768 px); all layout changes SHALL be driven by these breakpoints using SCSS media queries.
2. THE Explore page card grid SHALL render as a single column at Breakpoint_Mobile and as a `repeat(auto-fill, minmax(280px, 1fr))` grid at Breakpoint_Desktop.
3. THE Filter_Bar SHALL render as a horizontally scrollable row with no wrapping at Breakpoint_Mobile and centred at Breakpoint_Desktop.
4. THE Detail_Page SHALL stack image above text at Breakpoint_Mobile and display side-by-side at Breakpoint_Desktop.
5. THE Hero section headline SHALL use `$font-size-heading-sm` (20 px) at Breakpoint_Mobile and `$font-size-heading-lg` (36 px) at Breakpoint_Desktop.
6. THE nav links SHALL be hidden at Breakpoint_Mobile (display: none) matching the approved mockup behaviour.

---

### Requirement 11: Accessibility and Code Quality

**User Story:** As a developer, I want the codebase to follow modern React and TypeScript best practices and meet baseline accessibility requirements, so that the application is maintainable and usable by all users.

#### Acceptance Criteria

1. THE React_App SHALL use functional components exclusively; class components SHALL NOT be used.
2. ALL interactive elements (buttons, links, modal close) SHALL have discernible accessible names via visible text or `aria-label`.
3. THE `Detail_Modal` SHALL trap focus while open and restore focus to the triggering element when closed.
4. THE React_App SHALL use TypeScript strict mode; the `tsconfig.json` SHALL include `"strict": true`.
5. THE React_App SHALL have no console errors or warnings during normal navigation and interaction.
6. EACH component SHALL be defined in its own file under `src/components/` or the relevant page directory; no file SHALL exceed 300 lines of TypeScript/TSX.
