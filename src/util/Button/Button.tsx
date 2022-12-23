import { capitalizeFirstLetter } from "../string";
import "./Button.scss";

interface ButtonProps {
  children: React.ReactNode;
  color?: "primary" | "black";
  style?: "small" | "medium" | "large";
  largeFont?: boolean;
  stretch?: boolean;
}

const Button = ({
  children,
  color = "primary",
  style = "medium",
  largeFont = false,
  stretch = false,
}: ButtonProps) => {
  const classes = [
    "Button ",
    capitalizeFirstLetter(color),
    capitalizeFirstLetter(style),
    largeFont ? "LargeFont" : "",
    stretch ? "Stretch" : "",
  ].join(" ");

  return <button className={classes}>{children}</button>;
};

export default Button;
