import React, { useContext, useRef, useState } from "react";
import { PopupContext } from "../../../App";
import { OptionProps } from "../OptionsPopup/Option";
import OptionsPopup, {
  activatePopupHandler,
} from "../OptionsPopup/OptionsPopup";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  name: string;
  options: Array<{
    value: string;
    text: string;
  }>;
}

const Dropdown = (props: DropdownProps) => {
  const { name } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e: any) => {
    activatePopupHandler({
      e,
      isActivePopup: isActive,
      setIsActivePopup: setIsActive,
      setDisableOuterPointerEvents,
    });
  };

  // const optionsJSX = props.options.map(({ value, text }) => (
  //   <option value={value}>{text}</option>
  // ));
  const options: OptionProps[] = props.options.map((option) => ({
    mainOption: {
      id: option.value,
      component: <span>{option.text}</span>,
    },
  }));
  // return <select name={name}>{optionsJSX}</select>;

  return (
    <>
      <div className={styles.Dropdown} ref={dropdownRef} onClick={handleClick}>
        {name}
      </div>
      {isActive && dropdownRef && (
        <OptionsPopup
          options={options}
          isActive
          setIsActive={setIsActive}
          targetAreaRef={dropdownRef}
        />
      )}
    </>
  );
};

export default Dropdown;
