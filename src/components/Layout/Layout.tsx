import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav";
import styles from "./Layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Nav />
      <Outlet />
    </div>
  );
}
