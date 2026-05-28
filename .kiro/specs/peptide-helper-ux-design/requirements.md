# Requirements Document

## Introduction

The Peptide Helper UX Design phase produces a complete set of static, single-file HTML/CSS/JS mockups and a seed data file for a health-tech React application. The deliverables serve as the visual and interaction blueprint that must be approved before React implementation begins. All mockups are saved in `/design-mockups/` at the project root. The data file is saved at `/src/data/peptides.json`. The design uses a modern dark health-tech theme (deep greens and blues, clean sans-serif typography) and is fully responsive across mobile, tablet, and desktop breakpoints.

Four HTML pages are required:

1. **index.html** — Public-facing homepage with hero banner, filter buttons, search bar, and peptide card grid.
2. **detail.html** — Public-facing full peptide detail page.
3. **agent-insights.html** — Internal living page showing agent flowcharts and task status.
4. **completed-specs.html** — Internal living page summarising all spec and task history.

A human approval gate is required: the React implementation phase MUST NOT begin until the mockups are explicitly approved.

---

## Glossary

- **Mockup**: A static, single-file HTML document containing all CSS and JS inline or in `<style>`/`<script>` tags, requiring no build step to open in a browser.
- **Design_System**: The shared colour palette, typography scale, spacing tokens, and component styles applied consistently across all mockups.
- **Peptide_Card**: A visual tile on the homepage grid displaying an image placeholder, peptide name, short tagline, and coloured category tags.
- **Filter_Bar**: The row of pill-style buttons (Fat Loss, Anti-Aging, Youthful Skin, Muscle Recovery, All) used to narrow the visible card grid.
- **Search_Bar**: A text input that filters the card grid in real time by peptide name or tagline.
- **Detail_View**: The full-information view for a single peptide, rendered as a modal overlay on desktop (≥ 768 px) and as a full-page swap on mobile (< 768 px).
- **Agent_Insights_Page**: An internal HTML page (not part of the public app) showing clickable agent flowcharts and per-agent task status.
- **Completed_Specs_Page**: An internal HTML page (not part of the public app) summarising all agents, prompts, tasks, and completion status.
- **Peptides_Data_File**: `/src/data/peptides.json` — a JSON array of 10 peptide objects used to populate the mockups and seed the React implementation.
- **Approval_Gate**: The explicit human sign-off step that must occur before any React implementation work begins.
- **Breakpoint_Mobile**: Viewport width < 768 px.
- **Breakpoint_Desktop**: Viewport width ≥ 768 px.

---

## Requirements

### Requirement 1: Design System

**User Story:** As a developer, I want a consistent visual design system applied across all mockups, so that the React implementation can extract tokens and components without redesign work.

#### Acceptance Criteria

1. THE Design_System SHALL define a colour palette using deep greens (primary: `#0d2b1e`, accent: `#1db954`), deep blues (`#0a1628`, `#1a3a5c`), and neutral whites/greys for text (`#f0f4f0`, `#a0b0a8`).
2. THE Design_System SHALL define a typography scale using the font stack `'Inter', system-ui, sans-serif` with exactly four named size levels: body (16 px), label (12 px), heading-sm (20 px), heading-lg (36 px).
3. THE Design_System SHALL define spacing tokens in multiples of 4 px: `--space-1` (4 px), `--space-2` (8 px), `--space-3` (12 px), `--space-4` (16 px), `--space-6` (24 px), `--space-8` (32 px), `--space-12` (48 px), `--space-16` (64 px).
4. THE Design_System SHALL define border-radius tokens: `--radius-sm` (4 px), `--radius-md` (8 px), `--radius-pill` (9999 px); and shadow tokens: `--shadow-card` and `--shadow-modal`.
5. THE Design_System SHALL be expressed as CSS custom properties in a single `:root` block that is the sole source of truth for all token values; no hardcoded colour, font-size, spacing, radius, or shadow values SHALL appear outside the `:root` block in any mockup file.
6. WHEN a Design_System token value must change, THE change SHALL be made only in the `:root` block of the affected mockup file, and a comment SHALL be added adjacent to the changed property noting the date and reason for the change.

