import { useState } from "react";
import InternalBanner from "../../components/InternalBanner/InternalBanner";
import { agents, allHistoryItems, totalTokenUsage } from "../../data/agentData";
import type { Agent, AgentStatus } from "../../data/agentData";
import styles from "./AgentInsightsPage.module.scss";

function statusClass(status: AgentStatus): string {
  switch (status) {
    case "Completed":
      return styles.statusCompleted;
    case "In Progress":
      return styles.statusInProgress;
    case "Pending":
      return styles.statusPending;
    case "Blocked":
      return styles.statusBlocked;
  }
}

export default function AgentInsightsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleNodeClick = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId) ?? null;
    setSelectedAgent(agent);
  };

  return (
    <div>
      <InternalBanner />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>INTERNAL DASHBOARD</p>
          <h1 className={styles.pageTitle}>Agent Insights</h1>
          <p className={styles.pageSubtitle}>
            Live view of all agents, their current task status, flowcharts, and
            task history.
          </p>
        </div>
      </div>

      <div className={styles.main}>
        {/* Agent Status Cards */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Agent Status</h2>
          <p className={styles.sectionDesc}>
            Current task and status for each agent.
          </p>
        </div>
        <div className={styles.agentsGrid}>
          {agents.map((agent) => (
            <div key={agent.id} className={styles.agentCard}>
              <div className={styles.agentCardHeader}>
                <span className={styles.agentName}>{agent.name}</span>
                <span
                  className={`${styles.statusBadge} ${statusClass(agent.status)}`}
                >
                  {agent.status}
                </span>
              </div>
              <div className={styles.agentCardBody}>
                <p className={styles.agentDesc}>{agent.description}</p>
                <div className={styles.currentTaskLabel}>Current Task</div>
                <div className={styles.currentTaskValue}>
                  {agent.currentTask}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className={styles.divider} />

        {/* Flowchart */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Agent Flowcharts</h2>
          <p className={styles.sectionDesc}>
            Click any node to see agent details and current status.
          </p>
        </div>
        <div className={styles.flowchartContainer}>
          <div className={styles.flowchartTitle}>
            UX Design Phase — Agent Flow
          </div>
          <svg
            className={styles.flowchart}
            viewBox="0 0 700 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill="#4a9eff" />
              </marker>
            </defs>
            {/* Connections */}
            <line
              x1="130"
              y1="80"
              x2="230"
              y2="80"
              stroke="#4a9eff"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <line
              x1="370"
              y1="80"
              x2="470"
              y2="80"
              stroke="#4a9eff"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <line
              x1="300"
              y1="110"
              x2="300"
              y2="160"
              stroke="#4a9eff"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <line
              x1="300"
              y1="200"
              x2="300"
              y2="225"
              stroke="#1db954"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              markerEnd="url(#arrow)"
            />

            {/* Requirements Agent */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick("requirements-agent")}
              role="button"
              aria-label="Requirements Agent"
            >
              <rect
                x="10"
                y="55"
                width="120"
                height="50"
                rx="8"
                fill="#0f1f35"
                stroke="#1db954"
                strokeWidth="1.5"
              />
              <text
                x="70"
                y="76"
                textAnchor="middle"
                fill="#f0f4f0"
                fontSize="11"
                fontFamily="Inter,sans-serif"
                fontWeight="600"
              >
                Requirements
              </text>
              <text
                x="70"
                y="92"
                textAnchor="middle"
                fill="#1db954"
                fontSize="10"
                fontFamily="Inter,sans-serif"
              >
                Agent
              </text>
              <circle cx="108" cy="62" r="5" fill="#1db954" />
            </g>

            {/* UX Design Agent */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick("design-agent")}
              role="button"
              aria-label="UX Design Mockup Agent"
            >
              <rect
                x="230"
                y="55"
                width="140"
                height="50"
                rx="8"
                fill="#0f1f35"
                stroke="#4a9eff"
                strokeWidth="1.5"
              />
              <text
                x="300"
                y="76"
                textAnchor="middle"
                fill="#f0f4f0"
                fontSize="11"
                fontFamily="Inter,sans-serif"
                fontWeight="600"
              >
                UX Design
              </text>
              <text
                x="300"
                y="92"
                textAnchor="middle"
                fill="#4a9eff"
                fontSize="10"
                fontFamily="Inter,sans-serif"
              >
                Mockup Agent
              </text>
              <circle cx="358" cy="62" r="5" fill="#4a9eff" />
            </g>

            {/* Data Seed Agent */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick("data-agent")}
              role="button"
              aria-label="Data Seed Agent"
            >
              <rect
                x="470"
                y="55"
                width="120"
                height="50"
                rx="8"
                fill="#0f1f35"
                stroke="#7b2d8b"
                strokeWidth="1.5"
              />
              <text
                x="530"
                y="76"
                textAnchor="middle"
                fill="#f0f4f0"
                fontSize="11"
                fontFamily="Inter,sans-serif"
                fontWeight="600"
              >
                Data
              </text>
              <text
                x="530"
                y="92"
                textAnchor="middle"
                fill="#c084fc"
                fontSize="10"
                fontFamily="Inter,sans-serif"
              >
                Seed Agent
              </text>
              <circle cx="578" cy="62" r="5" fill="#7b2d8b" />
            </g>

            {/* Human Review Gate */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick("review-agent")}
              role="button"
              aria-label="Human Review Gate"
            >
              <rect
                x="230"
                y="160"
                width="140"
                height="50"
                rx="8"
                fill="#0f1f35"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text
                x="300"
                y="181"
                textAnchor="middle"
                fill="#f0f4f0"
                fontSize="11"
                fontFamily="Inter,sans-serif"
                fontWeight="600"
              >
                Human Review
              </text>
              <text
                x="300"
                y="197"
                textAnchor="middle"
                fill="#f59e0b"
                fontSize="10"
                fontFamily="Inter,sans-serif"
              >
                Approval Gate
              </text>
              <circle cx="358" cy="167" r="5" fill="#f59e0b" />
            </g>

            {/* React Implementation */}
            <g
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick("react-agent")}
              role="button"
              aria-label="React Implementation Agent"
            >
              <rect
                x="230"
                y="230"
                width="140"
                height="30"
                rx="6"
                fill="#1a3a5c"
                stroke="#1e3a52"
                strokeWidth="1"
                strokeDasharray="4,3"
              />
              <text
                x="300"
                y="249"
                textAnchor="middle"
                fill="#a0b0a8"
                fontSize="10"
                fontFamily="Inter,sans-serif"
              >
                React Implementation
              </text>
            </g>

            {/* Token total */}
            <text
              x="700"
              y="292"
              textAnchor="end"
              fill="#a0b0a8"
              fontSize="11"
              fontFamily="Inter,sans-serif"
            >
              Total tokens used: {totalTokenUsage.total.toLocaleString()}
            </text>
          </svg>

          {/* Node Detail Panel */}
          {selectedAgent && (
            <div className={styles.nodePanel}>
              <button
                className={styles.nodePanelClose}
                onClick={() => setSelectedAgent(null)}
                aria-label="Close panel"
              >
                ✕
              </button>
              <div className={styles.nodePanelTitle}>{selectedAgent.name}</div>
              <div className={styles.nodePanelDesc}>
                {selectedAgent.description}
              </div>
              <span
                className={`${styles.statusBadge} ${statusClass(selectedAgent.status)}`}
              >
                {selectedAgent.status}
              </span>
            </div>
          )}
        </div>

        <hr className={styles.divider} />

        {/* Task History Table */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Past Task History</h2>
          <p className={styles.sectionDesc}>
            All completed tasks across agents, most recent first.
          </p>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Task</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {allHistoryItems.map((item, i) => (
                <tr key={i}>
                  <td className={styles.agentCol}>{item.agentName}</td>
                  <td>{item.task}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className={styles.dateCol}>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
