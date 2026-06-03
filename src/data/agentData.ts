export type AgentStatus = "Completed" | "In Progress" | "Pending" | "Blocked";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  total: number;
}

export interface AgentHistoryItem {
  task: string;
  date: string; // ISO date string YYYY-MM-DD
  status: AgentStatus;
  tokenUsage: TokenUsage;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  currentTask: string;
  status: AgentStatus;
  history: AgentHistoryItem[];
}

export const agents: Agent[] = [
  {
    id: "requirements-agent",
    name: "Requirements Agent",
    description:
      "Gathers and documents project requirements using EARS-pattern acceptance criteria and INCOSE-compliant language.",
    currentTask: "Requirements document complete for peptide-helper-ux-design",
    status: "Completed",
    history: [
      {
        task: "Created requirements.md for peptide-helper-ux-design (9 requirements, EARS-pattern)",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 4210, outputTokens: 6340, total: 10550 },
      },
      {
        task: "Ran automatic requirements detailing pass across all 9 requirements",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 7820, outputTokens: 11240, total: 19060 },
      },
    ],
  },
  {
    id: "design-agent",
    name: "UX Design Mockup Agent",
    description:
      "Produces static single-file HTML/CSS/JS mockups for all pages in the approved design system.",
    currentTask: "All 4 mockup HTML files complete and approved",
    status: "Completed",
    history: [
      {
        task: "Built /design-mockups/index.html — homepage with hero, filter bar, search, card grid, modal",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 12450, outputTokens: 18900, total: 31350 },
      },
      {
        task: "Built /design-mockups/detail.html — full peptide detail page",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 8930, outputTokens: 14220, total: 23150 },
      },
      {
        task: "Built /design-mockups/agent-insights.html — internal agent dashboard",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 9870, outputTokens: 15640, total: 25510 },
      },
      {
        task: "Built /design-mockups/completed-specs.html — internal spec history tracker",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 8110, outputTokens: 12880, total: 20990 },
      },
    ],
  },
  {
    id: "data-agent",
    name: "Data Seed Agent",
    description:
      "Generates and validates the peptides.json data file with real peptide research data.",
    currentTask: "peptides.json created and validated (10 peptides)",
    status: "Completed",
    history: [
      {
        task: "Generated /src/data/peptides.json with 10 real peptide objects",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 5340, outputTokens: 9870, total: 15210 },
      },
      {
        task: "Validated all field constraints (id uniqueness, URL format, tag membership)",
        date: "2026-05-28",
        status: "Completed",
        tokenUsage: { inputTokens: 2100, outputTokens: 1450, total: 3550 },
      },
    ],
  },
  {
    id: "review-agent",
    name: "Human Review Gate",
    description:
      "Awaits explicit human approval of all mockups before React implementation begins.",
    currentTask: "Mockups approved — React implementation greenlit",
    status: "Completed",
    history: [
      {
        task: "Human sign-off received on all 4 design mockups",
        date: "2026-05-29",
        status: "Completed",
        tokenUsage: { inputTokens: 0, outputTokens: 0, total: 0 },
      },
    ],
  },
  {
    id: "react-agent",
    name: "React Implementation Agent",
    description:
      "Converts approved mockups into production React components with routing, state management, and data layer.",
    currentTask: "Writing design.md — implementation in progress",
    status: "In Progress",
    history: [
      {
        task: "Wrote technical design document for react-implementation spec",
        date: "2026-05-30",
        status: "Completed",
        tokenUsage: { inputTokens: 14200, outputTokens: 22800, total: 37000 },
      },
    ],
  },
];

// Convenience: flat list of all history items for the history table
export const allHistoryItems = agents
  .flatMap((a) => a.history.map((h) => ({ ...h, agentName: a.name })))
  .sort((a, b) => b.date.localeCompare(a.date));

// Total token usage across all agents
export const totalTokenUsage: TokenUsage = agents
  .flatMap((a) => a.history)
  .reduce(
    (acc, h) => ({
      inputTokens: acc.inputTokens + h.tokenUsage.inputTokens,
      outputTokens: acc.outputTokens + h.tokenUsage.outputTokens,
      total: acc.total + h.tokenUsage.total,
    }),
    { inputTokens: 0, outputTokens: 0, total: 0 },
  );
