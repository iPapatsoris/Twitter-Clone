import classes from "./Icon.module.scss";

interface IconProps {
  src: string;
  title?: string;
  hoverBg?: "normal" | "primary" | "none";
  size?: "normal" | "large" | "largeLogo";
}

const Icon = ({
  src,
  title = "",
  hoverBg = "normal",
  size = "normal",
}: IconProps) => {
  let hoverClassname = classes.HoverNormal;
  if (hoverBg !== "normal") {
    hoverClassname =
      hoverBg === "primary" ? classes.HoverPrimary : classes.HoverNone;
  }

  let sizeClassname = classes.NormalSize;
  if (size !== "normal") {
    sizeClassname =
      size === "large" ? classes.LargeSize : classes.LargeSizeLogo;
  }
  const styleClasses = [classes.Icon, hoverClassname, sizeClassname].join(" ");

  return <img src={src} title={title} className={styleClasses} />;
};

export default Icon;
