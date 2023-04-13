import styles from "./Minipage.module.scss";

interface MinipageProps {
  header: React.ReactElement;
  footer?: React.ReactElement;
  children: React.ReactElement[] | React.ReactElement;
  alignHeaderWithContent?: boolean;
}

const Minipage = ({
  header,
  footer,
  children,
  alignHeaderWithContent = true,
}: MinipageProps) => {
  const extraStyles = alignHeaderWithContent
    ? [styles.AlignHeaderWithContent]
    : [];

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
