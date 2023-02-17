import Icon from "../Icon/Icon";
import styles from "./Modal.module.scss";
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
  const { setIsModalOpen } = useContext(PopupContext);
  useClickOutside({
    ref: modalRef,
    callback: () => setIsModalOpen(false),
  });

  useEffect(() => {
    setIsModalOpen(true);
    return () => setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <div className={styles.Center}>
      <div className={styles.Modal} ref={modalRef}>
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
