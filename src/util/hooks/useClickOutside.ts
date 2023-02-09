import { useEffect } from "react";

// Call callback on clicking outside of referenced div
// TODO: fix TS to allow generic type for ref element
const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof Node && ref && !ref.current?.contains(e.target)) {
        callback();
      }
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [ref, callback]);
};

export default useClickOutside;
