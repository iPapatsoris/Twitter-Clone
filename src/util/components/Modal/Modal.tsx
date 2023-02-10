import Icon from "../Icon/Icon";
import styles from "./Modal.module.scss";
import closeIcon from "../../../assets/icons/close.png";
import React, { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";

interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ header, children, setShowModal }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside({ ref: modalRef, callback: () => setShowModal(false) });

  return (
    <div className={styles.Center}>
      <div className={styles.Modal} ref={modalRef}>
        <div className={styles.CloseIcon}>
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
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { e, isOpenModal, setIsOpenModal } = params;
  if (!isOpenModal) {
    setIsOpenModal(true);
  }
  /* If we don't prevent propagation, useClickOutside will
     receive this click event after registering a listener for it (bubbling),
     and perceive it as a click outside the popup area, thus closing it
     on the spot.
  */
  e.stopPropagation();
};

export default Modal;
