import styles from "./Modal.module.scss";
import React, { createContext, useEffect } from "react";
import { toPixels } from "../../string";
import ModalWrapper from "./ModalWrapper/ModalWrapper";

interface ModalProps {
  children: React.ReactNode;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  extraStyles?: string[];
  isSidePanel?: boolean;
}

export const ModalContext = createContext<{
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}>({ setIsActive: () => {} });

const Modal = ({
  children,
  setIsActive,
  extraStyles,
  isSidePanel,
}: ModalProps) => {
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
      <div className={styles.Content}>{children}</div>
    </div>
  );

  const modalStyles: string[] = [styles.Modal];
  if (extraStyles) {
    modalStyles.push(...extraStyles);
  }

  return (
    <ModalWrapper
      outerStyles={[styles.Wrapper, isSidePanel ? styles.SidePanel : ""]}
      innerStyles={modalStyles}
      setIsActive={setIsActive}
      isFixed
    >
      <ModalContext.Provider value={{ setIsActive: setIsActive }}>
        {[modal]}
      </ModalContext.Provider>
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
