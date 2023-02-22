import Icon from "../Icon/Icon";
import styles, { ModalNames } from "./Modal.module.scss";
import closeIcon from "../../../assets/icons/close.png";
import React, { useContext, useEffect, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { PopupContext } from "../../../App";

interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

const Modal = ({ header, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isPopupOpenRef, setIsModalOpen } = useContext(PopupContext);
  useClickOutside({
    ref: modalRef,
    callback: () => {
      if (!isPopupOpenRef?.current) {
        setIsModalOpen(false);
      }
    },
  });

  useEffect(() => {
    // Disable scrolling the background. Doing so removes the scroll bar,
    // resulting in the content moving horizontally. Adjust some padding to
    // compensate.
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + "px";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "initial";
    };
  }, []);

  const wrapperStyles: ModalNames[] = [styles.Wrapper];
  if (isPopupOpenRef?.current) {
    wrapperStyles.push(styles.DisablePointerEvents);
  }
  return (
    <div className={styles.Modal}>
      <div className={wrapperStyles.join(" ")} ref={modalRef}>
        <div className={styles.CloseIcon} onClick={() => setIsModalOpen(false)}>
          <Icon src={closeIcon} />
        </div>
        <div className={styles.Header}>{header}</div>
        <div className={styles.Content}>{children}</div>
      </div>
    </div>
  );
};

// Handler to be used by components to open the modal
export const openModalHandler = (params: {
  e: MouseEvent;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { e, isModalOpen, setIsModalOpen } = params;
  if (!isModalOpen) {
    // Disable scrolling the background
    document.body.style.overflow = "hidden";
    // Disabling scrolling removes the scroll bar, resulting in the content
    // moving horizontally. Adjust some padding to compensate
    // TODO: calculate exactly the scrollbar width
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    console.log(scrollbarWidth);
    document.body.style.paddingRight = scrollbarWidth + "px";
    setIsModalOpen(true);
  }
  /* If we don't prevent propagation, useClickOutside will
     receive this click event after registering a listener for it (bubbling),
     and perceive it as a click outside the popup area, thus closing it
     on the spot.
  */
  e.stopPropagation();
};

export default Modal;
