/**
 * Property 2: Filter + search intersection correctness
 *
 * Validates: Requirements 3.3, 3.6
 *
 * For any combination of (activeFilter, searchQuery), the result of
 * filteredPeptides(PEPTIDES, activeFilter, searchQuery) must equal the
 * set computed by manually applying both conditions (tag AND search).
 */

import { describe, it } from "vitest";
import * as fc from "fast-check";
import { expect } from "vitest";
import PEPTIDES from "../../src/data/peptides.json" assert { type: "json" };
import { filteredPeptides } from "./helpers/indexLogic.js";

const FILTER_CATEGORIES = [
  "All",
  "Fat Loss",
  "Anti-Aging",
  "Youthful Skin",
  "Muscle Recovery",
];

describe("Property 2: Filter + search intersection correctness", () => {
  it("filteredPeptides matches manually computed tag AND search intersection for all (filter, query) pairs", () => {
    /**
     * **Validates: Requirements 3.3, 3.6**
     *
     * Property: for every (activeFilter, searchQuery) pair,
     * filteredPeptides(PEPTIDES, activeFilter, searchQuery) returns exactly
     * the peptides that satisfy BOTH:
     *   - tag condition: activeFilter === 'All' OR p.tags includes activeFilter
     *   - search condition: searchQuery is empty OR p.name or p.shortDescription
     *     contains searchQuery (case-insensitive)
     */
    fc.assert(
      fc.property(
        fc.tuple(fc.constantFrom(...FILTER_CATEGORIES), fc.string()),
        ([activeFilter, searchQuery]) => {
          // Manually compute the expected set
          const q = searchQuery.toLowerCase();
          const expected = PEPTIDES.filter((p) => {
            const matchFilter =
              activeFilter === "All" || p.tags.includes(activeFilter);
            const matchSearch =
              !q ||
              p.name.toLowerCase().includes(q) ||
              p.shortDescription.toLowerCase().includes(q);
            return matchFilter && matchSearch;
          });

          const actual = filteredPeptides(PEPTIDES, activeFilter, searchQuery);

          // Assert same length and same ids (order-independent)
          expect(actual.length).toBe(expected.length);

          const actualIds = actual.map((p) => p.id).sort();
          const expectedIds = expected.map((p) => p.id).sort();
          expect(actualIds).toEqual(expectedIds);
        },
      ),
      { numRuns: 100 },
    );
  });
});
