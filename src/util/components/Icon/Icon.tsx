import styles from "./Icon.module.scss";

export interface IconProps {
  src: string;
  title?: string;
  alt?: string;
  hover?: "normal" | "primary" | "none";
  extraStyles?: Array<string>;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const Icon = ({
  src,
  title = "",
  alt = "",
  hover = "normal",
  extraStyles = [],
  onClick = () => {},
}: IconProps) => {
  let hoverClassname: styles.IconNames = styles.Hover;
  if (hover === "primary") {
    hoverClassname = styles.HoverPrimary;
  } else if (hover === "none") {
    hoverClassname = styles.NoHover;
  }

  return (
    <img
      src={src}
      title={title}
      alt={alt}
      onClick={onClick}
      className={[
        styles.Icon,
        styles.NoHighlighting,
        hoverClassname,
        extraStyles,
      ].join(" ")}
    />
  );
};

export default Icon;
