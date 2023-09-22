import React, { ComponentProps, HTMLProps, forwardRef, useRef } from "react";
import styles from "./Icon.module.scss";
import useMapPropToCssVar from "../../hooks/useMapPropToCssVar";

/* Icon with a background around it that appears on hover. The background area
   is absolutely positioned to not interfere with content flow. By default, 
   margins are included on the icon to take into account the extra area that
   appears on hover, to ensure that the area will not clash with other elements
   on hover. However, for aligning purposes with other elements, it is not 
   always desirable to have these margins, so there are also props to opt out of 
   them.

   TODO: Decouple hover effect code from Icon, refactor into seperate 
         component to allow reusing hover logic with any component.
         Most of the code in this file and in the scss one deals with the hover
         effect. 
*/
export interface IconProps {
  // SVG element
  src?: React.ComponentType<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  // Source for image in any format
  nonSvgSrc?: string;
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
  textStyles?: string[];
  // Icon size in px
  size?: number;
  fullSize?: boolean;
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
      nonSvgSrc,
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
      textStyles,
      size,
      fullSize,
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

    useMapPropToCssVar({
      prop: size,
      cssVar: "--icon-size",
      ref: iconAndTextRef,
    });
    useMapPropToCssVar({
      prop: hoverGap,
      cssVar: "--icon-hover-gap",
      ref: iconAndTextRef,
    });

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

    const imageProps: HTMLProps<HTMLImageElement> = {
      title: title,
      width: fullSize ? "100%" : size,
      height: fullSize ? "100%" : size,
      className: [
        styles.Icon,
        styles.NoHighlighting,
        noCursorPointer ? styles.NoCursorPointer : "",
        withBackground ? styles.Elevate : "",
        ...extraStyles,
      ].join(" "),
    };

    const textClasses: string[] = [styles.Text];
    if (textStyles) {
      textClasses.push(...textStyles);
    }

    if (!Element && !nonSvgSrc) {
      throw new Error('Icon "src" or "nonSvgSrc" props must be provided');
    }

    return (
      <div
        className={[
          styles.IconAndTextWrapper,
          !withBackground ? hoverClassname : "",
          forceHover ? styles.ForceHover : "",
          ...marginClasses,
          fullSize ? styles.FullSize : "",
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
          {!Element ? (
            <img src={nonSvgSrc} alt={alt} {...imageProps} />
          ) : (
            <Element
              aria-labelledby={alt}
              {...(imageProps as ComponentProps<typeof Element>)}
            />
          )}
        </div>
        {text && (
          <span ref={textRef} className={textClasses.join(" ")}>
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
