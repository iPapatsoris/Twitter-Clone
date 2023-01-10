import { RefObject, useEffect } from "react";
import useWindowDimensions from "./useWindowDimensions";

// Set sticky element's position to stick at a certain distance
// before it reaches the bottom of the screen. Adjust on window resizing.
const useDynamicSticky = (ref: RefObject<HTMLDivElement>) => {
  const { height: windowHeight } = useWindowDimensions(true);

  useEffect(() => {
    console.log("useDynamicSticy Effect");
    if (!ref || !ref.current) {
      return;
    }

    const elementHeight = ref.current.offsetHeight;
    const whitespaceBottom = 100;
    ref.current.style.top =
      (-1 * elementHeight + (windowHeight - whitespaceBottom)).toString() +
      "px";
  }, [ref, windowHeight]);
};

export default useDynamicSticky;
