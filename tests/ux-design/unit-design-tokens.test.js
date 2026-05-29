/**
 * Unit tests for Task 4.6 — Design system token consistency across all four mockup files.
 *
 * For each mockup file, parses the `:root` block and extracts CSS custom property values.
 * Asserts that the five core design tokens are identical across all four files:
 *   - --color-accent:    #1db954
 *   - --color-bg-primary: #0a1628
 *   - --font-size-body:  16px
 *   - --space-4:         16px
 *   - --radius-pill:     9999px
 *
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MOCKUPS_DIR = join(__dirname, "../../design-mockups");

const FILES = {
  "index.html": join(MOCKUPS_DIR, "index.html"),
  "detail.html": join(MOCKUPS_DIR, "detail.html"),
  "agent-insights.html": join(MOCKUPS_DIR, "agent-insights.html"),
  "completed-specs.html": join(MOCKUPS_DIR, "completed-specs.html"),
};

/**
 * Extract the content of the first `:root { ... }` block from an HTML string.
 * Returns the raw text between the opening and closing braces (inclusive).
 */
function extractRootBlock(html) {
  // Find `:root` followed by optional whitespace and an opening brace
  const rootIndex = html.search(/:root\s*\{/);
  if (rootIndex === -1) return null;

  const openBrace = html.indexOf("{", rootIndex);
  if (openBrace === -1) return null;

  // Walk forward to find the matching closing brace (depth-aware)
  let depth = 0;
  let i = openBrace;
  while (i < html.length) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) return html.slice(openBrace, i + 1);
    }
    i++;
  }
  return null;
}

/**
 * Extract the value of a CSS custom property from a `:root` block string.
 * Returns the trimmed value string, or null if the property is not found.
 *
 * Handles values that may contain spaces, e.g.:
 *   --space-4: 16px;
 *   --shadow-card: 0 4px 20px rgba(0,0,0,0.4);
 */
function extractTokenValue(rootBlock, tokenName) {
  // Match: --token-name: <value>;
  // The value is everything between the colon and the semicolon, trimmed.
  const pattern = new RegExp(
    `${tokenName.replace(/-/g, "\\-")}\\s*:\\s*([^;]+);`,
  );
  const match = rootBlock.match(pattern);
  if (!match) return null;
  return match[1].trim();
}

// Load all four files once before tests run
const htmlContents = {};
const rootBlocks = {};

beforeAll(() => {
  for (const [name, filePath] of Object.entries(FILES)) {
    const html = readFileSync(filePath, "utf-8");
    htmlContents[name] = html;
    rootBlocks[name] = extractRootBlock(html);
  }
});

// ─── Helper: shared assertions per token ────────────────────────────────────

function assertTokenAcrossAllFiles(tokenName, expectedValue) {
  for (const fileName of Object.keys(FILES)) {
    it(`${fileName} has ${tokenName}: ${expectedValue}`, () => {
      const rootBlock = rootBlocks[fileName];
      expect(
        rootBlock,
        `${fileName} must contain a :root block`,
      ).not.toBeNull();

      const value = extractTokenValue(rootBlock, tokenName);
      expect(
        value,
        `${tokenName} must be defined in the :root block of ${fileName}`,
      ).not.toBeNull();

      expect(value).toBe(expectedValue);
    });
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Design token: --color-accent (Requirement 1.1)", () => {
  assertTokenAcrossAllFiles("--color-accent", "#1db954");
});

describe("Design token: --color-bg-primary (Requirement 1.1)", () => {
  assertTokenAcrossAllFiles("--color-bg-primary", "#0a1628");
});

describe("Design token: --font-size-body (Requirement 1.2)", () => {
  assertTokenAcrossAllFiles("--font-size-body", "16px");
});

describe("Design token: --space-4 (Requirement 1.3)", () => {
  assertTokenAcrossAllFiles("--space-4", "16px");
});

describe("Design token: --radius-pill (Requirement 1.4)", () => {
  assertTokenAcrossAllFiles("--radius-pill", "9999px");
});

// ─── Sanity: :root block is present in every file ───────────────────────────

describe("All mockup files contain a :root block (Requirement 1.5)", () => {
  for (const fileName of Object.keys(FILES)) {
    it(`${fileName} has a :root block`, () => {
      expect(
        rootBlocks[fileName],
        `${fileName} must contain a :root { } block`,
      ).not.toBeNull();
    });
  }
});
