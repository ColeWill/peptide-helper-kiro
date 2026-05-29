# Peptide Helper UX Design — Approval Gate Checklist

> **Requirement 8.1 / 8.2 / 8.4** — This checklist must be completed and signed off
> before any React component implementation begins. React implementation **SHALL NOT**
> start until the Decision field below is set to **Approved** and the reviewer has
> signed off.

---

## 1. Visual Design Consistency (Design System Tokens)

Verify that all four mockup files apply the shared Design System tokens correctly.

- [ ] `--color-bg-primary` (`#0a1628`) is used as the page background in all four files
- [ ] `--color-accent` (`#1db954`) is used for interactive highlights (active filter button, hover border, CTA) in all four files
- [ ] `--color-text-primary` (`#f0f4f0`) and `--color-text-secondary` (`#a0b0a8`) are used for body and label text
- [ ] Typography uses the `'Inter', system-ui, sans-serif` font stack throughout
- [ ] Font sizes match the four named scale levels: body (16 px), label (12 px), heading-sm (20 px), heading-lg (36 px)
- [ ] Spacing between elements visibly follows the 4 px grid (multiples of 4 px)
- [ ] Border-radius tokens are applied: `--radius-sm` on inputs/small elements, `--radius-md` on cards, `--radius-pill` on filter buttons and tag badges
- [ ] Card and modal shadows (`--shadow-card`, `--shadow-modal`) are visually present and consistent
- [ ] No hardcoded hex colour, bare `px` font-size, or bare `px` spacing values appear outside the `:root` block in any file

**Notes:**

---

## 2. Responsive Behaviour

Test each breakpoint by resizing the browser window across the 768 px boundary.

### Mobile (viewport width < 768 px)

- [ ] `index.html` — Peptide card grid renders as a **single column**
- [ ] `index.html` — Filter bar is a **horizontally scrollable single row** (no wrapping)
- [ ] `index.html` — Hero banner headline uses the `heading-sm` (20 px) token
- [ ] `index.html` — Clicking a peptide card triggers a **full-page swap** to the Detail View (no modal overlay)
- [ ] `detail.html` — Image is stacked **above** the text content (vertical layout)

### Desktop (viewport width ≥ 768 px)

- [ ] `index.html` — Peptide card grid renders as **3 or more columns**
- [ ] `index.html` — Hero banner headline uses the `heading-lg` (36 px) token
- [ ] `index.html` — Clicking a peptide card opens the Detail View as a **modal overlay** (page does not navigate away)
- [ ] `detail.html` — Image and text content are displayed **side-by-side** (horizontal layout)

### Resize Transition

- [ ] Resizing the viewport across the 768 px boundary switches between modal and full-page-swap behaviour **without a page reload**

**Notes:**

---

## 3. Interactive JavaScript Functionality

Open `index.html` via `file://` and exercise each interactive feature.

### Filter Bar

- [ ] All five filter buttons are present: **All**, **Fat Loss**, **Anti-Aging**, **Youthful Skin**, **Muscle Recovery**
- [ ] On first load, the **"All"** button is active (filled accent background, dark text) and all 10 peptide cards are visible
- [ ] Clicking a category button shows **only cards whose `tags` include that category**
- [ ] The active button renders with `var(--color-accent)` background and `var(--color-bg-primary)` text; inactive buttons render with transparent background and `var(--color-text-primary)` text
- [ ] Clicking **"All"** removes the category restriction and shows all cards (subject to search)

### Search Bar

- [ ] Typing in the search bar **filters cards in real time** (no submit required)
- [ ] Filtering is **case-insensitive** and matches against both `name` and `shortDescription`
- [ ] Filter bar category selection and search bar value are applied **simultaneously** (intersection)

### "No Results" State

- [ ] When no cards match the active filter + search combination, a visible **"No peptides found"** message is displayed in place of the card grid

### Modal / Detail View (Desktop ≥ 768 px)

- [ ] Clicking a card opens the **modal overlay** without navigating away
- [ ] The modal displays the peptide's name, description, benefits, research notes, dosage, image, and tag badges
- [ ] The modal can be **closed** (via close button or overlay click)
- [ ] After closing, the card grid is restored with the **previously active filter and search value preserved**

### Full-Page Swap (Mobile < 768 px)

- [ ] Clicking a card **replaces the page content** with the Detail View
- [ ] A **"← Back to all peptides"** control is visible and returns to the card grid
- [ ] After returning, the card grid is restored with the **previously active filter and search value preserved**

### Hover States (Desktop ≥ 768 px)

- [ ] Hovering over a peptide card applies an **elevated shadow** (`var(--shadow-card)`) and a **`var(--color-accent)` border highlight**

**Notes:**

---

## 4. Data Accuracy and Completeness (`peptides.json`)

Review `src/data/peptides.json` directly and cross-check against the cards rendered in `index.html`.

- [ ] The file contains **exactly 10 peptide objects**
- [ ] All 10 `id` values are **unique** and in **kebab-case** format
- [ ] Every peptide has a **non-empty `name`**
- [ ] Every peptide has a **`shortDescription`** between 1 and 160 characters
- [ ] Every peptide has a **non-empty `benefits` array**
- [ ] Every peptide has a **non-empty `researchNotes` array** referencing publicly available knowledge
- [ ] Every peptide has a **`suggestedDosage`** string between 1 and 200 characters
- [ ] Every peptide has at least one **`tags` value** from the allowed set: "Fat Loss", "Anti-Aging", "Youthful Skin", "Muscle Recovery"
- [ ] Every peptide's **`imagePlaceholderUrl`** is a well-formed absolute URL beginning with `https://`
- [ ] The `const PEPTIDES` constant in `index.html` **matches** the data in `peptides.json` (no stale or divergent entries)

**Notes:**

---

## 5. HTML Mockup Files — Presence and `file://` Functionality

Confirm all four files exist and open correctly without a local server.

| File                                  | Present | Opens via `file://` | No console errors |
| ------------------------------------- | ------- | ------------------- | ----------------- |
| `design-mockups/index.html`           | [ ]     | [ ]                 | [ ]               |
| `design-mockups/detail.html`          | [ ]     | [ ]                 | [ ]               |
| `design-mockups/agent-insights.html`  | [ ]     | [ ]                 | [ ]               |
| `design-mockups/completed-specs.html` | [ ]     | [ ]                 | [ ]               |

Additional checks:

- [ ] Each file is **self-contained** — no external `.css` or `.js` file references (CDN font link is the only permitted external dependency)
- [ ] `agent-insights.html` displays the **"⚠ Internal Tool — Not part of the public app"** banner
- [ ] `completed-specs.html` displays the **"⚠ Internal Tool — Not part of the public app"** banner
- [ ] `agent-insights.html` renders at least one **SVG flowchart** and clickable agent nodes
- [ ] `completed-specs.html` renders a **progress overview**, specs table, and prompt history section
- [ ] `detail.html` is pre-populated with data from the **first peptide** in `peptides.json` (BPC-157)
- [ ] `detail.html` includes a **"← Back to all peptides"** link pointing to `index.html`

**Notes:**

---

## Sign-off

> Complete all checklist sections above before filling in this section.
> A Decision of **Approved** is required before React implementation may begin (Requirement 8.3).

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| **Reviewer Name** |                                              |
| **Date**          |                                              |
| **Decision**      | Approved / Rejected _(circle or delete one)_ |
| **Notes**         |                                              |

---

_If the decision is **Rejected**, create `tests/ux-design/REJECTION_NOTES.md` documenting each rejected item (page, issue description, required fix) and return to the polish-fixes tasks before re-running this approval cycle._
