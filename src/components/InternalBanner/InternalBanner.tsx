import styles from "./InternalBanner.module.scss";

export default function InternalBanner() {
  return (
    <div className={styles.banner}>
      ⚠ Internal Tool — Not part of the public app
    </div>
  );
}