---

### Requirement 2: Peptide Data File

**User Story:** As a developer, I want a structured JSON data file with 10 real peptides, so that the mockups are populated with realistic content and the file can be imported directly into the React app.

#### Acceptance Criteria

1. THE Peptides_Data_File SHALL contain a JSON array of exactly 10 peptide objects.
2. EACH peptide object SHALL include the following fields with the specified constraints:
   - `id`: string, kebab-case, unique across all 10 objects
   - `name`: string, non-empty
   - `tags`: array of one or more strings, each from the set: "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery"
   - `shortDescription`: string, 1–160 characters inclusive
   - `benefits`: array of one or more strings
   - `imagePlaceholderUrl`: string, well-formed absolute URL beginning with `https://`
   - `researchNotes`: array of one or more strings referencing publicly available knowledge
   - `suggestedDosage`: string, 1–200 characters inclusive
3. IF any peptide object is missing any required field or violates any field constraint, THEN THE Peptides_Data_File SHALL be considered entirely invalid; no peptides from the file SHALL be used until all objects are complete and conformant.
4. THE Peptides_Data_File SHALL be saved at the path `/src/data/peptides.json` relative to the project root.
5. EACH peptide SHALL have at least one tag from the defined filter set so that every peptide appears under at least one filter category.

---

### Requirement 3: Homepage (index.html)

**User Story:** As a user, I want a visually engaging homepage with filtering and search, so that I can quickly find peptides relevant to my health goals.

#### Acceptance Criteria

1. THE index.html Mockup SHALL include a Hero Banner section with a headline, sub-headline, and a call-to-action element styled using Design_System tokens.
2. THE index.html Mockup SHALL include a Filter_Bar with pill-style buttons for the categories: "All", "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery".
3. WHEN a keystroke occurs in the Search_Bar, THE index.html Mockup SHALL filter the visible Peptide_Card grid in real time by performing a case-insensitive substring match against each peptide's `name` and `shortDescription` fields.
4. THE index.html Mockup SHALL render a responsive grid of Peptide_Cards populated from the inlined peptide data constant.
5. EACH Peptide_Card SHALL display: an image placeholder, the peptide name, the short tagline (`shortDescription`), and coloured category tags.
6. WHEN a Filter_Bar button is clicked, THE index.html Mockup SHALL show only Peptide_Cards whose `tags` array includes the selected category AND whose `name` or `shortDescription` matches the current Search_Bar value; clicking "All" SHALL apply only the Search_Bar filter with no category restriction.
7. WHEN a Filter_Bar button is active, THE index.html Mockup SHALL render that button with a filled `var(--color-accent)` background and `var(--color-bg-primary)` text; all inactive buttons SHALL render with a transparent background and `var(--color-text-primary)` text.
8. WHEN a Peptide_Card is clicked on a Breakpoint_Desktop viewport, THE index.html Mockup SHALL open the Detail_View as a modal overlay without navigating away from the page.
9. WHEN a Peptide_Card is clicked on a Breakpoint_Mobile viewport, THE index.html Mockup SHALL replace the page content with the Detail_View (full-page swap).
10. WHEN the Detail_View is closed, THE index.html Mockup SHALL restore the card grid with the previously active Filter_Bar selection and Search_Bar value preserved.
11. WHEN no Peptide_Cards match the active filter and search combination, THE index.html Mockup SHALL display a visible "No peptides found" message in place of the card grid.
12. WHILE the viewport width is at or above 768 px, THE index.html Mockup SHALL apply hover states to Peptide_Cards consisting of an elevated `var(--shadow-card)` and a `var(--color-accent)` border highlight.
13. WHEN the index.html Mockup first loads, THE index.html Mockup SHALL display the "All" Filter_Bar button in its active state and all Peptide_Cards visible.

