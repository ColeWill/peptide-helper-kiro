/**
 * Property 5: Token exclusivity
 *
 * Validates: Requirements 1.5
 *
 * Reads each mockup file as a string, strips the :root { ... } block(s),
 * then asserts that no remaining CSS declaration value contains:
 *   - a hardcoded hex colour literal  (#[0-9a-fA-F]{3,8})
 *   - a bare px font-size matching a design token  (12|16|20|36)px
 *   - a bare px spacing value matching a design token  (4|8|12|16|24|32|48|64)px
 *
 * Run once per file (deterministic — no random generation needed).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MOCKUPS_DIR = resolve(__dirname, "../../design-mockups");

const MOCKUP_FILES = [
  "index.html",
  "detail.html",
  "agent-insights.html",
  "completed-specs.html",
];

/**
 * Remove all :root { ... } blocks from a CSS string.
 * Handles nested braces by counting depth.
 */
function stripRootBlocks(css) {
  let result = "";
  let i = 0;
  while (i < css.length) {
    // Look for ":root" followed by optional whitespace and "{"
    const rootMatch = css.slice(i).match(/^:root\s*\{/);
    if (rootMatch) {
      // Skip past the opening brace
      let depth = 1;
      i += rootMatch[0].length;
      while (i < css.length && depth > 0) {
        if (css[i] === "{") depth++;
        else if (css[i] === "}") depth--;
        i++;
      }
    } else {
      result += css[i];
      i++;
    }
  }
  return result;
}

/**
 * Extract only the content inside <style> tags from an HTML string.
 * Returns a single concatenated string of all style block contents.
 */
function extractStyleContent(html) {
  const styleBlocks = [];
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleTagRegex.exec(html)) !== null) {
    styleBlocks.push(match[1]);
  }
  return styleBlocks.join("\n");
}

/**
 * Find all violations in CSS outside :root blocks.
 * Returns an array of { type, match, context } objects.
 */
function findViolations(cssOutsideRoot) {
  const violations = [];

  // Pattern 1: hardcoded hex colour literals
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
  let m;
  while ((m = hexPattern.exec(cssOutsideRoot)) !== null) {
    // Grab a small context window around the match
    const start = Math.max(0, m.index - 40);
    const end = Math.min(cssOutsideRoot.length, m.index + m[0].length + 40);
    const context = cssOutsideRoot
      .slice(start, end)
      .replace(/\s+/g, " ")
      .trim();
    violations.push({ type: "hardcoded-hex", match: m[0], context });
  }

  // Pattern 2: bare px font-size token values (12px, 16px, 20px, 36px)
  const fontSizePxPattern = /\b(12|16|20|36)px\b/g;
  while ((m = fontSizePxPattern.exec(cssOutsideRoot)) !== null) {
    const start = Math.max(0, m.index - 40);
    const end = Math.min(cssOutsideRoot.length, m.index + m[0].length + 40);
    const context = cssOutsideRoot
      .slice(start, end)
      .replace(/\s+/g, " ")
      .trim();
    violations.push({ type: "hardcoded-font-size-px", match: m[0], context });
  }

  // Pattern 3: bare px spacing token values (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
  const spacingPxPattern = /\b(4|8|12|16|24|32|48|64)px\b/g;
  while ((m = spacingPxPattern.exec(cssOutsideRoot)) !== null) {
    const start = Math.max(0, m.index - 40);
    const end = Math.min(cssOutsideRoot.length, m.index + m[0].length + 40);
    const context = cssOutsideRoot
      .slice(start, end)
      .replace(/\s+/g, " ")
      .trim();
    violations.push({ type: "hardcoded-spacing-px", match: m[0], context });
  }

  return violations;
}

describe("Property 5: Token exclusivity", () => {
  for (const filename of MOCKUP_FILES) {
    it(`${filename} — no hardcoded hex/px token values outside :root`, () => {
      const filePath = resolve(MOCKUPS_DIR, filename);
      const html = readFileSync(filePath, "utf-8");

      // Extract only CSS from <style> blocks
      const allCss = extractStyleContent(html);

      // Remove :root { ... } blocks — those are the allowed source of truth
      const cssOutsideRoot = stripRootBlocks(allCss);

      const violations = findViolations(cssOutsideRoot);

      if (violations.length > 0) {
        const report = violations
          .map(
            (v, i) =>
              `  [${i + 1}] type=${v.type}  match="${v.match}"\n       context: ...${v.context}...`,
          )
          .join("\n");
        expect.fail(
          `Found ${violations.length} token exclusivity violation(s) in ${filename}:\n${report}`,
        );
      }

      expect(violations).toHaveLength(0);
    });
  }
});
