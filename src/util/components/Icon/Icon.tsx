import React, { forwardRef, useLayoutEffect, useRef } from "react";
import styles from "./Icon.module.scss";
import { toPixels } from "../../string";

export interface IconProps {
  src: React.ComponentType<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  title?: string;
  alt?: string;
  // Color of surrounding circle on hover
  hover?: "normal" | "primary" | "green" | "pink" | "none";
  withBorder?: boolean;
  // Extra css classes for the icon. Do not use this to set icon size, use
  // 'size' prop instead
  extraStyles?: Array<string>;
  // Extra css classes for the container of the icon
  extraWrapperStyles?: Array<string>;
  onClick?: React.MouseEventHandler<HTMLImageElement>;

  // These props control whether icon should have margins to take into account
  // the surrounding circle that appears on hover
  noLeftMargin?: boolean;
  noRightMargin?: boolean;
  noInlineMargin?: boolean;
  noBottomMargin?: boolean;
  noTopMargin?: boolean;
  noBlockMargin?: boolean;

  // Text right after the icon. Hover on text is like hovering on icon
  text?: string;
  // Icon size in px
  size?: number;
  // Gap between icon and surrounding hover circle
  hoverGap?: number;
  // Hover circle covers both icon and text
  hoverThroughBothIconAndText?: boolean;
  // Externally controlled hover
  forceHover?: boolean;
  noCursorPointer?: boolean;
  // Icon has a blue circle background
  withBackground?: boolean;
}

const Icon = forwardRef(
  (
    {
      src: Element,
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
      hoverGap,
      hoverThroughBothIconAndText,
      forceHover,
      noCursorPointer,
      withBackground,
    }: IconProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const iconAndTextRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    // Map size prop to css var
    useLayoutEffect(() => {
      if (size && iconAndTextRef && iconAndTextRef.current) {
        if (size) {
          iconAndTextRef.current.style.setProperty(
            "--icon-size",
            toPixels(size)
          );
        }
      }
    }, [size]);

    // Map hoverGap prop to css var
    useLayoutEffect(() => {
      if (hoverGap && iconAndTextRef && iconAndTextRef.current) {
        if (hoverGap) {
          iconAndTextRef.current.style.setProperty(
            "--icon-hover-gap",
            toPixels(hoverGap)
          );
        }
      }
    }, [hoverGap]);

    const withBorderClass = withBorder ? styles.WithBorder : "";
    const hoverClassname = getHoverClass(hover);
    const marginClasses = getMarginClasses({
      noLeftMargin,
      noRightMargin,
      noInlineMargin,
      noTopMargin,
      noBottomMargin,
      noBlockMargin,
    });

    return (
      <div
        className={[
          styles.IconAndTextWrapper,
          !withBackground ? hoverClassname : "",
          forceHover ? styles.ForceHover : "",
          ...marginClasses,
          ...extraWrapperStyles,
        ].join(" ")}
        onClick={onClick}
        ref={iconAndTextRef}
        title={title}
      >
        <div
          // Prevent losing cursor position when an icon is clicked within an
          // input, like a password reveal toggle
          onMouseUp={(e) => e.preventDefault()}
          className={[
            withBorderClass,
            withBackground ? styles.WithBackground : "",
            styles.IconWrapper,
            hoverClassname === styles.NoHover ? styles.NoHover : "",
            hoverThroughBothIconAndText
              ? styles.HoverThroughBothIconAndText
              : "",
          ].join(" ")}
        />
        {/* TODO: why we can't put ref directly in Element? spawns forwardRef console error */}
        <div ref={ref} className={styles.RefWrapper}>
          <Element
            aria-labelledby={alt}
            width={size}
            height={size}
            title={title}
            className={[
              styles.Icon,
              styles.NoHighlighting,
              noCursorPointer ? styles.NoCursorPointer : "",
              ...extraStyles,
            ].join(" ")}
          ></Element>
        </div>
        {text && (
          <span ref={textRef} className={styles.Text}>
            {text}
          </span>
        )}
      </div>
    );
  }
);

const getMarginClasses = ({
  noLeftMargin,
  noRightMargin,
  noInlineMargin,
  noTopMargin,
  noBottomMargin,
  noBlockMargin,
}: Pick<
  IconProps,
  | "noLeftMargin"
  | "noRightMargin"
  | "noInlineMargin"
  | "noBottomMargin"
  | "noTopMargin"
  | "noBlockMargin"
>) => {
  const marginClasses = [];
  if (noInlineMargin) {
    marginClasses.push(styles.NoLeftMargin, styles.NoRightMargin);
  } else {
    if (noLeftMargin) {
      marginClasses.push(styles.NoLeftMargin);
    }
    if (noRightMargin) {
      marginClasses.push(styles.NoRightMargin);
    }
  }
  if (noBlockMargin) {
    marginClasses.push(styles.NoTopMargin, styles.NoBottomMargin);
  } else {
    if (noTopMargin) {
      marginClasses.push(styles.NoTopMargin);
    }
    if (noBottomMargin) {
      marginClasses.push(styles.NoBottomMargin);
    }
  }

  return marginClasses;
};

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

export default Icon;
