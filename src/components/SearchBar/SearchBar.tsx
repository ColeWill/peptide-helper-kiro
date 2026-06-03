import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.icon}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="6.5"
          cy="6.5"
          r="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="10.5"
          y1="10.5"
          x2="14.5"
          y2="14.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        className={styles.input}
        placeholder="Search peptides…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search peptides"
      />
    </div>
  );
}
