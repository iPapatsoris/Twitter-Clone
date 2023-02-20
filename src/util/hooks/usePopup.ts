import React, { useContext, useEffect, useState } from "react";
import { PopupContext } from "../../App";
import { OptionsPopupProps } from "../components/OptionsPopup/OptionsPopup";
import useClickOutside from "./useClickOutside";
import useWindowDimensions from "./useWindowDimensions";

const usePopup = (
  params: Omit<OptionsPopupProps, "options" | "extraStyles"> & {
    popupRef: React.RefObject<HTMLDivElement>;
    disableByClickingAnywhere: boolean;
  }
) => {
  const {
    popupRef,
    targetAreaRef,
    position = "middle",
    isActive,
    setIsActive,
    autoMaxHeight = false,
    disableByClickingAnywhere = false,
  } = params;

  // Listen to window height updates to handle resizing
  const { height: windowHeight } = useWindowDimensions(autoMaxHeight);
  const { setIsPopupOpen, setDisableOuterPointerEvents } =
    useContext(PopupContext);
  // Used to fire effect of dynamic max-height calculation after
  // effect of popup placement has occured.
  const [justPlacedPopup, setJustPlacedPopup] = useState(false);

  // Place popup in relation to targetAreaRef according to position.
  // This is needed because we place with absolute positioning, to allow the
  // programmer to put it where they want in relation to another element,
  // without disrupting the content flow when it appears
  // (e.g. pushing other content down)
  useEffect(() => {
    if (
      isActive &&
      popupRef &&
      popupRef.current &&
      targetAreaRef &&
      targetAreaRef.current &&
      position !== "bottom"
    ) {
      const targetTop = targetAreaRef.current.offsetTop.toString() + "px";
      if (position === "middle") {
        popupRef.current.style.top = targetTop;
      } else if (position === "top") {
        popupRef.current.style.top =
          (
            targetAreaRef.current.offsetTop -
            popupRef.current.getBoundingClientRect().height
          ).toString() + "px";
      }
      setJustPlacedPopup(true);
    }
  }, [isActive, popupRef, targetAreaRef, position]);

  // Limit popup's max-height to the max available space just before it goes
  // off screen. Adjust on window resizing.
  useEffect(() => {
    if (
      autoMaxHeight &&
      justPlacedPopup &&
      isActive &&
      popupRef &&
      popupRef.current
    ) {
      console.log(windowHeight);
      console.log(popupRef.current.getBoundingClientRect().top);
      popupRef.current.style.maxHeight =
        (
          windowHeight - popupRef.current.getBoundingClientRect().top
        ).toString() + "px";

      // This state change is not required if we assume that components that use
      // the popup will render it conditionally. Because as soon as we close it,
      // all of its state will disappear anyway. It would be needed in the case
      // that we refactor so that components would render the popup
      // uncoditionally, and the popup would conditionally render itself
      // internally. In that case, state wouldn't reset automatically, since
      // the popup's lifetime would be consistent, so we would have to reset it
      // manually.
      // setJustPlacedPopup(false);
    }
  }, [justPlacedPopup, isActive, windowHeight, autoMaxHeight, popupRef]);

  // Detect clicking outside of popup area to disable it
  useClickOutside({
    ref: popupRef,
    callback: () => {
      setIsActive(false);
      setDisableOuterPointerEvents(false);
    },
    clickAnywhere: disableByClickingAnywhere,
  });

  // Notify global state that a popup is active. This is needed for managing
  // clicking outside to disable, when a popup is contained within a modal
  useEffect(() => {
    setIsPopupOpen(true);
    return () => setIsPopupOpen(false);
  }, [setIsPopupOpen]);
};

export default usePopup;
