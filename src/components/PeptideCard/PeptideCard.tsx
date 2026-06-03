import type { Peptide } from "../../types/peptide";
import TagBadge from "../TagBadge/TagBadge";
import styles from "./PeptideCard.module.scss";

interface PeptideCardProps {
  peptide: Peptide;
  onClick: (peptide: Peptide) => void;
}

export default function PeptideCard({ peptide, onClick }: PeptideCardProps) {
  return (
    <div
      className={styles.card}
      onClick={() => onClick(peptide)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(peptide);
        }
      }}
      aria-label={`View details for ${peptide.name}`}
    >
      <img
        src={peptide.imagePlaceholderUrl}
        alt={peptide.name}
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{peptide.name}</h3>
        <p className={styles.tagline}>{peptide.shortDescription}</p>
        <div className={styles.tags}>
          {peptide.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
