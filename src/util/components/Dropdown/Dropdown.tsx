import { useRef, useState } from "react";
import OptionsPopup from "../Popup/OptionsPopup/OptionsPopup";
import styles from "../Input/Input.module.scss";
import dropdownStyles from "./Dropdown.module.scss";
import Icon from "../Icon/Icon";
import { ReactComponent as DownArrowIcon } from "../../../assets/icons/options/down-arrow.svg";
import { SimpleOption } from "../Popup/OptionsPopup/Option";
import Popup from "../Popup/Popup";

interface DropdownProps {
  name: string;
  selectedOptionID: number | null;
  options: SimpleOption[];
  position?: React.ComponentProps<typeof Popup>["position"];
  extraStyles: string[];
}

const Dropdown = (props: DropdownProps) => {
  const { name, extraStyles, position } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const selectedOption =
    props.selectedOptionID !== null &&
    props.options.find((option) => option.id === props.selectedOptionID);

  // Covert props between components
  const options: React.ComponentProps<typeof OptionsPopup>["options"] =
    props.options.map((option) => ({
      mainOption: option,
    }));

  const wrapperStyles: styles.ClassNames[] = [
    styles.Wrapper,
    dropdownStyles.Wrapper,
  ];
  const labelStyles: styles.ClassNames[] = [];
  if (isActive) {
    wrapperStyles.push(styles.Focused);
    labelStyles.push(styles.PrimaryColor);
  }

  return (
    <div className={extraStyles.join(" ")}>
      <div
        ref={dropdownRef}
        className={wrapperStyles.join(" ")}
        onMouseDown={() => setIsActive(true)}
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
        <Icon src={DownArrowIcon} hover={"none"} />
      </div>
      {isActive && dropdownRef && (
        <OptionsPopup
          options={options}
          extraOptionStyles={[dropdownStyles.Option]}
          popupProps={{
            setIsActive,
            targetAreaRef: dropdownRef,
            extraPopupStyles: [dropdownStyles.Popup],
            position,
          }}
        />
      )}
    </div>
  );
};

export default Dropdown;
