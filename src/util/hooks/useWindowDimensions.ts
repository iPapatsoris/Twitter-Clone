import { useState, useEffect } from "react";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const style = getComputedStyle(document.body);
  const mobileWidth = parseInt(style.getPropertyValue("--mobile-width"));
  const tabletWidth = parseInt(style.getPropertyValue("--tablet-width"));
  const pcSmallWidth = parseInt(style.getPropertyValue("--pc-small-width"));

  const isMobile = width <= mobileWidth;
  const isTablet = width > mobileWidth && width <= tabletWidth;
  const isPcSmall = width > tabletWidth && width <= pcSmallWidth;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isPcSmall,
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
