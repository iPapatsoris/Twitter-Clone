import React, { useRef, useState } from "react";
import usePopup, { PopupPosition } from "../../hooks/usePopup";
import Option, { OptionProps, OptionType } from "./Option";
import styles from "./OptionsPopup.module.scss";

// TODO: document usage
interface OptionsPopupProps {
  options: Array<OptionProps>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  targetAreaRef: React.RefObject<HTMLDivElement>;
  position?: PopupPosition;
  autoMaxHeight?: boolean;
  extraStyles?: Array<string>;
}

const OptionsPopup = ({
  options: optionProps,
  isActive,
  setIsActive,
  targetAreaRef,
  position = "middle",
  autoMaxHeight = false,
  extraStyles = [],
}: OptionsPopupProps) => {
  const initialOptions = optionProps.map((option) => ({
    ...option,
    targetAreaRef,
    showNestedOptions: false,
  }));
  const [options, setOptions] = useState<Array<OptionType>>(initialOptions);
  const popupRef = useRef<HTMLDivElement>(null);

  usePopup({
    popupRef,
    targetAreaRef,
    position,
    isActive,
    setIsActive,
    autoMaxHeight,
  });

  // Toggle nested options visibility for clicked option
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
    <div
      id="popup"
      ref={popupRef}
      className={[styles.OptionsPopup, ...extraStyles].join(" ")}
    >
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
