import React, { forwardRef } from "react";
import styles from "./Icon.module.scss";

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
  text?: string;
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
      text,
    }: IconProps,
    ref: React.ForwardedRef<HTMLImageElement>
  ) => {
    const exactPlacementClasses = [];
    if (exactLeftPlacement) {
      exactPlacementClasses.push(styles.ExactLeftPlacement);
    }
    if (exactRightPlacement) {
      exactPlacementClasses.push(styles.ExactRightPlacement);
    }
    if (exactVerticalPlacement) {
      exactPlacementClasses.push(styles.ExactVerticalPlacement);
    }

    const withBorderClass = withBorder ? styles.WithBorder : "";
    const hoverClassname = getHoverClass(hover);

    return (
      <div
        className={[
          styles.IconAndTextWrapper,
          hoverClassname,
          ...extraWrapperStyles,
        ].join(" ")}
        onClick={onClick}
      >
        <div
          // Prevent losing cursor position when an icon is clicked within an
          // input, like a password reveal toggle
          onMouseUp={(e) => e.preventDefault()}
          className={[
            withBorderClass,
            styles.IconWrapper,
            hoverClassname === styles.NoHover ? styles.NoHover : "",
            ...exactPlacementClasses,
          ].join(" ")}
        >
          <img
            src={src}
            title={title}
            alt={alt}
            className={[
              styles.Icon,
              styles.NoHighlighting,
              ...extraStyles,
            ].join(" ")}
            ref={ref}
          />
        </div>
        {text && <span className={styles.Text}>{text}</span>}
      </div>
    );
  }
);

export default Icon;
