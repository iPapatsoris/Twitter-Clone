import React, { forwardRef } from "react";
import styles from "./Icon.module.scss";

export interface IconProps {
  src: string;
  title?: string;
  alt?: string;
  hover?: "normal" | "primary" | "none";
  withBorder?: boolean;
  extraStyles?: Array<string>;
  extraWrapperStyles?: Array<string>;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  exactLeftPlacement?: boolean;
  exactVerticalPlacement?: boolean;
}

const Icon = forwardRef(
  (
    {
      src,
      title = "",
      alt = "",
      hover = "normal",
      withBorder = false,
      extraStyles = [],
      extraWrapperStyles = [],
      onClick = () => {},
      exactLeftPlacement,
      exactVerticalPlacement,
    }: IconProps,
    ref: React.ForwardedRef<HTMLImageElement>
  ) => {
    let hoverClassname: styles.IconNames = styles.Hover;
    if (hover === "primary") {
      hoverClassname = styles.HoverPrimary;
    } else if (hover === "none") {
      hoverClassname = styles.NoHover;
    }

    if (exactLeftPlacement) {
      extraWrapperStyles.push(styles.ExactLeftPlacement);
    }
    if (exactVerticalPlacement) {
      extraWrapperStyles.push(styles.ExactVerticalPlacement);
    }

    const withBorderClass = withBorder ? styles.WithBorder : "";

    return (
      <div
        onClick={onClick}
        // Prevent losing cursor position when an icon is clicked within an
        // input, like a password reveal toggle
        onMouseUp={(e) => e.preventDefault()}
        className={[
          hoverClassname,
          withBorderClass,
          styles.IconWrapper,
          ...extraWrapperStyles,
        ].join(" ")}
      >
        <img
          src={src}
          title={title}
          alt={alt}
          className={[
            styles.Icon,
            styles.NoHighlighting,
            hoverClassname,
            ...extraStyles,
          ].join(" ")}
          ref={ref}
        />
      </div>
    );
  }
);

export default Icon;
