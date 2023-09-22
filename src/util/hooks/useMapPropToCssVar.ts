import { RefObject, useLayoutEffect } from "react";
import { toPixels } from "../string";

// Set a css var from a prop. Do not paint until it's done
const useMapPropToCssVar = (params: {
  prop?: number;
  cssVar: string;
  ref: React.RefObject<HTMLElement>;
}) => {
  const { prop, cssVar, ref } = params;

  useLayoutEffect(() => {
    if (prop && ref && ref.current) {
      if (prop) {
        ref.current.style.setProperty(cssVar, toPixels(prop));
      }
    }
  }, [prop, ref, cssVar]);
};

const getCssVar = (cssVar: string, ref?: React.RefObject<HTMLElement>) => {
  const style = getComputedStyle(
    ref && ref.current ? ref.current : document.body
  );
  return parseInt(style.getPropertyValue(cssVar));
};

export const getGlobalCssVar = (cssVar: string) => getCssVar(cssVar);

export const getLocalCssVar = (params: {
  ref?: RefObject<HTMLElement>;
  cssVar: string;
}) => getCssVar(params.cssVar, params.ref);

export default useMapPropToCssVar;
