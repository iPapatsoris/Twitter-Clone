import styles from "./IconAndTitle.module.scss";
import Icon, { IconProps } from "../../Icon/Icon";

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
  const iconSize: IconProps["size"] =
    size === "large" ? "largeMoreOptions" : "normal";

  return (
    <div className={[styles.IconAndTitle, wrapperStyle].join(" ")}>
      <Icon src={icon} hoverBg="none" size={iconSize} alt={alt} />
      {title}
    </div>
  );
};

export default IconAndTitle;
