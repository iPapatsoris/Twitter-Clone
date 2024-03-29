import styles from "./List.module.scss";

interface ListProps {
  children: React.ReactNode;
  title?: string;
  withBackgroundColor?: boolean;
  withExpand?: boolean;
}

const List = ({
  children,
  title,
  withBackgroundColor,
  withExpand,
}: ListProps) => {
  const classes: Array<keyof typeof styles> = [];

  if (withBackgroundColor) {
    classes.push(styles.BackgroundColor);
  }

  return (
    <div className={[styles.List, ...classes].join(" ")}>
      {title && <h2 className={styles.Title}>{title}</h2>}
      {children}
      {withExpand && (
        <span className={[styles.PrimaryColor, styles.BigText].join(" ")}>
          Show more
        </span>
      )}
    </div>
  );
};

export default List;
