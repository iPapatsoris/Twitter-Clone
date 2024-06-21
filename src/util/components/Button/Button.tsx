import React, { ComponentProps, forwardRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import styles from "./Button.module.scss";
import scssExports from "../../../assets/styles/exports.module.scss";

type ButtonProps = ComponentProps<"button"> & {
  hoverText?: string;
  hoverColor?: "red" | undefined;
  largeFont?: boolean;
  stretch?: boolean;
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
  color?: "primary" | "black" | "white" | "red";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const {
      children,
      hoverText,
      hoverColor,
      color = "primary",
      size = "medium",
      largeFont,
      stretch,
      className,
      isLoading,
      onMouseEnter,
      onMouseLeave,
      ...nativeProps
    } = props;

    const [content, setContent] = useState(children);
    const toggleHover = () => {
      if (content === children) {
        setContent(hoverText);
      } else {
        setContent(children);
      }
    };

    const classes = getStyles({
      color,
      hoverColor,
      size,
      largeFont,
      className,
      stretch,
    });

    const buttonProps: ButtonProps = {
      ...nativeProps,
      type: props.type ?? "button",
      ref,
      className: classes,
      onMouseEnter: (e) => {
        hoverText && toggleHover();
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        hoverText && toggleHover();
        onMouseLeave && onMouseLeave(e);
      },
    };

    return (
      <button {...buttonProps}>
        {isLoading ? (
          <TailSpin
            height="30"
            width="30"
            color={scssExports.primaryColor}
            ariaLabel="tail-spin-loading"
          />
        ) : (
          content
        )}
      </button>
    );
  }
);

const getStyles = ({
  color,
  hoverColor,
  size,
  largeFont,
  className,
  stretch,
}: Pick<
  ButtonProps,
  "color" | "hoverColor" | "size" | "largeFont" | "className" | "stretch"
>) => {
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

  let sizeStyle: keyof typeof styles = styles.Medium;
  if (size === "small") {
    sizeStyle = styles.Small;
  } else if (size === "large") {
    sizeStyle = styles.Large;
  }

  return [
    styles.Button,
    buttonColorStyle,
    buttonHoverStyle,
    sizeStyle,
    largeFont ? styles.LargeFont : "",
    stretch ? styles.Stretch : "",
    className,
  ].join(" ");
};

export default Button;
