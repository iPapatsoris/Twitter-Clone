import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalWrapper.module.scss";

/**
 * Transparent element that covers the whole screen to serve
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
  allowOuterEvents?: boolean;
  isFixed?: boolean;
}

const ModalWrapper = ({
  outerStyles = [],
  innerStyles = [],
  children,
  innerRef,
  setIsActive,
  allowOuterEvents = false,
  isFixed = false,
}: ModalWrapperProps) => {
  let mostRecentMousedown = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMousedownHandler = (e: MouseEvent) => {
      mostRecentMousedown.current = e.target as HTMLDivElement;
    };
    window.addEventListener("mousedown", onMousedownHandler);
    return () => window.removeEventListener("mousedown", onMousedownHandler);
  });

  const onOuterMouseup = (e: React.MouseEvent) => {
    if (mostRecentMousedown.current === e.target) {
      // Condition to prevent bug where mousedown inside modal and mouseup
      // outside would count as a click outside and close the modal
      setIsActive(false);
    }
    // Stop propagation to not potentially open the modal again due to event
    // bubbling
    e.stopPropagation();
  };

  const onInnerMouseup = (e: React.MouseEvent) => {
    // Stop propagation to not potentially close the modal due to event bubbling
    e.stopPropagation();
  };

  const innerWrapper = (
    <div
      ref={innerRef}
      className={innerStyles.join(" ")}
      onMouseUp={onInnerMouseup}
    >
      {children}
    </div>
  );

  const modalWrapper = allowOuterEvents ? (
    innerWrapper
  ) : (
    <div
      className={[
        styles.OuterWrapper,
        isFixed ? styles.Fixed : "",
        ...outerStyles,
      ].join(" ")}
      onMouseUp={onOuterMouseup}
    >
      {innerWrapper}
    </div>
  );

  return createPortal(modalWrapper, document.body);
};

export default ModalWrapper;
