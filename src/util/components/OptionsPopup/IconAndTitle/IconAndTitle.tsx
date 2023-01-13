import styles, { IconAndTitleNames } from "./IconAndTitle.module.scss";
import Icon from "../../Icon/Icon";

interface IconAndTitleProps {
  icon: string;
  title: string;
  alt: string;
  size?: "small" | "large";
}

const IconAndTitle = ({
  icon,
  title,
  size = "small",
  alt,
}: IconAndTitleProps) => {
  const wrapperStyle = size === "large" ? styles.Large : styles.Small;
  const iconSize: IconAndTitleNames | "" =
    size === "large" ? styles.LargeIcon : "";

  return (
    <div className={[styles.IconAndTitle, wrapperStyle].join(" ")}>
      <Icon src={icon} hover="none" extraClasses={[iconSize]} alt={alt} />
      {title}
    </div>
  );
};

export default IconAndTitle;
