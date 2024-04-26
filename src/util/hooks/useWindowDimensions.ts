import { useState, useEffect } from "react";
import breakpoints from "../../assets/styles/exports.module.scss";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const mobileWidth = parseInt(breakpoints.mobileBreakpoint);
  const tabletWidth = parseInt(breakpoints.tabletBreakpoint);
  const pcSmallWidth = parseInt(breakpoints.pcSmallBreakpoint);

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
