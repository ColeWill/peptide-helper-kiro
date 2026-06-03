import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePeptides } from "../../context/PeptideContext";
import type { Peptide } from "../../types/peptide";
import PeptideCard from "../../components/PeptideCard/PeptideCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import DetailModal from "../../components/DetailModal/DetailModal";
import styles from "./ExplorePage.module.scss";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function ExplorePage() {
  const {
    filteredPeptides,
    activeFilter,
    searchQuery,
    setActiveFilter,
    setSearchQuery,
  } = usePeptides();
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  function handleCardClick(peptide: Peptide) {
    if (isMobile) {
      navigate(`/peptide/${peptide.id}`);
    } else {
      setSelectedPeptide(peptide);
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>ADVANCED PEPTIDE RESEARCH</p>
        <h1 className={styles.heroTitle}>
          Unlock Your Body's <em>Regenerative Potential</em>
        </h1>
        <p className={styles.heroSubtitle}>
          Explore evidence-based peptide protocols for fat loss, anti-aging,
          skin health, and muscle recovery.
        </p>
        <a href="#explore" className={styles.heroCta}>
          Explore Peptides
        </a>
      </section>

      {/* Sticky controls */}
      <div className={styles.controls} id="explore">
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Card grid */}
      <section className={styles.gridSection}>
        {filteredPeptides.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔬</div>
            <h3 className={styles.emptyTitle}>No peptides found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPeptides.map((peptide) => (
              <PeptideCard
                key={peptide.id}
                peptide={peptide}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </section>

      <DetailModal
        peptide={selectedPeptide}
        onClose={() => setSelectedPeptide(null)}
      />
    </div>
  );
}
