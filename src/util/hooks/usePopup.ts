import React, { useEffect, useLayoutEffect, useState } from "react";
import { PopupProps } from "../components/Popup/Popup";
import { toPixels } from "../string";
import useWindowDimensions from "./useWindowDimensions";

const usePopup = (
  params: Pick<
    PopupProps,
    | "targetAreaRef"
    | "position"
    | "autoMaxHeight"
    | "disableOnHoverOut"
    | "setIsActive"
  > & {
    popupRef: React.RefObject<HTMLDivElement>;
  }
) => {
  const {
    popupRef,
    targetAreaRef,
    position,
    autoMaxHeight = false,
    disableOnHoverOut,
    setIsActive,
  } = params;

  // Listen to window height updates to handle resizing
  const { height: windowHeight } = useWindowDimensions(autoMaxHeight);
  // Used to fire effect of dynamic max-height calculation after
  // effect of popup placement has occured.
  const [justPlacedPopup, setJustPlacedPopup] = useState(false);

  // Place popup in relation to targetAreaRef according to position.
  useLayoutEffect(() => {
    if (
      popupRef &&
      popupRef.current &&
      targetAreaRef &&
      targetAreaRef.current
    ) {
      const {
        top: targetTop,
        left: targetLeft,
        height: targetHeight,
        width: targetWidth,
      } = targetAreaRef.current.getBoundingClientRect();
      const { height: popupHeight, width: popupWidth } =
        popupRef.current.getBoundingClientRect();

      // Vertical placement
      if (position?.block === "bottomCover") {
        popupRef.current.style.top = toPixels(targetTop);
      } else if (position?.block === "bottom") {
        popupRef.current.style.top = toPixels(targetTop + targetHeight);
      } else if (position?.block === "topCover") {
        popupRef.current.style.top = toPixels(
          targetTop - popupHeight + targetHeight
        );
      } else if (position?.block === "top") {
        popupRef.current.style.top = toPixels(targetTop - popupHeight);
      }

      // Horizontal placement
      if (position?.inline === "leftCover") {
        popupRef.current.style.left = toPixels(targetLeft);
      } else if (position?.inline === "right") {
        popupRef.current.style.left = toPixels(targetLeft + targetWidth);
      } else if (position?.inline === "rightCover") {
        popupRef.current.style.left = toPixels(
          targetLeft - popupWidth + targetWidth
        );
      } else if (position?.inline === "left") {
        popupRef.current.style.left = toPixels(targetLeft - popupWidth);
      }
      setJustPlacedPopup(true);
    }
  }, [popupRef, targetAreaRef, position]);

  // Limit popup's max-height to the max available space just before it goes
  // off screen. Adjust on window resizing.
  useLayoutEffect(() => {
    if (autoMaxHeight && justPlacedPopup && popupRef && popupRef.current) {
      popupRef.current.style.maxHeight = toPixels(
        windowHeight - popupRef.current.getBoundingClientRect().top
      );
    }
  }, [justPlacedPopup, windowHeight, autoMaxHeight, popupRef]);

  useEffect(() => {
    const popupRefCurrent = popupRef.current;
    const targetAreaRefCurrent = targetAreaRef.current;

    const onMouseLeavePopupHandler = (e: any) => {
      if (!targetAreaRefCurrent?.contains(e.relatedTarget)) {
        setIsActive(false);
      }
    };

    const onMouseLeaveTargetAreaHandler = (e: any) => {
      if (!popupRefCurrent?.contains(e.relatedTarget)) {
        setIsActive(false);
      }
    };

    if (disableOnHoverOut && targetAreaRefCurrent && popupRefCurrent) {
      popupRefCurrent.addEventListener("mouseleave", onMouseLeavePopupHandler);
      targetAreaRef.current.addEventListener(
        "mouseleave",
        onMouseLeaveTargetAreaHandler
      );
    }

    return () => {
      if (disableOnHoverOut && targetAreaRefCurrent && popupRefCurrent) {
        popupRefCurrent.removeEventListener(
          "mouseleave",
          onMouseLeavePopupHandler
        );
        targetAreaRefCurrent.removeEventListener(
          "mouseleave",
          onMouseLeaveTargetAreaHandler
        );
      }
    };
  }, [targetAreaRef, disableOnHoverOut, popupRef, setIsActive]);
};

export default usePopup;
