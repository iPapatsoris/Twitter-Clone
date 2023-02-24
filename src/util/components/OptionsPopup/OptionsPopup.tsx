import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  isActive,
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
    isActive,
    setIsActive,
    autoMaxHeight,
    onMouseDown,
  });

  const onOuterClick = (e: any) => {
    setIsActive(false);
    // Stop propagation to not open the popup again due to event bubbling
    e.stopPropagation();
  };

  const onInnerClick = (e: any) => {
    // Stop propagation to not close the popup due to event bubbling
    e.stopPropagation();
  };

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

  const optionsJSX = options.map((option) => {
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

  const popup = (
    <div className={styles.Wrapper} onClick={onOuterClick}>
      <div
        id="popup"
        ref={popupRef}
        className={[styles.OptionsPopup, ...extraPopupStyles].join(" ")}
        onClick={onInnerClick}
      >
        {optionsJSX}
      </div>
    </div>
  );

  return createPortal(popup, document.body);
};

export default OptionsPopup;
