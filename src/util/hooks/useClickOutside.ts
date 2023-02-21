import { useEffect, useState } from "react";

/* Call callback on clicking outside of referenced div.
 * clickAnywhere flag  calls callback regardless of area.
 * TODO: fix TS to allow generic type for ref element
 */
const useClickOutside = (params: {
  ref: React.RefObject<HTMLDivElement>;
  callback: () => void;
  clickAnywhere?: boolean;
  ignoreFirstClick?: boolean;
  onMouseDown?: boolean;
}) => {
  const {
    ref,
    callback,
    clickAnywhere = false,
    ignoreFirstClick = false,
    onMouseDown = false,
  } = params;

  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ignoreFirstClick && isFirstClick) {
        setIsFirstClick(false);
        return;
      }

      if (
        clickAnywhere ||
        (e.target instanceof Node && ref && !ref.current?.contains(e.target))
      ) {
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
  }, [
    ref,
    callback,
    clickAnywhere,
    ignoreFirstClick,
    setIsFirstClick,
    isFirstClick,
    onMouseDown,
  ]);
};

export default useClickOutside;
