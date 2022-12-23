import "./ContentRightSection.scss";
import * as React from "react";

interface ContentRightSectionProps {
  children: React.ReactNode;
  title?: string;
}

const ContentRightSection = ({ children, title }: ContentRightSectionProps) => (
  <div className="ContentRightSection">
    <h2>{title}</h2>
    {children}
    <span className="ShowMore">Show more</span>
  </div>
);

export default ContentRightSection;