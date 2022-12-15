import classes from "./Icon.module.scss";

interface IconProps {
  src: string;
  title: string;
  blueHover?: boolean;
}

const Icon = ({ src, title, blueHover = false }: IconProps) => {
  const hoverClassname = blueHover
    ? classes.HoverPrimaryColor
    : classes.HoverBgColor;
  const styleClasses = classes.Icon + " " + hoverClassname;
  return <img src={src} title={title} className={styleClasses} />;
};

export default Icon;
