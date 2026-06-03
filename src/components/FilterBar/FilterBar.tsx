import styles from "./FilterBar.module.scss";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (tag: string) => void;
}

const FILTER_LABELS = [
  "All",
  "Fat Loss",
  "Anti-Aging",
  "Youthful Skin",
  "Muscle Recovery",
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      {FILTER_LABELS.map((label) => (
        <button
          key={label}
          aria-pressed={activeFilter === label}
          className={activeFilter === label ? styles.active : undefined}
          onClick={() => onFilterChange(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
