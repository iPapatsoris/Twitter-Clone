import React, { useEffect, useRef } from "react";
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
  children: React.ReactElement | React.ReactElement[];
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
  let mostRecentMousedown = useRef<Element | null>(null);

  useEffect(() => {
    const onMousedownHandler = (e: any) => {
      mostRecentMousedown.current = e.target;
    };
    window.addEventListener("mousedown", onMousedownHandler);
    return () => window.removeEventListener("mousedown", onMousedownHandler);
  });

  const onOuterMouseup = (e: any) => {
    if (mostRecentMousedown.current === e.target) {
      // Condition to prevent bug where mousedown inside modal and mouseup
      // outside would count as a click outside and close the modal
      setIsActive(false);
    }
    // Stop propagation to not potentially open the modal again due to event
    // bubbling
    e.stopPropagation();
  };

  const onInnerMouseup = (e: any) => {
    // Stop propagation to not potentially close the modal due to event bubbling
    e.stopPropagation();
  };

  // const onClick = (e: any) => {
  //   setIsActive(false);
  //   e.stopPropagation();
  // };

  const modalWrapper = (
    <div
      className={[styles.OuterWrapper, ...outerStyles].join(" ")}
      onMouseUp={onOuterMouseup}
      // onClick={onClick}
    >
      <div
        ref={innerRef}
        className={innerStyles.join(" ")}
        onMouseUp={onInnerMouseup}
        // onClick={onClick}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalWrapper, document.body);
};

export default ModalWrapper;
