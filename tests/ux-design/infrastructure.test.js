/**
 * Smoke tests for Task 1 — verify the test infrastructure is wired up correctly.
 * These tests confirm that:
 *   - peptides.json is importable and has the expected shape
 *   - the extracted logic module exports the three required functions
 *   - each function is callable and returns a sensible result
 */

import { describe, it, expect } from "vitest";
import peptides from "../../src/data/peptides.json" assert { type: "json" };
import {
  filteredPeptides,
  buildCardHTML,
  buildDetailHTML,
} from "./helpers/indexLogic.js";

describe("Test infrastructure", () => {
  it("imports peptides.json as an array", () => {
    expect(Array.isArray(peptides)).toBe(true);
    expect(peptides.length).toBeGreaterThan(0);
  });

  it("filteredPeptides is exported and callable", () => {
    const result = filteredPeptides(peptides, "All", "");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(peptides.length);
  });

  it("buildCardHTML is exported and returns a string containing the peptide name", () => {
    const html = buildCardHTML(peptides[0]);
    expect(typeof html).toBe("string");
    expect(html).toContain(peptides[0].name);
  });

  it("buildDetailHTML is exported and returns a string containing the peptide name", () => {
    const html = buildDetailHTML(peptides[0]);
    expect(typeof html).toBe("string");
    expect(html).toContain(peptides[0].name);
  });
});
