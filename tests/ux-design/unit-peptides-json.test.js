/**
 * Unit tests for `peptides.json` structural integrity — Task 4.1
 *
 * Validates:
 *   - Requirements 2.1: exactly 10 peptide objects in the array
 *   - Requirements 2.2: all `id` values are unique (kebab-case uniqueness)
 *   - Requirements 2.5: every peptide has at least one tag from the allowed set
 */

import { describe, it, expect } from "vitest";
import peptides from "../../src/data/peptides.json" assert { type: "json" };

const ALLOWED_TAGS = new Set([
  "Fat Loss",
  "Anti-Aging",
  "Youthful Skin",
  "Muscle Recovery",
]);

describe("peptides.json structural integrity", () => {
  it("contains exactly 10 peptide objects (Requirement 2.1)", () => {
    expect(peptides).toHaveLength(10);
  });

  it("all 10 id values are unique (Requirement 2.2)", () => {
    const ids = peptides.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every peptide has at least one tag from the allowed set (Requirement 2.5)", () => {
    for (const peptide of peptides) {
      const validTags = peptide.tags.filter((tag) => ALLOWED_TAGS.has(tag));
      expect(
        validTags.length,
        `Peptide "${peptide.id}" has no valid tags from the allowed set`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});
