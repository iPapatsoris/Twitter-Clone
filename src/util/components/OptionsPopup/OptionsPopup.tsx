import React, { useRef, useState } from "react";
import usePopup from "../../hooks/usePopup";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import Option, { OptionWithNested } from "./Option";
import styles from "./OptionsPopup.module.scss";

// Note: If OptionsPopup is placed as the child of the element that opens it
// onClick, the onClick event handler passed to the individual options
// should call stopPropagation(), to prevent it from re-opening after it closes.
export interface OptionsPopupProps {
  // Options for the popup. Nested options are supported that expand it
  options: OptionWithNested[];
  // State controlled by outer components
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  // Where to place popup
  targetAreaRef: React.RefObject<HTMLDivElement>;
  // Fine tuning of position
  position?: {
    block: "top" | "topCover" | "bottom" | "bottomCover";
    inline: "left" | "leftCover" | "right" | "rightCover";
  };
  // If true, max-height property is set dynamically so that a scroll bar is
  // introduced if popup exceeds beyond the viewport. Useful when popup is
  // positioned under a sticky or fixed context.
  autoMaxHeight?: boolean;
  // Activate on mousedown event intead of on click
  onMouseDown?: boolean;
  // Allow custom styling
  extraPopupStyles?: string[];
  extraOptionStyles?: string[];
}

const OptionsPopup = ({
  options: optionProps,
  setIsActive,
  targetAreaRef,
  position = {
    block: "bottomCover",
    inline: "leftCover",
  },
  autoMaxHeight = false,
  extraPopupStyles = [],
  extraOptionStyles = [],
  onMouseDown = false,
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
    setIsActive,
    autoMaxHeight,
    onMouseDown,
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
    } else {
      setIsActive(false);
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
              setIsActive(false);
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

  return (
    <ModalWrapper
      innerRef={popupRef}
      innerStyles={[styles.OptionsPopup, ...extraPopupStyles]}
      setIsActive={setIsActive}
    >
      {optionsJSX}
    </ModalWrapper>
  );
};

export default OptionsPopup;
