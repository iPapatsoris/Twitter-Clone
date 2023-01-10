import React, { useContext, useEffect } from "react";
import { PopupContext } from "../../App";
import useWindowDimensions from "./useWindowDimensions";

export type PopupPosition = "middle" | "top";

const usePopup = (params: {
  popupRef: React.RefObject<HTMLDivElement>;
  targetAreaRef: React.RefObject<HTMLDivElement>;
  position?: PopupPosition;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  autoMaxHeight?: boolean;
}) => {
  const {
    popupRef,
    targetAreaRef,
    position = "middle",
    isActive,
    setIsActive,
    autoMaxHeight = false,
  } = params;
  console.log("usePopup");

  const { height: windowHeight } = useWindowDimensions(autoMaxHeight);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);

  // Place popup in relation to targetAreaRef according to position
  useEffect(() => {
    console.log("useEffect to place popup B4 condition");
    if (
      isActive &&
      popupRef &&
      popupRef.current &&
      targetAreaRef &&
      targetAreaRef.current
    ) {
      console.log("useEffect to place popup INSIDE condition");
      const targetTop = targetAreaRef.current.offsetTop.toString() + "px";
      if (position === "middle") {
        popupRef.current.style.top = targetTop;
      } else if (position === "top") {
        // popupRef.current.style.bottom = targetTop;
        popupRef.current.style.top =
          (
            targetAreaRef.current.offsetTop -
            popupRef.current.getBoundingClientRect().height
          ).toString() + "px";
      }
    }
  }, [isActive]);

  // Limit popup's max-height to the max available space just before it goes
  // off screen. Adjust on window resizing.
  useEffect(() => {
    console.log("useEffect for max-height TEST condition");
    if (autoMaxHeight && isActive && popupRef && popupRef.current) {
      console.log("useEffect for max-height AFTER condition");
      console.log(windowHeight);
      console.log(popupRef.current.getBoundingClientRect().top);
      popupRef.current.style.maxHeight =
        (
          windowHeight - popupRef.current.getBoundingClientRect().top
        ).toString() + "px";
    }
  }, [isActive, windowHeight]);

  // Detect clicking outside of popup area to disable it
  useEffect(() => {
    console.log("useEffect for clicking outside");
    const handleClick = (e: MouseEvent) => {
      console.log("event handler for clicking outside TEST condition");
      if (
        e.target instanceof Node &&
        popupRef &&
        !popupRef.current?.contains(e.target)
      ) {
        console.log("event handler for clicking outside AFTER condition");
        setIsActive(false);
        setDisableOuterPointerEvents(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => removeEventListener("click", handleClick);
  }, []);
};

export default usePopup;
