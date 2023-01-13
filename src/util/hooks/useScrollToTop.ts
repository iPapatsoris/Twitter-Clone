import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top of screen on route change, while maintaining scroll position
// when going back in history
const useScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
