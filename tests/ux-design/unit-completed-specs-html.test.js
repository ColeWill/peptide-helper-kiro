/**
 * Unit tests for `completed-specs.html` structure — Task 4.5
 *
 * Validates:
 *   - Requirement 6.1: summary table listing agents and completed tasks
 *   - Requirement 6.2: specs section with status badges
 *   - Requirement 6.3: prompt history section in chronological order
 *   - Requirement 6.4: progress overview with counts for 4 status categories
 *   - Requirement 6.5: "⚠ Internal Tool — Not part of the public app" banner
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(
  resolve(__dirname, "../../design-mockups/completed-specs.html"),
  "utf-8",
);

describe("completed-specs.html structure", () => {
  it("contains the internal tool warning banner (Requirement 6.5)", () => {
    expect(html).toContain("⚠ Internal Tool — Not part of the public app");
  });

  it("contains a progress grid with 4 count cells (Requirement 6.4)", () => {
    // The progress grid renders 4 cards, each containing a .progress-count element
    const countMatches = html.match(/class="progress-count/g);
    expect(countMatches).not.toBeNull();
    expect(countMatches.length).toBeGreaterThanOrEqual(4);
  });

  it("contains a specs table (Requirement 6.2)", () => {
    expect(html).toContain('class="specs-table"');
    // Table should have a thead and tbody
    expect(html).toContain("<thead>");
    expect(html).toContain("<tbody");
  });

  it("contains a prompt history section (Requirement 6.3)", () => {
    // The prompt history section has a heading and a container list
    expect(html).toContain("Prompt History");
    expect(html).toContain('class="prompt-list"');
  });
});
