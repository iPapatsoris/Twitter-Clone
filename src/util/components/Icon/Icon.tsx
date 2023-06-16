import React, { forwardRef } from "react";
import styles, { IconNames } from "./Icon.module.scss";

export interface IconProps {
  src: string;
  title?: string;
  alt?: string;
  hover?: "normal" | "primary" | "green" | "pink" | "none";
  forceHover?: boolean;
  withBorder?: boolean;
  extraStyles?: Array<string>;
  extraWrapperStyles?: Array<string>;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  exactLeftPlacement?: boolean;
  exactVerticalPlacement?: boolean;
}

export const getHoverClass = (
  hover: IconProps["hover"],
  styles: { [key in IconNames]: string }
) => {
  let hoverClassname = styles.Hover;
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
      forceHover,
      withBorder,
      extraStyles = [],
      extraWrapperStyles = [],
      onClick = () => {},
      exactLeftPlacement,
      exactVerticalPlacement,
    }: IconProps,
    ref: React.ForwardedRef<HTMLImageElement>
  ) => {
    if (exactLeftPlacement) {
      extraWrapperStyles.push(styles.ExactLeftPlacement);
    }
    if (exactVerticalPlacement) {
      extraWrapperStyles.push(styles.ExactVerticalPlacement);
    }

    const withBorderClass = withBorder ? styles.WithBorder : "";
    const forceHoverClass = forceHover ? styles.hover : "";
    const hoverClassname = getHoverClass(hover, styles);

    return (
      <div
        onClick={onClick}
        // Prevent losing cursor position when an icon is clicked within an
        // input, like a password reveal toggle
        onMouseUp={(e) => e.preventDefault()}
        className={[
          hoverClassname,
          withBorderClass,
          forceHoverClass,
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