---

### Requirement 4: Detail Page (detail.html)

**User Story:** As a user, I want a dedicated detail page for each peptide, so that I can read comprehensive information including benefits, research notes, and dosage guidance.

#### Acceptance Criteria

1. THE detail.html Mockup SHALL display the peptide `name` as the primary `<h1>` heading using the `heading-lg` typography token.
2. THE detail.html Mockup SHALL display the `shortDescription` field as a subtitle beneath the primary heading.
3. THE detail.html Mockup SHALL display the `benefits` array as a `<ul>` or `<ol>` element where each item has a visible bullet or marker styled using Design_System tokens.
4. THE detail.html Mockup SHALL display the `researchNotes` array in a section with a visible heading label "Research Notes".
5. THE detail.html Mockup SHALL display the `suggestedDosage` string in a section with a visible heading label "Suggested Dosage".
6. THE detail.html Mockup SHALL display the `imagePlaceholderUrl` image in a prominent position at the top of the content area, above the benefits and notes sections.
7. THE detail.html Mockup SHALL display all `tags` values as coloured pill badges using `var(--radius-pill)` and tag-specific background colours consistent with the Filter_Bar tag colours on index.html.
8. THE detail.html Mockup SHALL include a navigation control labelled "← Back to all peptides" that links to index.html.
9. WHEN the viewport width is below 768 px, THE detail.html Mockup SHALL stack the image above the text content vertically; WHEN the viewport width is at or above 768 px, THE detail.html Mockup SHALL display the image and text content side-by-side.
10. THE detail.html Mockup SHALL be pre-populated with data from the first peptide object in the Peptides_Data_File array.

---

### Requirement 5: Agent Insights Page (agent-insights.html)

**User Story:** As a project team member, I want a living internal page showing agent flowcharts and task status, so that I can monitor the progress and structure of all agents built for this project.

#### Acceptance Criteria

1. THE Agent_Insights_Page SHALL display a clickable flowchart for each agent created in the project, rendered using inline SVG or vanilla JS canvas; no external CDN dependencies SHALL be required.
2. WHEN a flowchart node is clicked, THE Agent_Insights_Page SHALL display a detail panel (not a browser tooltip) showing the agent's name, description, and current task status.
3. THE Agent_Insights_Page SHALL display a current task status section for each agent showing: agent name, current task label, and a status badge with one of the values: "Pending", "In Progress", "Completed", "Blocked".
4. THE Agent_Insights_Page SHALL display a past task history list for each agent showing previously completed tasks in reverse-chronological order (most recent first).
5. THE Agent_Insights_Page SHALL display the text "⚠ Internal Tool — Not part of the public app" in the page header using a visually distinct style (e.g., amber background banner).
6. THE Agent_Insights_Page SHALL use only CSS custom properties defined in its `:root` block, matching the Design_System token names and values from Requirement 1.
7. THE Agent_Insights_Page SHALL be a single self-contained `.html` file with all CSS in `<style>` tags and all JS in `<script>` tags; the page SHALL function correctly when opened via `file://` protocol.

---

### Requirement 6: Completed Specs Page (completed-specs.html)

**User Story:** As a project team member, I want a living internal page summarising all spec and task history, so that I have a detailed overview of everything worked on across vibe-coded, spec-coded, completed, and yet-to-be-completed work.

#### Acceptance Criteria

