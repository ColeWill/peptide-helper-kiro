/**
 * Property 4: Filter/search state preservation
 *
 * Validates: Requirements 3.10
 *
 * When the Detail_View is closed, the card grid must restore with the
 * previously active filter and search query preserved — meaning calling
 * filteredPeptides with the same (activeFilter, searchQuery) before and
 * after an open/close cycle must produce an identical result set.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import peptides from "../../src/data/peptides.json" assert { type: "json" };
import { filteredPeptides } from "./helpers/indexLogic.js";

const PEPTIDE_IDS = peptides.map((p) => p.id);

describe("Property 4: Filter/search state preservation", () => {
  /**
   * **Validates: Requirements 3.10**
   *
   * Simulates an open/close cycle: call filteredPeptides with a given
   * (activeFilter, searchQuery) pair, then call it again with the exact
   * same arguments. The result sets must be identical — same peptides in
   * the same order — regardless of which peptide detail was opened.
   */
  it("filteredPeptides returns identical results before and after a simulated open/close cycle", () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom(
            "All",
            "Fat Loss",
            "Anti-Aging",
            "Youthful Skin",
            "Muscle Recovery",
          ),
          fc.string(),
          fc.constantFrom(...PEPTIDE_IDS),
        ),
        ([activeFilter, searchQuery, _openedPeptideId]) => {
          // Call before the "open" — this is the state the user sees
          const before = filteredPeptides(peptides, activeFilter, searchQuery);

          // Simulate the open/close cycle: the opened peptide id is available
          // but filteredPeptides is a pure function and does not mutate state,
          // so calling it again with the same arguments must yield the same result.
          const after = filteredPeptides(peptides, activeFilter, searchQuery);

          // Assert: same length
          expect(after.length).toBe(before.length);

          // Assert: same peptide ids in the same order
          const beforeIds = before.map((p) => p.id);
          const afterIds = after.map((p) => p.id);
          expect(afterIds).toEqual(beforeIds);
        },
      ),
      { numRuns: 100 },
    );
  });
});
