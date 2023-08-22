import styles from "./Minipage.module.scss";

interface MinipageProps {
  header: React.ReactElement;
  footer?: React.ReactElement;
  children: React.ReactElement[] | React.ReactElement;
  alignContent?: "none" | "icon" | "header";
}

const Minipage = ({
  header,
  footer,
  children,
  alignContent = "header",
}: MinipageProps) => {
  const extraStyles = [];
  if (alignContent === "header") {
    extraStyles.push(styles.AlignContentWithHeader);
  } else if (alignContent === "icon") {
    extraStyles.push(styles.AlignContentWithIcon);
  }

  return (
    <div className={[styles.Minipage, ...extraStyles].join(" ")}>
      {header}
      <div className={styles.Content}>{children}</div>
      {!footer ? null : (
        <div className={styles.Footer}>
          <div className={styles.Wrapper}>{footer}</div>
        </div>
      )}
    </div>
  );
};

export default Minipage;
