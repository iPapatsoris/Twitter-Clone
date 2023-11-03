import { useEffect } from "react";

const useScrollNearBottom = ({
  scrollHandler: userScrollHandler,
}: {
  scrollHandler: VoidFunction;
}) => {
  useEffect(() => {
    const scrollHandler = () => {
      const scrollPercentage = getScrollPercentage();
      if (scrollPercentage >= 65) {
        userScrollHandler();
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [userScrollHandler]);
};

const getScrollPercentage = () => {
  const h = document.documentElement,
    b = document.body,
    st = "scrollTop",
    sh = "scrollHeight";
  return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
};

export default useScrollNearBottom;
