import React, { useRef } from "react";
import usePopup from "../../hooks/usePopup";
import ModalWrapper from "../Modal/ModalWrapper/ModalWrapper";
import styles from "./Popup.module.scss";

export interface PopupProps {
  // State controlled by outer components
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  // Where to place popup
  targetAreaRef: React.RefObject<HTMLDivElement>;
  // Fine tuning of position
  position?: {
    block: "top" | "topCover" | "bottom" | "bottomCover";
    inline: "left" | "leftCover" | "right" | "rightCover";
  };
  // If true, max-height property is set dynamically so that a scroll bar is
  // introduced if popup exceeds beyond the viewport. Useful when popup is
  // positioned under a sticky or fixed context.
  autoMaxHeight?: boolean;
  // Allow custom styling
  extraPopupStyles?: string[];
  children: React.ReactElement[] | React.ReactElement;
  allowOuterEvents?: boolean;
}

const Popup = ({
  setIsActive,
  targetAreaRef,
  position = {
    block: "bottomCover",
    inline: "leftCover",
  },
  autoMaxHeight = false,
  extraPopupStyles = [],
  children,
  allowOuterEvents = false,
}: PopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  usePopup({
    popupRef,
    targetAreaRef,
    position,
    autoMaxHeight,
  });

  return (
    <ModalWrapper
      innerRef={popupRef}
      innerStyles={[styles.Popup, ...extraPopupStyles]}
      setIsActive={setIsActive}
      allowOuterEvents={allowOuterEvents}
    >
      {children}
    </ModalWrapper>
  );
};

export default Popup;
