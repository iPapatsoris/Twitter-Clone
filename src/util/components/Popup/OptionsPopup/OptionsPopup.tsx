import React, { useState } from "react";
import Popup, { PopupProps } from "../Popup";
import Option, { OptionWithNested } from "./Option";

// Note: If OptionsPopup is placed as the child of the element that opens it
// onClick, the onClick event handler passed to the individual options
// should call stopPropagation(), to prevent it from re-opening after it closes.
export interface OptionsPopupProps {
  // Options for the popup. Nested options are supported that expand it
  options: OptionWithNested[];
  extraOptionStyles?: string[];
  popupProps: Omit<PopupProps, "children">;
}

const OptionsPopup = ({
  options: optionProps,
  extraOptionStyles,
  popupProps,
}: OptionsPopupProps) => {
  const initialOptions: OptionWithNested[] = optionProps.map((option) => ({
    ...option,
    targetAreaRef: popupProps.targetAreaRef, // where is this used?
    showNestedOptions: false,
  }));
  const [options, setOptions] = useState<OptionWithNested[]>(initialOptions);

  // Toggle nested options visibility for clicked option
  const handleOptionClick = (id: number) => {
    const index = options.findIndex((option) => option.mainOption.id === id);
    const option = options[index];
    if (option.nestedOptions) {
      const newOptions = [...options];
      newOptions[index].showNestedOptions =
        !newOptions[index].showNestedOptions;
      setOptions(newOptions);
    } else {
      popupProps.setIsActive(false);
    }

    option.mainOption.onSelect && option.mainOption.onSelect();
  };

  const optionsJSX: React.ReactElement[] = [];
  options.forEach((option) => {
    // For each option, include itself along with its nested options
    let nestedOptionsJSX: Array<React.ReactElement> = [];
    if (option.nestedOptions && option.showNestedOptions) {
      nestedOptionsJSX = option.nestedOptions?.map((nested) => (
        <Option
          mainOption={{
            component: nested.component,
            id: nested.id,
            onSelect: () => {
              popupProps.setIsActive(false);
              nested.onSelect();
            },
          }}
          key={nested.id}
          extraStyles={extraOptionStyles}
        />
      ));
    }

    optionsJSX.push(
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
      ...nestedOptionsJSX
    );
  });

  return <Popup {...popupProps}>{optionsJSX}</Popup>;
};

export default OptionsPopup;
