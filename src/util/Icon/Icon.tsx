import classes from "./Icon.module.scss";

interface IconProps {
  src: string;
  title: string;
  hoverBg?: "primary" | "normal" | "none";
}

const Icon = ({ src, title, hoverBg = "normal" }: IconProps) => {
  let hoverClassname =
    hoverBg === "normal" ? classes.HoverNormal : classes.HoverPrimary;
  if (hoverBg === "none") {
    hoverClassname = "";
  }
  const styleClasses = classes.Icon + " " + hoverClassname;

  return <img src={src} title={title} className={styleClasses} />;
};

export default Icon;
