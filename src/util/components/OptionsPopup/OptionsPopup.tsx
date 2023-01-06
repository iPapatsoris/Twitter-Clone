import React, { useRef } from "react";
import useClickOutsidePopup from "../../hooks/useClickOutsidePopup";
import Option, { OptionProps } from "./Option";
import styles from "./OptionsPopup.module.scss";

interface OptionsPopupProps {
  options: Array<OptionProps>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const OptionsPopup = ({ options, setIsActive }: OptionsPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  useClickOutsidePopup({ popupRef, setIsActive });

  const optionsJSX = options.map((option) => {
    return <Option key={option.mainOption.id} {...option} />;
  });

  return (
    <div ref={popupRef} className={styles.OptionsPopup}>
      {optionsJSX}
    </div>
  );
};

// Handler to be used by components to open the popup
export const activatePopupHandler = (params: {
  e: MouseEvent;
  isActivePopup: boolean;
  setIsActivePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setDisableOuterPointerEvents: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { e, isActivePopup, setIsActivePopup, setDisableOuterPointerEvents } =
    params;
  if (!isActivePopup) {
    setIsActivePopup(true);
    setDisableOuterPointerEvents(true);
  }
  // If we don't prevent propagation, useClickOutsidePopup will
  // receive this click event after registering a listener for it (bubbling),
  // and perceive it as a click outside the popup area, thus closing it
  // on the spot.
  e.stopPropagation();
};
export default OptionsPopup;
