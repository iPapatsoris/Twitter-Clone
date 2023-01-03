import styles from "./Icon.module.scss";

interface IconProps {
  src: string;
  title?: string;
  hoverBg?: "normal" | "primary" | "none";
  size?: "normal" | "large" | "largeLogo" | "tiny";
}

const Icon = ({
  src,
  title = "",
  hoverBg = "normal",
  size = "normal",
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
  } else if (size === "tiny") {
    sizeClassname = styles.TinySizeLogo;
  }
  const stylestyles = [styles.Icon, hoverClassname, sizeClassname].join(" ");

  return <img src={src} title={title} className={stylestyles} />;
};

export default Icon;
