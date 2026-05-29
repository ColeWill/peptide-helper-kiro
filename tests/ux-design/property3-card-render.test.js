/**
 * Property 3: Card render completeness
 *
 * Validates: Requirements 3.4, 3.5
 *
 * For any valid peptide object, `buildCardHTML` must produce an HTML string
 * that contains the peptide's name, shortDescription, imagePlaceholderUrl,
 * and exactly one tag badge element per entry in the tags array.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { buildCardHTML } from "./helpers/indexLogic.js";

describe("Property 3: Card render completeness", () => {
  /**
   * **Validates: Requirements 3.4, 3.5**
   *
   * For any arbitrarily generated peptide, the rendered card HTML must contain:
   *   - the peptide name
   *   - the shortDescription
   *   - the imagePlaceholderUrl
   *   - one tag badge <span> element per tag in the tags array
   */
  it("rendered card HTML contains name, shortDescription, imagePlaceholderUrl, and one badge per tag", () => {
    const peptideArb = fc.record({
      id: fc.string(),
      name: fc.string({ minLength: 1 }),
      shortDescription: fc.string({ minLength: 1, maxLength: 160 }),
      imagePlaceholderUrl: fc.webUrl(),
      tags: fc.array(
        fc.constantFrom(
          "Fat Loss",
          "Anti-Aging",
          "Youthful Skin",
          "Muscle Recovery",
        ),
        { minLength: 1 },
      ),
      benefits: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
      researchNotes: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
      suggestedDosage: fc.string({ minLength: 1, maxLength: 200 }),
    });

    fc.assert(
      fc.property(peptideArb, (p) => {
        const html = buildCardHTML(p);

        // Must contain the peptide name
        expect(html).toContain(p.name);

        // Must contain the short description
        expect(html).toContain(p.shortDescription);

        // Must contain the image placeholder URL
        expect(html).toContain(p.imagePlaceholderUrl);

        // Must contain exactly one tag badge <span> per tag entry
        // Each badge is rendered as: <span class="tag tag-<slug>">TagName</span>
        for (const tag of p.tags) {
          expect(html).toContain(`>${tag}</span>`);
        }

        // The total number of tag badge spans must equal the number of tags
        const badgeMatches = html.match(/<span class="tag tag-[^"]*">/g) ?? [];
        expect(badgeMatches.length).toBe(p.tags.length);
      }),
      { numRuns: 100 },
    );
  });
});
