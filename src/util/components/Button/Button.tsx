import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  color?: "primary" | "black" | "white";
  size?: "small" | "medium" | "large";
  largeFont?: boolean;
  stretch?: boolean;
  extraClasses?: string[];
  onClick?: (e: any) => void;
}

const Button = ({
  children,
  color = "primary",
  size = "medium",
  largeFont = false,
  stretch = false,
  onClick = (e) => {},
  extraClasses = [],
}: ButtonProps) => {
  let buttonColorStyle;
  let fontColorStyle;
  if (color === "primary") {
    buttonColorStyle = styles.Primary;
  } else if (color === "black") {
    buttonColorStyle = styles.Black;
  } else if (color === "white") {
    buttonColorStyle = styles.White;
    fontColorStyle = styles.BlackFont;
  }

  let sizeStyle: styles.ButtonNames = styles.Medium;
  if (size === "small") {
    sizeStyle = styles.Small;
  } else if (size === "large") {
    sizeStyle = styles.Large;
  }

  const classes = [
    styles.Button,
    buttonColorStyle,
    fontColorStyle,
    sizeStyle,
    largeFont ? styles.LargeFont : "",
    stretch ? styles.Stretch : "",
    ...extraClasses,
  ].join(" ");

  return (
    <button className={classes} onClick={(e) => onClick(e)}>
      {children}
    </button>
  );
};

export default Button;
