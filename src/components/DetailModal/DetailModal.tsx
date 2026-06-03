import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { Peptide } from "../../types/peptide";
import TagBadge from "../TagBadge/TagBadge";
import styles from "./DetailModal.module.scss";

interface DetailModalProps {
  peptide: Peptide | null;
  onClose: () => void;
}

export default function DetailModal({ peptide, onClose }: DetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when open
  useEffect(() => {
    if (peptide) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [peptide]);

  // Escape key to close
  useEffect(() => {
    if (!peptide) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [peptide, onClose]);

  // Focus trap
  useEffect(() => {
    if (!peptide) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    if (!modal) return;
    const focusableSelectors =
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), " +
      'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(modal.querySelectorAll<HTMLElement>(focusableSelectors));
    const focusable = getFocusable();
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const elements = getFocusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [peptide]);

  if (!peptide) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-name"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} ref={modalRef}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <img
          src={peptide.imagePlaceholderUrl}
          alt={peptide.name}
          className={styles.heroImage}
        />
        <div className={styles.body}>
          <div className={styles.tags}>
            {peptide.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <h2 id="modal-name" className={styles.name}>
            {peptide.name}
          </h2>
          <p className={styles.desc}>{peptide.shortDescription}</p>

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

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Research Notes</p>
            {peptide.researchNotes.map((note, i) => (
              <div key={i} className={styles.researchNote}>
                {note}
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Suggested Dosage</p>
            <div className={styles.dosageCard}>{peptide.suggestedDosage}</div>
          </div>

          <Link
            to={`/peptide/${peptide.id}`}
            className={styles.viewLink}
            onClick={onClose}
          >
            View Full Detail Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
