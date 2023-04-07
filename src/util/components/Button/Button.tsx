import React, { ButtonHTMLAttributes, forwardRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import styles from "./Button.module.scss";

interface ButtonProps {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: React.ReactNode;
  hoverText?: string;
  hoverColor?: "red" | undefined;
  color?: "primary" | "black" | "white" | "red";
  size?: "small" | "medium" | "large";
  largeFont?: boolean;
  stretch?: boolean;
  extraClasses?: string[];
  onClick?: (e: any) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef(
  (
    {
      type = "button",
      children,
      hoverText = "",
      hoverColor,
      color = "primary",
      size = "medium",
      largeFont = false,
      stretch = false,
      onClick = (e) => {},
      extraClasses = [],
      disabled = false,
      isLoading = false,
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const [content, setContent] = useState(children);
    const toggleHover = () => {
      if (content === children) {
        setContent(hoverText);
      } else {
        setContent(children);
      }
    };

    let buttonColorStyle;
    if (color === "primary") {
      buttonColorStyle = styles.Primary;
    } else if (color === "black") {
      buttonColorStyle = styles.Black;
    } else if (color === "white") {
      buttonColorStyle = styles.White;
    } else if (color === "red") {
      buttonColorStyle = styles.Red;
    }

    const buttonHoverStyle = hoverColor === "red" ? styles.HoverRed : "";

    let sizeStyle: styles.ButtonNames = styles.Medium;
    if (size === "small") {
      sizeStyle = styles.Small;
    } else if (size === "large") {
      sizeStyle = styles.Large;
    }

    const classes = [
      styles.Button,
      buttonColorStyle,
      buttonHoverStyle,
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
        {...(hoverText && { onMouseEnter: toggleHover })}
        {...(hoverText && { onMouseLeave: toggleHover })}
      >
        {isLoading ? (
          <TailSpin
            height="30"
            width="30"
            color="var(--primary-color)"
            ariaLabel="tail-spin-loading"
          />
        ) : (
          content
        )}
      </button>
    );
  }
);

export default Button;
