import React, { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: React.ReactNode;
  color?: "primary" | "black" | "white";
  size?: "small" | "medium" | "large";
  largeFont?: boolean;
  stretch?: boolean;
  extraClasses?: string[];
  onClick?: (e: any) => void;
  disabled?: boolean;
}

const Button = forwardRef(
  (
    {
      type = "button",
      children,
      color = "primary",
      size = "medium",
      largeFont = false,
      stretch = false,
      onClick = (e) => {},
      extraClasses = [],
      disabled = false,
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
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
      disabled ? styles.Disabled : "",
      ...extraClasses,
    ].join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={classes}
        onClick={(e) => onClick(e)}
      >
        {children}
      </button>
    );
  }
);

export default Button;
