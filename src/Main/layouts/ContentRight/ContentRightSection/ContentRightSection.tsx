import styles from "./ContentRightSection.module.scss";
import * as React from "react";

interface ContentRightSectionProps {
  children: React.ReactNode;
  title?: string;
}

const ContentRightSection = ({ children, title }: ContentRightSectionProps) => (
  <div className={styles.ContentRightSection}>
    <h2>{title}</h2>
    {children}
    <span className={styles.ShowMore}>Show more</span>
  </div>
);

export default ContentRightSection;
