import { RefObject, useEffect } from "react";
import useWindowDimensions from "./useWindowDimensions";

// Set sticky element's position to stick at a certain distance
// before it reaches the bottom of the screen. Adjust on window and content
// resizing. Use ResizeObserver instead of directly accessing ref.current,
// because ref.current mutations do not notify useEffect.
const useDynamicSticky = (ref: RefObject<HTMLDivElement>) => {
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const handleElementResize = () => {
      if (!ref || !ref.current) {
        return;
      }
      const elementHeight = ref.current.offsetHeight;
      const whitespaceBottom = 100;
      ref.current.style.top =
        elementHeight <= windowHeight
          ? "0"
          : (
              -1 * elementHeight +
              (windowHeight - whitespaceBottom)
            ).toString() + "px";
    };
    const resizeObserver = new ResizeObserver(handleElementResize);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [ref, windowHeight]);
};

export default useDynamicSticky;
