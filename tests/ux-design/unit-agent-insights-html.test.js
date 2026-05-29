/**
 * Unit tests for agent-insights.html structure — Task 4.4
 *
 * Parses the HTML file as a string and asserts structural requirements:
 *   - Internal tool warning banner is present (Req 5.1, 5.5)
 *   - SVG flowchart element is present (Req 5.1)
 *   - At least 5 agent entries are defined (Req 5.3)
 *   - Task history table is present (Req 5.4)
 *
 * Requirements: 5.1, 5.3, 5.4, 5.5
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, "../../design-mockups/agent-insights.html");

let html;

beforeAll(() => {
  html = readFileSync(htmlPath, "utf-8");
});

describe("agent-insights.html structure", () => {
  /**
   * Req 5.5 — The page SHALL display the text
   * "⚠ Internal Tool — Not part of the public app" in the page header.
   */
  it("contains the internal tool warning banner", () => {
    expect(html).toContain("⚠ Internal Tool — Not part of the public app");
  });

  /**
   * Req 5.1 — The page SHALL display a clickable flowchart rendered using
   * inline SVG or vanilla JS canvas.
   */
  it("contains an <svg> element for the flowchart", () => {
    expect(html).toContain("<svg");
  });

  /**
   * Req 5.3 — The page SHALL display a current task status section for each
   * agent. The AGENTS constant must define at least 5 agents so that 5 cards
   * are rendered at runtime.
   *
   * Because agent cards are injected dynamically by JavaScript, we verify the
   * source data (the AGENTS array literal) contains at least 5 id entries, and
   * that the .agent-card CSS class is defined so the rendered cards will be
   * styled correctly.
   */
  it("defines at least 5 agents in the AGENTS data constant", () => {
    // Count occurrences of `id:` inside the AGENTS array block as a proxy for
    // the number of agent objects. Each agent object has exactly one `id:` field.
    const agentIdMatches = html.match(/\bid:\s*["']/g);
    expect(agentIdMatches).not.toBeNull();
    expect(agentIdMatches.length).toBeGreaterThanOrEqual(5);
  });

  it("defines the .agent-card CSS class (used to render agent cards)", () => {
    expect(html).toContain(".agent-card");
  });

  /**
   * Req 5.4 — The page SHALL display a past task history list for each agent.
   * The history is rendered as an HTML table with class "history-table".
   */
  it("contains a task history table", () => {
    expect(html).toContain('<table class="history-table"');
  });

  it("task history table has Agent, Task, Status, and Date columns", () => {
    expect(html).toContain("<th>Agent</th>");
    expect(html).toContain("<th>Task</th>");
    expect(html).toContain("<th>Status</th>");
    expect(html).toContain("<th>Date</th>");
  });
});
