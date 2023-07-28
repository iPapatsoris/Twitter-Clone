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
    | "isFixed"
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
    isFixed,
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
      let {
        top: targetTop,
        left: targetLeft,
        height: targetHeight,
        width: targetWidth,
      } = targetAreaRef.current.getBoundingClientRect();
      const { height: popupHeight, width: popupWidth } =
        popupRef.current.getBoundingClientRect();

      targetTop += isFixed ? 0 : window.scrollY;

      // Vertical placement
      let finalTop = 0;
      if (position?.block === "bottomCover" || position?.block === "bottom") {
        finalTop =
          position?.block === "bottomCover"
            ? targetTop
            : targetTop + targetHeight;

        if (
          !autoMaxHeight &&
          finalTop + popupHeight >= window.innerHeight + window.scrollY
        ) {
          // If placing popup below target element would put it outside of
          // view, place it above instead
          position.block = "top";
        }
      }
      if (position?.block === "topCover") {
        finalTop = targetTop - popupHeight + targetHeight;
      } else if (position?.block === "top") {
        finalTop = targetTop - popupHeight;
      }
      popupRef.current.style.top = toPixels(finalTop);

      // Horizontal placement
      let finalLeft = 0;
      if (position?.inline === "leftCover") {
        finalLeft = targetLeft;
      } else if (position?.inline === "right") {
        finalLeft = targetLeft + targetWidth;
      } else if (position?.inline === "rightCover") {
        finalLeft = targetLeft - popupWidth + targetWidth;
      } else if (position?.inline === "left") {
        finalLeft = targetLeft - popupWidth;
      }

      popupRef.current.style.left = toPixels(finalLeft);
      setJustPlacedPopup(true);
    }
  }, [popupRef, targetAreaRef, position, autoMaxHeight, isFixed]);

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

    const onMouseLeavePopupHandler = (e: MouseEvent) => {
      if (!targetAreaRefCurrent?.contains(e.relatedTarget as Node)) {
        setIsActive(false);
      }
    };

    const onMouseLeaveTargetAreaHandler = (e: MouseEvent) => {
      if (!popupRefCurrent?.contains(e.relatedTarget as Node)) {
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
