import React, { useRef, useState } from "react";
import usePopup from "../../hooks/usePopup";
import Option, { OptionWithNested } from "./Option";
import styles from "./OptionsPopup.module.scss";

export interface OptionsPopupProps {
  // Options for the popup. Nested options are supported that expand it
  options: OptionWithNested[];
  // State controlled by outer components
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  // Where to place popup
  targetAreaRef: React.RefObject<HTMLDivElement>;
  // Fine tuning of position (above, below, etc)
  position?: "middle" | "top" | "bottom";
  // If true, max-height property is set dynamically so that a scroll bar is
  // introduced if popup exceeds beyond the viewport. Useful when popup is
  // positioned under a sticky or fixed context.
  autoMaxHeight?: boolean;
  // Allow custom styling
  extraPopupStyles?: string[];
  extraOptionStyles?: string[];
  // Disables the popup by clicking anywhere.
  // By default, cliking inside the popup will not disable it.
  disableByClickingAnywhere?: boolean;
}

const OptionsPopup = ({
  options: optionProps,
  isActive,
  setIsActive,
  targetAreaRef,
  position = "middle",
  autoMaxHeight = false,
  extraPopupStyles = [],
  extraOptionStyles = [],
  disableByClickingAnywhere = false,
}: OptionsPopupProps) => {
  const initialOptions = optionProps.map((option) => ({
    ...option,
    targetAreaRef,
    showNestedOptions: false,
  }));
  const [options, setOptions] = useState<OptionWithNested[]>(initialOptions);
  const popupRef = useRef<HTMLDivElement>(null);

  usePopup({
    popupRef,
    targetAreaRef,
    position,
    isActive,
    setIsActive,
    autoMaxHeight,
    disableByClickingAnywhere,
  });

  // Toggle nested options visibility for clicked option
  const handleOptionClick = (id: number) => {
    const index = options.findIndex((option) => option.mainOption.id === id);
    const option = options[index];
    if (option.nestedOptions) {
      const newOptions = [...options];
      newOptions[index].showNestedOptions =
        !newOptions[index].showNestedOptions;
      setOptions(newOptions);
    }
    option.mainOption.onSelect && option.mainOption.onSelect();
  };

  const optionsJSX = options.map((option) => {
    let nestedOptionsJSX: Array<React.ReactElement> = [];
    if (option.nestedOptions && option.showNestedOptions) {
      nestedOptionsJSX = option.nestedOptions?.map((nested) => (
        <Option
          mainOption={{
            component: nested.component,
            id: nested.id,
            onSelect: () => nested.onSelect,
          }}
          key={nested.id}
          extraStyles={extraOptionStyles}
        />
      ));
    }

    return [
      <Option
        mainOption={{
          component: option.mainOption.component,
          id: option.mainOption.id,
          onSelect: () => handleOptionClick(option.mainOption.id),
        }}
        nestedOptions={option.nestedOptions}
        showNestedOptions={option.showNestedOptions}
        key={option.mainOption.id}
        extraStyles={extraOptionStyles}
      />,
      ...nestedOptionsJSX,
    ];
  });

  return (
    <div
      id="popup"
      ref={popupRef}
      className={[styles.OptionsPopup, ...extraPopupStyles].join(" ")}
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
