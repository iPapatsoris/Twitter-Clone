import Icon from "../Icon/Icon";
import styles from "./Modal.module.scss";
import closeIcon from "../../../assets/icons/close.png";
import React, { useEffect } from "react";
import { toPixels } from "../../string";
import ModalWrapper from "../ModalWrapper/ModalWrapper";

interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ header, children, setIsActive }: ModalProps) => {
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

  const modal = (
    <div key={0} className={styles.Dummy}>
      <div className={styles.CloseIcon} onClick={() => setIsActive(false)}>
        <Icon src={closeIcon} />
      </div>
      <div className={styles.Header}>{header}</div>
      <div className={styles.Content}>{children}</div>
    </div>
  );

  return (
    <ModalWrapper
      outerStyles={[styles.Wrapper]}
      innerStyles={[styles.Modal]}
      setIsActive={setIsActive}
    >
      {[modal]}
    </ModalWrapper>
  );
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
