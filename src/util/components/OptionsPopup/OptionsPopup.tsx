import React, { useRef, useState } from "react";
import useClickOutsidePopup from "../../hooks/useClickOutsidePopup";
import Option, { OptionProps, OptionType } from "./Option";
import styles from "./OptionsPopup.module.scss";

interface OptionsPopupProps {
  options: Array<OptionProps>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const OptionsPopup = ({
  options: optionProps,
  setIsActive,
}: OptionsPopupProps) => {
  const initialOptions = optionProps.map((option) => ({
    ...option,
    showNestedOptions: false,
  }));
  const [options, setOptions] = useState<Array<OptionType>>(initialOptions);
  const popupRef = useRef<HTMLDivElement>(null);
  useClickOutsidePopup({ popupRef, setIsActive });

  const handleOptionClick = (id: string) => {
    const index = options.findIndex((option) => option.mainOption.id === id);
    const option = options[index];
    if (option.nestedOptions) {
      const newOptions = [...options];
      newOptions[index].showNestedOptions =
        !newOptions[index].showNestedOptions;
      setOptions(newOptions);
    }
  };

  const optionsJSX = options.map((option) => {
    let nestedOptionsJSX: Array<React.ReactElement> = [];
    if (option.nestedOptions && option.showNestedOptions) {
      nestedOptionsJSX = option.nestedOptions?.map((nested) => (
        <Option
          mainOption={{ component: nested.component, id: nested.id }}
          key={nested.id}
        />
      ));
    }

    return [
      <Option
        {...option}
        key={option.mainOption.id}
        onClick={() => handleOptionClick(option.mainOption.id)}
      />,
      ...nestedOptionsJSX,
    ];
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
