import styles from "./List.module.scss";
import * as React from "react";

interface ListProps {
  children: React.ReactNode;
  title?: string;
  withBackgroundColor?: boolean;
}

const List = ({ children, title, withBackgroundColor }: ListProps) => {
  const classes: styles.ListNames[] = [];

  if (withBackgroundColor) {
    classes.push(styles.BackgroundColor);
  }

  return (
    <div className={[styles.List, ...classes].join(" ")}>
      <h2>{title}</h2>
      {children}
      <span className={styles.ShowMore}>Show more</span>
    </div>
  );
};

export default List;
