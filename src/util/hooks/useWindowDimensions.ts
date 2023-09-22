import { useState, useEffect } from "react";
import { getGlobalCssVar } from "./useMapPropToCssVar";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const mobileWidth = getGlobalCssVar("--mobile-width");
  const tabletWidth = getGlobalCssVar("--tablet-width");
  const pcSmallWidth = getGlobalCssVar("--pc-small-width");

  const isMobile = width <= mobileWidth;
  const isTablet = width > mobileWidth && width <= tabletWidth;
  const isPcSmall = width > tabletWidth && width <= pcSmallWidth;
  const isPcBig = width > pcSmallWidth;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isPcSmall,
    isPcBig,
    isSmallScreen: isMobile || isTablet,
  };
};

// Retrieve window size
const useWindowDimensions = (doListen: boolean = true) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };
    if (doListen) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [doListen]);

  return windowDimensions;
};

export default useWindowDimensions;
