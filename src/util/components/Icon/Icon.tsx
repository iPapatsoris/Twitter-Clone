import React, { forwardRef } from "react";
import styles from "./Icon.module.scss";

export interface IconProps {
  src: string;
  title?: string;
  alt?: string;
  hover?: "normal" | "primary" | "none";
  withBorder?: boolean;
  extraStyles?: Array<string>;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
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
      onClick = () => {},
    }: IconProps,
    ref: React.ForwardedRef<HTMLImageElement>
  ) => {
    let hoverClassname: styles.IconNames = styles.Hover;
    if (hover === "primary") {
      hoverClassname = styles.HoverPrimary;
    } else if (hover === "none") {
      hoverClassname = styles.NoHover;
    }

    const withBorderClass = withBorder ? styles.WithBorder : "";

    return (
      <div
        onClick={onClick}
        // Prevent losing cursor position when an icon is clicked within an
        // input, like a password reveal toggle
        onMouseUp={(e) => e.preventDefault()}
        className={[hoverClassname, withBorderClass, styles.IconWrapper].join(
          " "
        )}
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
