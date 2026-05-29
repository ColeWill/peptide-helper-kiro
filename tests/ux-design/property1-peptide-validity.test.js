/**
 * Property 1: Peptide field validity
 *
 * Validates: Requirements 2.2, 2.5
 *
 * Uses fast-check to randomly sample peptides from the PEPTIDES array and
 * assert that every required field satisfies its documented constraints.
 */

import { describe, it } from "vitest";
import * as fc from "fast-check";
import PEPTIDES from "../../src/data/peptides.json" assert { type: "json" };

const ALLOWED_TAGS = new Set([
  "Fat Loss",
  "Anti-Aging",
  "Youthful Skin",
  "Muscle Recovery",
]);
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("Property 1: Peptide field validity", () => {
  it("every randomly sampled peptide satisfies all field constraints (≥ 100 iterations)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 9 }), (index) => {
        const p = PEPTIDES[index];

        // id: kebab-case string
        if (typeof p.id !== "string" || !ID_PATTERN.test(p.id)) {
          throw new Error(
            `Peptide at index ${index} has invalid id: ${JSON.stringify(p.id)}`,
          );
        }

        // name: non-empty string
        if (typeof p.name !== "string" || p.name.length === 0) {
          throw new Error(
            `Peptide at index ${index} has empty or missing name`,
          );
        }

        // tags: non-empty array, every element in allowed set
        if (!Array.isArray(p.tags) || p.tags.length === 0) {
          throw new Error(
            `Peptide at index ${index} has empty or missing tags array`,
          );
        }
        for (const tag of p.tags) {
          if (!ALLOWED_TAGS.has(tag)) {
            throw new Error(
              `Peptide at index ${index} has disallowed tag: ${JSON.stringify(tag)}`,
            );
          }
        }

        // shortDescription: 1–160 characters
        if (
          typeof p.shortDescription !== "string" ||
          p.shortDescription.length < 1 ||
          p.shortDescription.length > 160
        ) {
          throw new Error(
            `Peptide at index ${index} shortDescription length out of range: ${p.shortDescription?.length}`,
          );
        }

        // benefits: non-empty array
        if (!Array.isArray(p.benefits) || p.benefits.length === 0) {
          throw new Error(
            `Peptide at index ${index} has empty or missing benefits array`,
          );
        }

        // imagePlaceholderUrl: starts with https://
        if (
          typeof p.imagePlaceholderUrl !== "string" ||
          !p.imagePlaceholderUrl.startsWith("https://")
        ) {
          throw new Error(
            `Peptide at index ${index} imagePlaceholderUrl does not start with https://: ${JSON.stringify(p.imagePlaceholderUrl)}`,
          );
        }

        // researchNotes: non-empty array
        if (!Array.isArray(p.researchNotes) || p.researchNotes.length === 0) {
          throw new Error(
            `Peptide at index ${index} has empty or missing researchNotes array`,
          );
        }

        // suggestedDosage: 1–200 characters
        if (
          typeof p.suggestedDosage !== "string" ||
          p.suggestedDosage.length < 1 ||
          p.suggestedDosage.length > 200
        ) {
          throw new Error(
            `Peptide at index ${index} suggestedDosage length out of range: ${p.suggestedDosage?.length}`,
          );
        }

        return true;
      }),
      { numRuns: 100 },
    );
  });
});
