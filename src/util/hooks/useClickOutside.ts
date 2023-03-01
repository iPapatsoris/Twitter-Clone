import { useEffect } from "react";

/* Call callback on clicking outside of referenced div
 * TODO: fix TS to allow generic type for ref element
 */
const useClickOutside = (params: {
  ref: React.RefObject<HTMLDivElement>;
  callback: () => void;
  onMouseDown?: boolean;
}) => {
  const { ref, callback, onMouseDown = false } = params;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof Node && ref && !ref.current?.contains(e.target)) {
        callback();
      }
    };

    window.addEventListener(onMouseDown ? "mousedown" : "click", handleClick);
    return () => {
      window.removeEventListener(
        onMouseDown ? "mousedown" : "click",
        handleClick
      );
    };
  }, [ref, callback, onMouseDown]);
};

export default useClickOutside;
