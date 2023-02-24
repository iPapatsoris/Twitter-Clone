import React from "react";
import { createPortal } from "react-dom";
import styles from "./ModalWrapper.module.scss";

/**
 * Fixed positioned transparent element that covers the whole screen to serve
 * as a wrapper for modals and popups. Clicking anywhere outside the modal /
 * popup closes it. The wrapper covers elements below it, thus pointer events
 * outside the modal / popup are disabled automatically.
 */
interface ModalWrapperProps {
  outerStyles?: string[];
  innerStyles?: string[];
  children: React.ReactElement[];
  innerRef?: React.RefObject<HTMLDivElement>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalWrapper = ({
  outerStyles = [],
  innerStyles = [],
  children,
  innerRef,
  setIsActive,
}: ModalWrapperProps) => {
  const onOuterClick = (e: any) => {
    setIsActive(false);
    // Stop propagation to not potentially open the modal again due to event
    // bubbling
    e.stopPropagation();
  };

  const onInnerClick = (e: any) => {
    // Stop propagation to not potentially close the modal due to event bubbling
    e.stopPropagation();
  };

  const modalWrapper = (
    <div
      className={[styles.OuterWrapper, ...outerStyles].join(" ")}
      onClick={onOuterClick}
    >
      <div
        ref={innerRef}
        className={innerStyles.join(" ")}
        onClick={onInnerClick}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalWrapper, document.body);
};

export default ModalWrapper;
