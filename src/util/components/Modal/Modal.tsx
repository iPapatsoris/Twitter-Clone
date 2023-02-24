import Icon from "../Icon/Icon";
import styles from "./Modal.module.scss";
import closeIcon from "../../../assets/icons/close.png";
import React, { useEffect, useRef } from "react";
import { toPixels } from "../../string";
import { createPortal } from "react-dom";

interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
  // State controlled by outer components
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ header, children, setIsActive }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const onOuterClick = (e: any) => {
    setIsActive(false);
    // Stop propagation to not open the modal again due to event bubbling
    e.stopPropagation();
  };

  const onInnerClick = (e: any) => {
    // Stop propagation to not close the modal due to event bubbling
    e.stopPropagation();
  };

  const modal = (
    <div className={styles.Modal} onClick={(e) => onOuterClick(e)}>
      <div
        className={styles.Wrapper}
        ref={modalRef}
        onClick={(e) => onInnerClick(e)}
      >
        <div className={styles.CloseIcon} onClick={() => setIsActive(false)}>
          <Icon src={closeIcon} />
        </div>
        <div className={styles.Header}>{header}</div>
        <div className={styles.Content}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

// Handler to be used by components to open the modal
export const openModalHandler = (params: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setIsModalOpen } = params;
  // Disable scrolling the background
  document.body.style.overflow = "hidden";
  // Disabling scrolling removes the scroll bar, resulting in the content
  // moving horizontally. Adjust some padding to compensate
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  document.body.style.paddingRight = toPixels(scrollbarWidth);
  setIsModalOpen(true);
};

export default Modal;
