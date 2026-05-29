/**
 * Unit tests for Task 4.2 — index.html initial state verification.
 *
 * Parses index.html as a string and asserts structural requirements:
 *   - Filter bar contains exactly 5 buttons with the correct labels
 *   - `const PEPTIDES` declaration is present
 *   - @media (max-width: 767px) sets .card-grid to grid-template-columns: 1fr
 *   - @media (max-width: 767px) sets .modal-overlay to display: none
 *   - @media (min-width: 768px) sets .mobile-detail to display: none
 *
 * Requirements: 3.2, 3.7, 3.8, 3.9, 7.1, 7.2, 9.3
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_HTML_PATH = join(__dirname, "../../design-mockups/index.html");

let html;

beforeAll(() => {
  html = readFileSync(INDEX_HTML_PATH, "utf-8");
});

describe("index.html — filter bar buttons (Requirement 3.2)", () => {
  it("contains exactly 5 filter buttons", () => {
    // Match all filter-btn elements
    const matches = html.match(/class="filter-btn[^"]*"/g) ?? [];
    expect(matches.length).toBe(5);
  });

  it('has a button labelled "All"', () => {
    expect(html).toMatch(/data-filter="All"[^>]*>\s*All\s*<\/button>/);
  });

  it('has a button labelled "Fat Loss"', () => {
    expect(html).toMatch(
      /data-filter="Fat Loss"[^>]*>\s*Fat Loss\s*<\/button>/,
    );
  });

  it('has a button labelled "Anti-Aging"', () => {
    expect(html).toMatch(
      /data-filter="Anti-Aging"[^>]*>\s*Anti-Aging\s*<\/button>/,
    );
  });

  it('has a button labelled "Youthful Skin"', () => {
    // The label may span multiple lines in the source
    expect(html).toMatch(/data-filter="Youthful Skin"/);
    expect(html).toContain("Youthful Skin");
  });

  it('has a button labelled "Muscle Recovery"', () => {
    expect(html).toMatch(/data-filter="Muscle Recovery"/);
    expect(html).toContain("Muscle Recovery");
  });
});

describe("index.html — inline PEPTIDES constant (Requirement 9.3)", () => {
  it("declares `const PEPTIDES` inline in the script", () => {
    expect(html).toContain("const PEPTIDES");
  });
});

describe("index.html — responsive media queries (Requirements 7.1, 7.2, 3.8, 3.9)", () => {
  /**
   * Extract the content of a specific @media block from the HTML string.
   * Returns the raw text between the first `{` after the media query and its
   * matching closing `}`.
   */
  function extractMediaBlock(source, mediaQuery) {
    const queryIndex = source.indexOf(mediaQuery);
    if (queryIndex === -1) return null;

    // Find the opening brace of the media block
    const openBrace = source.indexOf("{", queryIndex);
    if (openBrace === -1) return null;

    // Walk forward to find the matching closing brace (depth-aware)
    let depth = 0;
    let i = openBrace;
    while (i < source.length) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}") {
        depth--;
        if (depth === 0) return source.slice(openBrace, i + 1);
      }
      i++;
    }
    return null;
  }

  it("@media (max-width: 767px) block exists", () => {
    expect(html).toContain("@media (max-width: 767px)");
  });

  it("@media (max-width: 767px) sets .card-grid to grid-template-columns: 1fr (Requirement 7.1)", () => {
    const block = extractMediaBlock(html, "@media (max-width: 767px)");
    expect(block).not.toBeNull();
    // Should contain a .card-grid rule with grid-template-columns: 1fr
    expect(block).toMatch(
      /\.card-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/,
    );
  });

  it("@media (max-width: 767px) sets .modal-overlay to display: none (Requirement 3.8)", () => {
    const block = extractMediaBlock(html, "@media (max-width: 767px)");
    expect(block).not.toBeNull();
    // Should contain a .modal-overlay rule with display: none
    expect(block).toMatch(/\.modal-overlay\s*\{[^}]*display\s*:\s*none/);
  });

  it("@media (min-width: 768px) block exists", () => {
    expect(html).toContain("@media (min-width: 768px)");
  });

  it("@media (min-width: 768px) sets .mobile-detail to display: none (Requirement 3.9)", () => {
    const block = extractMediaBlock(html, "@media (min-width: 768px)");
    expect(block).not.toBeNull();
    // Should contain a .mobile-detail rule with display: none
    expect(block).toMatch(/\.mobile-detail\s*\{[^}]*display\s*:\s*none/);
  });
});
