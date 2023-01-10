import { RefObject, useEffect } from "react";

const useDynamicSticky = (ref: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const elementHeight = ref.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const whitespaceBottom = 100;
    ref.current.style.top =
      (-1 * elementHeight + (windowHeight - whitespaceBottom)).toString() +
      "px";
  }, [ref]);
};

export default useDynamicSticky;
