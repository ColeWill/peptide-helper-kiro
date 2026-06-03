import type { PeptideTag } from "../../types/peptide";
import styles from "./TagBadge.module.scss";

interface TagBadgeProps {
  tag: PeptideTag;
}

const tagClassMap: Record<PeptideTag, string> = {
  "Fat Loss": styles.fatLoss,
  "Anti-Aging": styles.antiAging,
  "Youthful Skin": styles.youthfulSkin,
  "Muscle Recovery": styles.muscleRecovery,
};

export default function TagBadge({ tag }: TagBadgeProps) {
  return <span className={`${styles.badge} ${tagClassMap[tag]}`}>{tag}</span>;
}
