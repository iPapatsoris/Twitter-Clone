import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPagePath, useRouteMatch } from "../paths";

// Scroll to top of screen on route change, while maintaining scroll position
// when going back in history
const useScrollToTop = () => {
  const { pathname } = useLocation();
  const isTweetPage = useRouteMatch(getPagePath("tweet"));
  useLayoutEffect(() => {
    if (!isTweetPage) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isTweetPage]);
};

export default useScrollToTop;
