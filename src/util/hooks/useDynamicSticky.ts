import { RefObject, useEffect } from "react";

const useDynamicSticky = (ref: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const height = ref.current.offsetHeight;
    ref.current.style.top = (-1 * height + 825).toString() + "px";
  }, []);
};

export default useDynamicSticky;
