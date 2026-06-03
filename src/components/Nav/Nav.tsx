import { NavLink } from "react-router-dom";
import styles from "./Nav.module.scss";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <span className={styles.logoPeptide}>Peptide</span>
        <span className={styles.logoHelper}>Helper</span>
      </NavLink>

      <div className={styles.navLinks}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          Explore
        </NavLink>
        <NavLink
          to="/agent-insights"
          className={({ isActive }) =>
            `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          Agent Insights
        </NavLink>
        <NavLink
          to="/completed-specs"
          className={({ isActive }) =>
            `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          Completed Specs
        </NavLink>
      </div>
    </nav>
  );
}