1. THE Completed_Specs_Page SHALL display a summary table listing each agent and the tasks that agent has completed.
2. THE Completed_Specs_Page SHALL display a section for each spec showing: spec name, status badge (one of: "Vibe-Coded", "Spec-Coded", "Completed", "Yet to be Completed"), and a description of ≤ 160 characters.
3. THE Completed_Specs_Page SHALL display a prompt history section listing past prompts and the tasks they generated in chronological order (oldest first).
4. THE Completed_Specs_Page SHALL display a progress overview showing the count of specs in each of the four status categories as numeric values.
5. THE Completed_Specs_Page SHALL display the text "⚠ Internal Tool — Not part of the public app" in the page header using a visually distinct style matching the Agent_Insights_Page header banner.
6. THE Completed_Specs_Page SHALL use only CSS custom properties defined in its `:root` block, matching the Design_System token names and values from Requirement 1.
7. THE Completed_Specs_Page SHALL be a single self-contained `.html` file with all CSS in `<style>` tags and all JS in `<script>` tags; the page SHALL function correctly when opened via `file://` protocol.

---

### Requirement 7: Responsive Layout

**User Story:** As a user on any device, I want all public-facing pages to be fully responsive, so that the experience is usable and visually correct on mobile, tablet, and desktop screens.

#### Acceptance Criteria

1. THE index.html Mockup SHALL render the Peptide_Card grid as a single column when the viewport width is below 768 px and as a grid of 3 or more columns when the viewport width is at or above 768 px.
2. THE index.html Mockup SHALL render the Filter_Bar as a horizontally scrollable single row (no wrapping) when the viewport width is below 768 px.
3. WHEN the viewport width is below 768 px, THE detail.html Mockup SHALL stack the image above the text content; WHEN the viewport width is at or above 768 px, THE detail.html Mockup SHALL display the image and text content side-by-side.
4. THE index.html Mockup SHALL render the Hero Banner headline using the `heading-sm` (20 px) typography token when the viewport width is below 768 px and the `heading-lg` (36 px) token when the viewport width is at or above 768 px.
5. WHEN the viewport is resized across the 768 px boundary, THE index.html Mockup SHALL switch between modal and full-page-swap Detail_View behaviour without requiring a page reload.

---

### Requirement 8: Human Approval Gate

**User Story:** As a project stakeholder, I want an explicit approval step before React implementation begins, so that design decisions are validated before engineering effort is invested.

#### Acceptance Criteria

1. THE Approval_Gate SHALL be documented as a required step in this requirements document, explicitly stating that React component implementation SHALL NOT begin until sign-off is received.
2. WHEN all four mockup files and the Peptides_Data_File are delivered, THE Approval_Gate SHALL immediately require explicit written sign-off from a project stakeholder; sign-off SHALL NOT be deferred to a later stage.
3. IF the Approval_Gate has not been passed, THEN THE React_Implementation_Phase SHALL NOT begin.
4. THE Approval_Gate review checklist SHALL cover: visual design consistency with the Design_System, responsive behaviour at Breakpoint_Mobile and Breakpoint_Desktop, interactive JS functionality (filtering, search, modal, hover states), data accuracy and completeness of the Peptides_Data_File, and presence of all four HTML mockup files.

---

### Requirement 9: Mockup File Constraints

**User Story:** As a developer, I want each mockup to be a self-contained single HTML file, so that designs can be opened and reviewed in any browser without a build step or server.

#### Acceptance Criteria

1. EACH mockup file SHALL be a single `.html` file with all CSS contained in `<style>` tags and all JavaScript contained in `<script>` tags within the same file; no external `.css` or `.js` files SHALL be referenced.
2. EACH mockup file SHALL be saved in the `/design-mockups/` directory at the project root.
3. THE index.html Mockup SHALL declare the peptide data as an inline JavaScript `const PEPTIDES = [...]` constant so the page functions without a server or fetch request.
4. EACH mockup file SHALL open and function correctly when loaded via `file://` protocol in the current stable release of Chrome, Firefox, or Safari.
5. IF an external font is used, THEN THE mockup SHALL include a `<link>` to a CDN-hosted font as the only permitted external dependency, AND the font stack SHALL include a system-ui fallback so the page remains usable if the CDN is unreachable.
