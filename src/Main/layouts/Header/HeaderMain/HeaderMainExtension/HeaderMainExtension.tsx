import styles from "./HeaderMainExtension.module.scss";

interface HeaderMainExtensionProps {
  headerMainChild: React.ReactNode;
  headerExtendedChild: React.ReactNode;
}

const HeaderMainExtension = ({
  headerMainChild,
  headerExtendedChild,
}: HeaderMainExtensionProps) => {
  return (
    <div className={[styles.Sticky, styles.HeaderExtended].join(" ")}>
      {headerMainChild}
      <div className={styles.HeaderExtended}>{headerExtendedChild}</div>
    </div>
  );
};

export default HeaderMainExtension;
