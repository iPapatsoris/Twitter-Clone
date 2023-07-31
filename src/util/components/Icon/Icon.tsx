import React, { forwardRef, useLayoutEffect, useRef } from "react";
import styles from "./Icon.module.scss";
import { toPixels } from "../../string";

export interface IconProps {
  src: string;
  title?: string;
  alt?: string;
  hover?: "normal" | "primary" | "green" | "pink" | "none";
  withBorder?: boolean;
  extraStyles?: Array<string>;
  extraWrapperStyles?: Array<string>;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  noLeftMargin?: boolean;
  noRightMargin?: boolean;
  noInlineMargin?: boolean;
  noBlockMargin?: boolean;
  noBottomMargin?: boolean;
  noTopMargin?: boolean;
  text?: string;
  size?: number;
  noCursorPointer?: boolean;
}

const getHoverClass = (hover: IconProps["hover"]) => {
  let hoverClassname: keyof typeof styles = styles.Hover;
  if (hover === "primary") {
    hoverClassname = styles.HoverPrimary;
  } else if (hover === "none") {
    hoverClassname = styles.NoHover;
  } else if (hover === "green") {
    hoverClassname = styles.HoverGreen;
  } else if (hover === "pink") {
    hoverClassname = styles.HoverPink;
  }

  return hoverClassname;
};

const Icon = forwardRef(
  (
    {
      src,
      title = "",
      alt = "",
      hover = "normal",
      withBorder,
      extraStyles = [],
      extraWrapperStyles = [],
      onClick = () => {},
      noLeftMargin,
      noRightMargin,
      noInlineMargin,
      noBlockMargin,
      noBottomMargin,
      noTopMargin,
      text,
      size,
      noCursorPointer,
    }: IconProps,
    ref: React.ForwardedRef<HTMLImageElement>
  ) => {
    const iconAndTextRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (size && iconAndTextRef && iconAndTextRef.current) {
        iconAndTextRef.current.style.setProperty("--icon-size", toPixels(size));
      }
    });
    const noMarginClasses = [];
    if (noInlineMargin) {
      noMarginClasses.push(styles.NoLeftMargin, styles.NoRightMargin);
    } else {
      if (noLeftMargin) {
        noMarginClasses.push(styles.NoLeftMargin);
      }
      if (noRightMargin) {
        noMarginClasses.push(styles.NoRightMargin);
      }
    }
    if (noBlockMargin) {
      noMarginClasses.push(styles.NoTopMargin, styles.NoBottomMargin);
    } else {
      if (noTopMargin) {
        noMarginClasses.push(styles.NoTopMargin);
      }
      if (noBottomMargin) {
        noMarginClasses.push(styles.NoBottomMargin);
      }
    }

    const withBorderClass = withBorder ? styles.WithBorder : "";
    const hoverClassname = getHoverClass(hover);

    return (
      <div
        className={[
          styles.IconAndTextWrapper,
          hoverClassname,
          ...noMarginClasses,
          ...extraWrapperStyles,
        ].join(" ")}
        onClick={onClick}
        ref={iconAndTextRef}
      >
        <div
          // Prevent losing cursor position when an icon is clicked within an
          // input, like a password reveal toggle
          onMouseUp={(e) => e.preventDefault()}
          className={[
            withBorderClass,
            styles.IconWrapper,
            hoverClassname === styles.NoHover ? styles.NoHover : "",
          ].join(" ")}
        />
        <img
          src={src}
          title={title}
          alt={alt}
          className={[
            styles.Icon,
            styles.NoHighlighting,
            noCursorPointer ? styles.NoCursorPointer : "",
            ...extraStyles,
          ].join(" ")}
          ref={ref}
        />
        {text && <span className={styles.Text}>{text}</span>}
      </div>
    );
  }
);

export default Icon;
