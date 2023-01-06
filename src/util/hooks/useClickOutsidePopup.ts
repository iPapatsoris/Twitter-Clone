import React, { useContext, useEffect } from "react";
import { PopupContext } from "../../App";

// Detect clicking outside of popup area to disable it
const useClickOutsidePopup = (popup: {
  popupRef: React.RefObject<HTMLDivElement>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { popupRef, setIsActive } = popup;
  const { setDisableOuterPointerEvents } = useContext(PopupContext);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof Node &&
        popupRef &&
        !popupRef.current?.contains(e.target)
      ) {
        setIsActive(false);
        setDisableOuterPointerEvents(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => removeEventListener("click", handleClick);
  }, []);
};

export default useClickOutsidePopup;
