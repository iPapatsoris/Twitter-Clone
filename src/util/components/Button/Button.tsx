import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  color?: "primary" | "black";
  size?: "small" | "medium" | "large";
  largeFont?: boolean;
  stretch?: boolean;
}

const Button = ({
  children,
  color = "primary",
  size = "medium",
  largeFont = false,
  stretch = false,
}: ButtonProps) => {
  const colorStyle = color === "primary" ? styles.Primary : styles.Black;
  let sizeStyle: styles.ButtonNames = styles.Medium;
  if (size === "small") {
    sizeStyle = styles.Small;
  } else if (size === "large") {
    sizeStyle = styles.Large;
  }

  const classes = [
    styles.Button,
    colorStyle,
    sizeStyle,
    largeFont ? styles.LargeFont : "",
    stretch ? styles.Stretch : "",
  ].join(" ");

  return <button className={classes}>{children}</button>;
};

export default Button;
