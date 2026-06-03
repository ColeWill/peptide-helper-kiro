import InternalBanner from "../../components/InternalBanner/InternalBanner";
import {
  specs,
  agentTaskSummaries,
  promptHistory,
  totalSpecTokenUsage,
} from "../../data/specsData";
import type { SpecStatus } from "../../data/specsData";
import styles from "./CompletedSpecsPage.module.scss";

function getBadgeClass(status: SpecStatus | string): string {
  switch (status) {
    case "Vibe-Coded":
      return styles.badgeVibeCoded;
    case "Spec-Coded":
      return styles.badgeSpecCoded;
    case "Completed":
      return styles.badgeCompleted;
    default:
      return styles.badgeYetToComplete;
  }
}

function countByStatus(status: string) {
  return specs.filter((s) => s.status === status).length;
}

export default function CompletedSpecsPage() {
  return (
    <div>
      <InternalBanner />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.eyebrow}>INTERNAL DASHBOARD</p>
          <h1 className={styles.pageTitle}>Completed Specs</h1>
          <p className={styles.pageSubtitle}>
            Full history of all specs, prompts, agent tasks, and project
            progress.
          </p>
        </div>
      </div>

      <div className={styles.main}>
        {/* Progress Overview */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Progress Overview</h2>
          <p className={styles.sectionDesc}>
            Count of specs in each status category.
          </p>
        </div>
        <div className={styles.progressGrid}>
          {[
            { status: "Vibe-Coded", countClass: styles.countVibeCoded },
            { status: "Spec-Coded", countClass: styles.countSpecCoded },
            { status: "Completed", countClass: styles.countCompleted },
            {
              status: "Yet to be Completed",
              countClass: styles.countYetToComplete,
              label: "Yet to Complete",
            },
          ].map(({ status, countClass, label }) => (
            <div key={status} className={styles.progressCard}>
              <div className={`${styles.progressCount} ${countClass}`}>
                {countByStatus(status)}
              </div>
              <div className={styles.progressLabel}>{label ?? status}</div>
            </div>
          ))}
        </div>

        <hr className={styles.divider} />

        {/* All Specs Table */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>All Specs</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Spec Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Agent</th>
                <th>Timestamp</th>
                <th>Summary</th>
                <th>Input</th>
                <th>Output</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.id}>
                  <td className={styles.specName}>{spec.name}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${getBadgeClass(spec.status)}`}
                    >
                      {spec.status}
                    </span>
                  </td>
                  <td className={styles.specDesc}>{spec.description}</td>
                  <td>{spec.agent}</td>
                  <td className={styles.timestamp}>
                    {new Date(spec.timestamp).toLocaleDateString()}
                  </td>
                  <td className={styles.summary}>{spec.summary}</td>
                  <td className={styles.tokenCell}>
                    {spec.tokenUsage.inputTokens.toLocaleString()}
                  </td>
                  <td className={styles.tokenCell}>
                    {spec.tokenUsage.outputTokens.toLocaleString()}
                  </td>
                  <td className={styles.tokenTotal}>
                    {spec.tokenUsage.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Token Usage Summary */}
        <div className={styles.tokenSummaryCard}>
          <div className={styles.tokenSummaryTitle}>Total Token Usage</div>
          <div className={styles.tokenStats}>
            {[
              {
                label: "Input Tokens",
                value: totalSpecTokenUsage.inputTokens,
              },
              {
                label: "Output Tokens",
                value: totalSpecTokenUsage.outputTokens,
              },
              { label: "Total", value: totalSpecTokenUsage.total },
            ].map(({ label, value }) => (
              <div key={label} className={styles.tokenStat}>
                <div className={styles.tokenStatValue}>
                  {value.toLocaleString()}
                </div>
                <div className={styles.tokenStatLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Agent Task Summary */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Agent Task Summary</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Completed Tasks</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {agentTaskSummaries.map((a) => (
                <tr key={a.agent}>
                  <td className={styles.agentCol}>{a.agent}</td>
                  <td>
                    <ul className={styles.taskList}>
                      {a.tasks.map((t, i) => (
                        <li key={i}>
                          <span className={styles.taskCheck}>✓</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className={styles.countCell}>{a.tasks.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className={styles.divider} />

        {/* Prompt History */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Prompt History</h2>
          <p className={styles.sectionDesc}>
            All prompts submitted, in chronological order.
          </p>
        </div>
        <div className={styles.promptList}>
          {promptHistory.map((p) => (
            <div key={p.id} className={styles.promptCard}>
              <div className={styles.promptMeta}>
                <span className={`${styles.badge} ${styles.badgeSpecCoded}`}>
                  Prompt
                </span>
                <span className={styles.promptDate}>{p.date}</span>
              </div>
              <p className={styles.promptText}>{p.text}</p>
              <div className={styles.promptTasks}>
                {p.tasks.map((t, i) => (
                  <span key={i} className={styles.taskChip}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
