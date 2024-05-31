import React, { ComponentProps, forwardRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import styles from "./Button.module.scss";
import scssExports from "../../../assets/styles/exports.module.scss";
import { getClassFieldsToArray } from "../../types";

class NonHTMLProps {
  constructor(
    readonly hoverText?: string,
    readonly hoverColor?: "red" | undefined,
    readonly round?: boolean,
    readonly largeFont?: boolean,
    readonly stretch?: boolean,
    readonly extraClasses?: string[],
    readonly isLoading?: boolean
  ) {}
}
const nonHTMLProps = getClassFieldsToArray(NonHTMLProps);

interface OverridenHTMLProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "black" | "white" | "red";
}

export interface ButtonProps
  extends Omit<ComponentProps<"button">, keyof OverridenHTMLProps>,
    OverridenHTMLProps,
    NonHTMLProps {}

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
      extraClasses = [],
      isLoading,
      onMouseEnter,
      onMouseLeave,
    } = props;

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

    let sizeStyle: keyof typeof styles = styles.Medium;
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
      ...extraClasses,
    ].join(" ");

    const buttonProps: ButtonProps = {
      ...props,
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

    nonHTMLProps.forEach((p) => delete buttonProps[p]);

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

export default Button;
