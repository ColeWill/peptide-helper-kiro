import type { TokenUsage } from "./agentData";

export type SpecStatus =
  | "Vibe-Coded"
  | "Spec-Coded"
  | "Completed"
  | "Yet to be Completed";

export interface Spec {
  id: string;
  name: string;
  status: SpecStatus;
  description: string;
  agent: string;
  timestamp: string; // ISO date string
  summary: string;
  tokenUsage: TokenUsage;
}

export interface AgentTaskSummary {
  agent: string;
  tasks: string[];
}

export interface PromptHistoryItem {
  id: string;
  date: string;
  text: string;
  tasks: string[];
}

export const specs: Spec[] = [
  {
    id: "peptide-helper-ux-design",
    name: "peptide-helper-ux-design",
    status: "Spec-Coded",
    description:
      "UX Design phase: static HTML/CSS/JS mockups for index, detail, agent-insights, and completed-specs pages plus peptides.json data file.",
    agent: "UX Design Mockup Agent",
    timestamp: "2026-05-28T14:22:00Z",
    summary:
      "Four fully interactive HTML mockups delivered with dark health-tech design system, responsive layout, and integrated peptides.json data.",
    tokenUsage: { inputTokens: 39160, outputTokens: 61530, total: 100690 },
  },
  {
    id: "react-implementation",
    name: "React Implementation",
    status: "Yet to be Completed",
    description:
      "Convert approved mockups into production React components with routing, state management, and data layer.",
    agent: "React Implementation Agent",
    timestamp: "2026-05-30T09:00:00Z",
    summary: "Design document written. Component implementation in progress.",
    tokenUsage: { inputTokens: 14200, outputTokens: 22800, total: 37000 },
  },
];

// Note: "In Progress" is treated as "Yet to be Completed" for progress overview counting.
// Badge logic: if status not in the four SpecStatus keys, fall back to "Yet to be Completed".

export const agentTaskSummaries: AgentTaskSummary[] = [
  {
    agent: "Requirements Agent",
    tasks: [
      "Created requirements.md for peptide-helper-ux-design (9 requirements, EARS-pattern)",
      "Ran automatic requirements detailing pass across all 9 requirements",
    ],
  },
  {
    agent: "Data Seed Agent",
    tasks: [
      "Generated /src/data/peptides.json with 10 real peptide objects",
      "Validated all field constraints (id uniqueness, URL format, tag membership, character limits)",
    ],
  },
  {
    agent: "UX Design Mockup Agent",
    tasks: [
      "Built /design-mockups/index.html — homepage with hero, filter bar, search, card grid, modal, mobile detail view",
      "Built /design-mockups/detail.html — full peptide detail page with benefits, research notes, dosage",
      "Built /design-mockups/agent-insights.html — internal agent flowchart and status dashboard",
      "Built /design-mockups/completed-specs.html — internal spec history and progress tracker",
    ],
  },
  {
    agent: "Human Review Gate",
    tasks: ["Human sign-off received on all 4 design mockups"],
  },
  {
    agent: "React Implementation Agent",
    tasks: ["Wrote technical design document for react-implementation spec"],
  },
];

export const promptHistory: PromptHistoryItem[] = [
  {
    id: "prompt-1",
    date: "2026-05-28",
    text: "UX Design phase for Peptide-Helper (react app). Create a complete set of static, single-file HTML/CSS/JS mockups saved in /design-mockups. Pages: index.html (hero, filter, search, card grid), detail.html (full peptide detail), agent-insights.html (internal agent flowcharts), completed-specs.html (internal spec history). Also generate /src/data/peptides.json with 10 real peptides. Modern dark health-tech theme, deep greens/blues, fully responsive, interactive JS. Human approval gate before React implementation.",
    tasks: [
      "Create requirements.md (peptide-helper-ux-design)",
      "Generate /src/data/peptides.json (10 peptides)",
      "Build /design-mockups/index.html",
      "Build /design-mockups/detail.html",
      "Build /design-mockups/agent-insights.html",
      "Build /design-mockups/completed-specs.html",
    ],
  },
  {
    id: "prompt-2",
    date: "2026-05-30",
    text: "Write a complete technical design document for the react-implementation spec. The design document should cover: overview, file structure, technology stack, design system SCSS, data layer, routing, component breakdown, mock data files, agent flowchart, responsive strategy, accessibility, and state management summary.",
    tasks: [
      "Read all design mockup HTML files",
      "Read peptides.json data file",
      "Read requirements.md",
      "Write design.md to .kiro/specs/react-implementation/",
    ],
  },
];

// Computed total token usage across all specs
export const totalSpecTokenUsage: TokenUsage = specs.reduce(
  (acc, s) => ({
    inputTokens: acc.inputTokens + s.tokenUsage.inputTokens,
    outputTokens: acc.outputTokens + s.tokenUsage.outputTokens,
    total: acc.total + s.tokenUsage.total,
  }),
  { inputTokens: 0, outputTokens: 0, total: 0 },
);
