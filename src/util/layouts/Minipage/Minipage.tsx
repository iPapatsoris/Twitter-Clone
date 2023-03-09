import React from "react";
import styles from "./Minipage.module.scss";

interface MinipageProps {
  header: React.ReactElement;
  footer: React.ReactElement;
  children: React.ReactElement[] | React.ReactElement;
}

const Minipage = ({ header, footer, children }: MinipageProps) => {
  return (
    <div className={styles.Minipage}>
      <div className={styles.Header}>{header}</div>
      <div className={styles.Content}>
        <div className={styles.Wrapper}>{children}</div>
      </div>
      <div className={styles.Footer}>
        <div className={styles.Wrapper}>{footer}</div>
      </div>
    </div>
  );
};

export default Minipage;
