import { useContext, useRef, useState } from "react";
import { PopupContext } from "../../../App";
import OptionsPopup, {
  activatePopupHandler,
} from "../OptionsPopup/OptionsPopup";
import styles from "../Input/InputWrapper.module.scss";
import dropdownStyles from "./Dropdown.module.scss";
import Icon from "../Icon/Icon";
import downArrowIcon from "../../../assets/icons/options/down-arrow.png";
import { SimpleOption } from "../OptionsPopup/Option";

interface DropdownProps {
  name: string;
  selectedOptionID: number;
  options: SimpleOption[];
  position?: React.ComponentProps<typeof OptionsPopup>["position"];
  extraStyles: string[];
}

const Dropdown = (props: DropdownProps) => {
  const { name, extraStyles, position } = props;
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

  const selectedOption = props.options.find(
    (option) => option.id === props.selectedOptionID
  );
  console.log(selectedOption);

  // Covert props between components
  const options: React.ComponentProps<typeof OptionsPopup>["options"] =
    props.options.map((option) => ({
      mainOption: option,
    }));

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
        ref={dropdownRef}
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
            {selectedOption && selectedOption.component}
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
          extraPopupStyles={[dropdownStyles.Popup]}
          extraOptionStyles={[dropdownStyles.Option]}
          position={position}
        />
      )}
    </div>
  );
};

export default Dropdown;
