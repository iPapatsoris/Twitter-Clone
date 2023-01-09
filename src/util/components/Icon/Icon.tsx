import styles from "./Icon.module.scss";

export interface IconProps {
  src: string;
  title?: string;
  hoverBg?: "normal" | "primary" | "none";
  size?: "normal" | "large" | "largeMoreOptions" | "largeLogo" | "tiny";
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const Icon = ({
  src,
  title = "",
  hoverBg = "normal",
  size = "normal",
  onClick = () => {},
}: IconProps) => {
  let hoverClassname: styles.IconNames = styles.HoverNormal;
  if (hoverBg !== "normal") {
    hoverClassname =
      hoverBg === "primary" ? styles.HoverPrimary : styles.HoverNone;
  }

  let sizeClassname: styles.IconNames = styles.NormalSize;
  if (size === "large") {
    sizeClassname = styles.LargeSize;
  } else if (size === "largeLogo") {
    sizeClassname = styles.LargeSizeLogo;
  } else if (size === "largeMoreOptions") {
    sizeClassname = styles.LargeSizeMoreOption;
  } else if (size === "tiny") {
    sizeClassname = styles.TinySizeLogo;
  }
  const stylestyles = [
    styles.Icon,
    hoverClassname,
    sizeClassname,
    styles.NoHighlighting,
  ].join(" ");

  return (
    <img src={src} title={title} onClick={onClick} className={stylestyles} />
  );
};

export default Icon;
