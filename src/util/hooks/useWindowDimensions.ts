import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions(doListen: boolean) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  // Do not listen to resizing events if doListen is false.
  // Do not start listening if doListen becomes true.
  // Only listen if doListen is true from the beginning.
  useEffect(() => {
    if (doListen) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowDimensions;
}
