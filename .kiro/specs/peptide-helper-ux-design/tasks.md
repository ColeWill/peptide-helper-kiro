# Implementation Plan: Peptide Helper UX Design — Verification & Approval

## Overview

All four mockup files and `peptides.json` have been created. This task list covers
verification of every deliverable against requirements, property-based and unit tests
for the core logic, any polish fixes surfaced during verification, the human approval
gate, and documenting the outcome. No re-creation of files is needed — tasks are
scoped to validate, test, fix, and sign off.

Testing uses [fast-check](https://github.com/dubzzz/fast-check) (vanilla JS, Node.js)
with [Vitest](https://vitest.dev/) as the test runner. All test files live in
`tests/ux-design/`.

---

## Tasks

- [x] 1. Set up test infrastructure
  - Create `tests/ux-design/` directory
  - Add `package.json` (or extend root) with `vitest` and `fast-check` as dev dependencies
  - Add a `vitest.config.js` (or equivalent) that resolves the test directory
  - Export the pure logic functions from `design-mockups/index.html` into a testable
    module at `tests/ux-design/helpers/indexLogic.js` by extracting:
    - `filteredPeptides(peptides, activeFilter, searchQuery)`
    - `buildCardHTML(peptide)` (card render function)
    - `buildDetailHTML(peptide)` (detail render function)
  - Import `src/data/peptides.json` as the canonical data source in all test files
  - _Requirements: 9.1, 9.3_

- [x] 2. Property-based tests — data validity and filter/search logic
  - [x] 2.1 Write property test for peptide field validity (Property 1)
    - Use `fc.integer({ min: 0, max: 9 })` to pick a random index into the `PEPTIDES` array
    - Assert: `id` matches `/^[a-z0-9]+(-[a-z0-9]+)*$/`, `name` is non-empty,
      `tags` is a non-empty array whose every element is in the allowed set,
      `shortDescription` length is 1–160, `benefits` is non-empty,
      `imagePlaceholderUrl` starts with `https://`, `researchNotes` is non-empty,
      `suggestedDosage` length is 1–200
    - Run ≥ 100 iterations
    - **Property 1: Peptide field validity**
    - **Validates: Requirements 2.2, 2.5**

  - [x] 2.2 Write property test for filter + search intersection correctness (Property 2)
    - Generator: `fc.tuple(fc.constantFrom('All','Fat Loss','Anti-Aging','Youthful Skin','Muscle Recovery'), fc.string())`
    - Compute expected set manually (tag AND search conditions) and assert it equals
      `filteredPeptides(PEPTIDES, activeFilter, searchQuery)`
    - Run ≥ 100 iterations
    - **Property 2: Filter + search intersection correctness**
    - **Validates: Requirements 3.3, 3.6**

- [x] 3. Property-based tests — rendering and state
  - [x] 3.1 Write property test for card render completeness (Property 3)
    - Generator: `fc.record({ id: fc.string(), name: fc.string({ minLength: 1 }), shortDescription: fc.string({ minLength: 1, maxLength: 160 }), imagePlaceholderUrl: fc.webUrl(), tags: fc.array(fc.constantFrom('Fat Loss','Anti-Aging','Youthful Skin','Muscle Recovery'), { minLength: 1 }), benefits: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), researchNotes: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), suggestedDosage: fc.string({ minLength: 1, maxLength: 200 }) })`
    - Assert: rendered HTML string contains `p.name`, `p.shortDescription`,
      `p.imagePlaceholderUrl`, and one tag badge element per entry in `p.tags`
    - Run ≥ 100 iterations
    - **Property 3: Card render completeness**
    - **Validates: Requirements 3.4, 3.5**

  - [x] 3.2 Write property test for filter/search state preservation (Property 4)
    - Generator: `fc.tuple(fc.constantFrom('All','Fat Loss','Anti-Aging','Youthful Skin','Muscle Recovery'), fc.string(), fc.constantFrom(...PEPTIDES.map(p => p.id)))`
    - Simulate open/close cycle by calling `filteredPeptides` before and after with
      the same `(activeFilter, searchQuery)` — assert the result set is identical
    - Run ≥ 100 iterations
    - **Property 4: Filter/search state preservation**
    - **Validates: Requirements 3.10**

  - [x] 3.3 Write property test for CSS token exclusivity (Property 5)
    - Read each mockup file as a string; extract all CSS declaration blocks outside
      the `:root` selector using a regex
    - Assert: no declaration value contains a hardcoded hex colour literal
      (`/#[0-9a-fA-F]{3,8}/`), a bare `px` font-size value matching a token
      (`/\b(12|16|20|36)px\b/`), or a bare `px` spacing value matching a token
      (`/\b(4|8|12|16|24|32|48|64)px\b/`) outside `:root`
    - Run once per file (deterministic, no random generation needed)
    - **Property 5: Token exclusivity**
    - **Validates: Requirements 1.5**

- [x] 4. Example-based unit tests — structural verification
  - [x] 4.1 Write unit tests for `peptides.json` structural integrity
    - Assert: array length is exactly 10
    - Assert: all 10 `id` values are unique
    - Assert: every peptide has at least one tag from the allowed set
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 4.2 Write unit tests for `index.html` initial state
    - Parse `index.html` as a string; assert:
      - Filter bar contains exactly 5 buttons with labels: "All", "Fat Loss",
        "Anti-Aging", "Youthful Skin", "Muscle Recovery"
      - `const PEPTIDES` declaration is present
      - `@media (max-width: 767px)` block sets `.card-grid` to `grid-template-columns: 1fr`
      - `@media (max-width: 767px)` block sets `.modal-overlay` to `display: none`
      - `@media (min-width: 768px)` block sets `.mobile-detail` to `display: none`
    - _Requirements: 3.2, 3.7, 3.8, 3.9, 7.1, 7.2, 9.3_

  - [x] 4.3 Write unit tests for `detail.html` content structure
    - Parse `detail.html` as a string; assert:
      - Contains `<h1` with text "BPC-157"
      - Contains a section with heading "Research Notes"
      - Contains a section with heading "Suggested Dosage"
      - Contains `← Back to all peptides` link pointing to `index.html`
      - Contains `<ul` or `<ol` element for benefits list
      - Contains `<img` with `src` matching the BPC-157 `imagePlaceholderUrl`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.8, 4.10_

  - [x] 4.4 Write unit tests for `agent-insights.html` structure
    - Parse `agent-insights.html` as a string; assert:
      - Contains "⚠ Internal Tool — Not part of the public app"
      - Contains `<svg` element (flowchart)
      - Contains at least 5 agent card elements (`.agent-card` or equivalent)
      - Contains a task history table
    - _Requirements: 5.1, 5.3, 5.4, 5.5_

  - [x] 4.5 Write unit tests for `completed-specs.html` structure
    - Parse `completed-specs.html` as a string; assert:
      - Contains "⚠ Internal Tool — Not part of the public app"
      - Contains a progress grid with 4 count cells
      - Contains a specs table
      - Contains a prompt history section
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 4.6 Write unit tests for design system token consistency across all four files
    - For each mockup file, parse the `:root` block and extract token values
    - Assert: `--color-accent` is `#1db954` in all four files
    - Assert: `--color-bg-primary` is `#0a1628` in all four files
    - Assert: `--font-size-body` is `16px` in all four files
    - Assert: `--space-4` is `16px` in all four files
    - Assert: `--radius-pill` is `9999px` in all four files
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [~] 5. Checkpoint — run all tests and fix failures
  - Run `vitest --run` and review output
  - For each failing test, identify the gap between the mockup and the requirement
  - Apply targeted fixes to the relevant mockup file(s) or `peptides.json`
  - Re-run until all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Polish fixes identified during verification
  - [x] 6.1 Fix any `:root` token violations found by Property 5 test
    - Replace any hardcoded hex/px values outside `:root` with the corresponding
      CSS custom property reference
    - _Requirements: 1.5, 1.6_

  - [x] 6.2 Fix any missing or malformed fields in `peptides.json` found by Property 1 test
    - Correct field values to satisfy all constraints in Requirement 2.2
    - Re-sync the `const PEPTIDES` constant in `index.html` to match the corrected JSON
    - _Requirements: 2.2, 2.3, 9.3_

  - [x] 6.3 Fix any structural gaps in mockup files found by unit tests 4.2–4.5
    - Add missing HTML elements, section headings, or navigation controls as needed
    - _Requirements: 3.x, 4.x, 5.x, 6.x_

  - [x] 6.4 Verify responsive media queries are present and correct in `index.html` and `detail.html`
    - Confirm `@media (max-width: 767px)` sets card grid to single column
    - Confirm `@media (max-width: 767px)` hides `.modal-overlay` with `display: none !important`
    - Confirm `@media (min-width: 768px)` hides `.mobile-detail` with `display: none !important`
    - Confirm `detail.html` stacks image above text on mobile
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [~] 7. Final checkpoint — all tests green before approval gate
  - Run `vitest --run` one final time; confirm zero failures
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Human approval gate
  - [x] 8.1 Produce approval gate checklist document at `tests/ux-design/APPROVAL_CHECKLIST.md`
    - Generate a markdown checklist covering all items from Requirement 8.4:
      1. Visual design consistency with the Design System tokens
      2. Responsive behaviour at < 768 px (mobile) and ≥ 768 px (desktop)
      3. Interactive JS: filter, search, modal open/close, mobile swap, hover states
      4. Data accuracy and completeness of `peptides.json`
      5. All four HTML mockup files present and functional via `file://`
    - Include a "Sign-off" section with fields: Reviewer name, Date, Decision (Approved / Rejected), Notes
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 8.2 Update `agent-insights.html` Human Review Gate agent status to "In Progress"
    - Change the `status` field of the `review-agent` entry in the `AGENTS` constant
      from `"Pending"` to `"In Progress"`
    - Add a history entry: `{ task: "Approval gate checklist delivered to reviewer", date: "<today>" }`
    - _Requirements: 5.3, 5.4_

- [ ] 9. Document approval gate outcome
  - [x] 9.1 On approval: update internal dashboard files to reflect sign-off
    - In `agent-insights.html`: set `review-agent` status to `"Completed"`, add history
      entry `"Human sign-off received — design approved for React implementation"`
    - In `agent-insights.html`: set `react-agent` status to `"Pending"` (unblocked),
      update `currentTask` to `"Ready to begin — awaiting task assignment"`
    - In `completed-specs.html`: update `peptide-helper-ux-design` spec status from
      `"Spec-Coded"` to `"Completed"`
    - In `completed-specs.html`: add a new `AGENT_TASKS` entry for the Human Review Gate
      with task `"Design approved — sign-off recorded <date>"`
    - _Requirements: 8.2, 8.3_

  - [~] 9.2 On rejection: create a `tests/ux-design/REJECTION_NOTES.md` file
    - Document each rejected item with: page, issue description, required fix
    - Return to task 6 (polish fixes) for each item and re-run the approval cycle
    - _Requirements: 8.2_

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP pass
- All property tests use fast-check with ≥ 100 iterations per property
- The `filteredPeptides`, `buildCardHTML`, and `buildDetailHTML` functions must be
  extracted into `tests/ux-design/helpers/indexLogic.js` before tests can run —
  task 1 is a hard prerequisite for tasks 2–4
- The approval gate (task 8) is a hard prerequisite for task 9; React implementation
  MUST NOT begin until task 9.1 is complete
- Checkpoints in tasks 5 and 7 are manual verification steps, not automated

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    {
      "id": 1,
      "tasks": [
        "2.1",
        "2.2",
        "3.1",
        "3.2",
        "3.3",
        "4.1",
        "4.2",
        "4.3",
        "4.4",
        "4.5",
        "4.6"
      ]
    },
    { "id": 2, "tasks": ["6.1", "6.2", "6.3", "6.4"] },
    { "id": 3, "tasks": ["8.1", "8.2"] },
    { "id": 4, "tasks": ["9.1", "9.2"] }
  ]
}
```
