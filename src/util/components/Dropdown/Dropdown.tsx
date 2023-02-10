import React, { useContext, useRef, useState } from "react";
import { PopupContext } from "../../../App";
import { OptionProps, OptionType } from "../OptionsPopup/Option";
import OptionsPopup, {
  activatePopupHandler,
} from "../OptionsPopup/OptionsPopup";
import styles from "../Input/InputWrapper.module.scss";
import dropdownStyles from "./Dropdown.module.scss";
import Icon from "../Icon/Icon";
import downArrowIcon from "../../../assets/icons/options/down-arrow.png";

interface DropdownProps {
  name: string;
  options: Array<{
    value: string;
    text: string;
  }>;
  extraStyles: string[];
}

const Dropdown = (props: DropdownProps) => {
  const { name, extraStyles } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);
  const [isActive, setIsActive] = useState(false);
  const [option, setOption] = useState<OptionType["mainOption"] | null>(null);

  const handleClick = (e: any) => {
    activatePopupHandler({
      e,
      isActivePopup: isActive,
      setIsActivePopup: setIsActive,
      setDisableOuterPointerEvents,
    });
  };

  const options: OptionProps[] = props.options.map((option) => {
    const mainOption = {
      id: option.value,
      component: <span>{option.text}</span>,
    };
    return {
      mainOption,
      onClick: () => {
        setOption(mainOption);
      },
    };
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperStyles: styles.InputWrapperNames[] = [
    styles.Wrapper,
    dropdownStyles.Wrapper,
  ];
  const labelStyles: styles.InputWrapperNames[] = [];
  if (isActive) {
    wrapperStyles.push(styles.Focused);
    labelStyles.push(styles.Blue);
  }
  return (
    <div className={extraStyles.join(" ")}>
      <div
        ref={wrapperRef}
        className={wrapperStyles.join(" ")}
        onClick={handleClick}
      >
        <div>
          <div className={styles.Info}>
            <label htmlFor="dropdown" className={labelStyles.join(" ")}>
              {name}
            </label>
          </div>
          <div className={dropdownStyles.Value}>
            {option && option.component}
          </div>
        </div>
        <Icon src={downArrowIcon} hover={"none"} />
      </div>
      {isActive && dropdownRef && (
        <OptionsPopup
          options={options}
          isActive
          setIsActive={setIsActive}
          targetAreaRef={dropdownRef}
          disableByClickingAnywhere
        />
      )}
    </div>
  );
};

export default Dropdown;
