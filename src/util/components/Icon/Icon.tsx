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
  exactLeftPlacement?: boolean;
  exactRightPlacement?: boolean;
  exactVerticalPlacement?: boolean;
  exactBottomPlacement?: boolean;
  exactTopPlacement?: boolean;
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
      exactLeftPlacement,
      exactRightPlacement,
      exactVerticalPlacement,
      exactBottomPlacement,
      exactTopPlacement,
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
    const exactPlacementClasses = [];
    if (exactLeftPlacement) {
      exactPlacementClasses.push(styles.ExactLeftPlacement);
    }
    if (exactRightPlacement) {
      exactPlacementClasses.push(styles.ExactRightPlacement);
    }
    if (exactVerticalPlacement) {
      exactPlacementClasses.push(
        styles.ExactTopPlacement,
        styles.ExactBottomPlacement
      );
    }
    if (exactTopPlacement) {
      exactPlacementClasses.push(styles.ExactTopPlacement);
    }
    if (exactBottomPlacement) {
      exactPlacementClasses.push(styles.ExactBottomPlacement);
    }

    const withBorderClass = withBorder ? styles.WithBorder : "";
    const hoverClassname = getHoverClass(hover);

    return (
      <div
        className={[
          styles.IconAndTextWrapper,
          hoverClassname,
          ...exactPlacementClasses,
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
