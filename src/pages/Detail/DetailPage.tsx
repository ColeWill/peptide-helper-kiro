import { useParams, Link } from "react-router-dom";
import { usePeptides } from "../../context/PeptideContext";
import TagBadge from "../../components/TagBadge/TagBadge";
import styles from "./DetailPage.module.scss";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { peptides } = usePeptides();
  const peptide = peptides.find((p) => p.id === id);

  if (!peptide) {
    return (
      <div className={styles.notFound}>
        <h2>Peptide not found</h2>
        <Link to="/">← Back to all peptides</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to all peptides
      </Link>

      {/* Hero - two columns desktop, one column mobile */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <img
            src={peptide.imagePlaceholderUrl}
            alt={peptide.name}
            className={styles.heroImage}
          />
          <div className={styles.tags}>
            {peptide.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <h1 className={styles.peptideName}>{peptide.name}</h1>
          <p className={styles.subtitle}>{peptide.shortDescription}</p>
          <div className={styles.dosageCard}>
            <div className={styles.dosageLabel}>💉 Suggested Dosage</div>
            <div className={styles.dosageValue}>{peptide.suggestedDosage}</div>
          </div>
        </div>
        <div className={styles.heroRight}>
          {/* Benefits */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Key Benefits</p>
            <ul className={styles.benefitsList}>
              {peptide.benefits.map((b, i) => (
                <li key={i} className={styles.benefitItem}>
                  <span className={styles.check}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Research Notes */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Research Notes</p>
            {peptide.researchNotes.map((note, i) => (
              <div key={i} className={styles.researchNote}>
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar/disclaimer row */}
      <div className={styles.disclaimer}>
        <strong>Research Disclaimer:</strong> The information provided is for
        educational purposes only and is not medical advice. Consult a
        healthcare professional before use.
      </div>
    </div>
  );
}
