/**
 * Unit tests for Task 4.3 — detail.html content structure
 *
 * Parses detail.html as a string and asserts the required structural elements
 * are present and correctly reference the BPC-157 peptide data.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.8, 4.10
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let html;
let peptides;
let bpc157;

beforeAll(() => {
  html = readFileSync(
    resolve(__dirname, "../../design-mockups/detail.html"),
    "utf-8",
  );

  peptides = JSON.parse(
    readFileSync(resolve(__dirname, "../../src/data/peptides.json"), "utf-8"),
  );

  // Requirement 4.10: pre-populated with the first peptide object
  bpc157 = peptides[0];
});

describe("detail.html — content structure (Task 4.3)", () => {
  // Requirement 4.1: peptide name as primary <h1>
  it('contains an <h1> element with the text "BPC-157"', () => {
    // Match <h1 ...>BPC-157</h1> allowing for class attributes and whitespace
    expect(html).toMatch(/<h1[^>]*>\s*BPC-157\s*<\/h1>/);
  });

  // Requirement 4.4: researchNotes section with visible heading "Research Notes"
  it('contains a section heading labelled "Research Notes"', () => {
    expect(html).toContain("Research Notes");
  });

  // Requirement 4.5: suggestedDosage section with visible heading "Suggested Dosage"
  it('contains a section heading labelled "Suggested Dosage"', () => {
    expect(html).toContain("Suggested Dosage");
  });

  // Requirement 4.8: navigation control "← Back to all peptides" linking to index.html
  it('contains a "← Back to all peptides" link pointing to index.html', () => {
    // The link text and href must both be present
    expect(html).toContain("← Back to all peptides");
    // The anchor that contains the back text must point to index.html
    expect(html).toMatch(
      /href=["']index\.html["'][^>]*>[\s\S]*?← Back to all peptides/,
    );
  });

  // Requirement 4.3: benefits rendered as <ul> or <ol>
  it("contains a <ul> or <ol> element for the benefits list", () => {
    expect(html).toMatch(/<ul[\s>]|<ol[\s>]/);
  });

  // Requirement 4.6: imagePlaceholderUrl image displayed prominently
  it("contains an <img> whose src matches the BPC-157 imagePlaceholderUrl", () => {
    expect(bpc157.imagePlaceholderUrl).toBeTruthy();
    // The src attribute value must equal the imagePlaceholderUrl from peptides.json
    const escapedUrl = bpc157.imagePlaceholderUrl.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    expect(html).toMatch(new RegExp(`<img[^>]+src=["']${escapedUrl}["']`));
  });

  // Requirement 4.10: first peptide in the array is BPC-157
  it("the first peptide in peptides.json is BPC-157 (confirming pre-population target)", () => {
    expect(bpc157.id).toBe("bpc-157");
    expect(bpc157.name).toBe("BPC-157");
  });
});
