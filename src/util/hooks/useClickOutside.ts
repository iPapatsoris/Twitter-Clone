import { useEffect } from "react";

/* Call callback on clicking outside of referenced div.
 * clickAnywhere flag  calls callback regardless of area.
 * TODO: fix TS to allow generic type for ref element
 */
const useClickOutside = (params: {
  ref: React.RefObject<HTMLDivElement>;
  callback: () => void;
  clickAnywhere?: boolean;
}) => {
  const { ref, callback, clickAnywhere = false } = params;
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        clickAnywhere ||
        (e.target instanceof Node && ref && !ref.current?.contains(e.target))
      ) {
        callback();
      }
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [ref, callback, clickAnywhere]);
};

export default useClickOutside;
