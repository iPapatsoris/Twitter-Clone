import styles from "./IconAndTitle.module.scss";
import Icon from "../../../Icon/Icon";
import { ComponentProps } from "react";

interface IconAndTitleProps {
  icon: ComponentProps<typeof Icon>["src"];
  title: string;
  alt: string;
  size?: "small" | "large";
  onClick?: VoidFunction;
}

const IconAndTitle = ({
  icon,
  title,
  size = "small",
  alt,
  onClick,
}: IconAndTitleProps) => {
  const wrapperStyle = size === "large" ? styles.Large : styles.Small;

  return (
    <div
      onClick={onClick}
      className={[styles.IconAndTitle, wrapperStyle].join(" ")}
    >
      <Icon src={icon} hover="none" size={24} alt={alt} />
      {title}
    </div>
  );
};

export default IconAndTitle;
