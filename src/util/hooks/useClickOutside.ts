import { useEffect } from "react";

/* Call callback on clicking outside of referenced div
 * TODO: fix TS to allow generic type for ref element
 */
const useClickOutside = (params: {
  ref: React.RefObject<HTMLDivElement>;
  callback: () => void;
  onMouseDown?: boolean;
  /*
    Flag that controls whether to add the event listener or not. Useful in 
    scenarios when we call useClickOutside in a component, but do not want to 
    start listening to clicks, until a certain condition is met.
  */
  enabled?: boolean;
}) => {
  const { ref, callback, onMouseDown = false, enabled = true } = params;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof Node && ref && !ref.current?.contains(e.target)) {
        callback();
      }
    };

    if (enabled) {
      window.addEventListener(onMouseDown ? "mousedown" : "click", handleClick);
    }
    return () => {
      if (enabled) {
        window.removeEventListener(
          onMouseDown ? "mousedown" : "click",
          handleClick
        );
      }
    };
  }, [ref, callback, onMouseDown, enabled]);
};

export default useClickOutside;
