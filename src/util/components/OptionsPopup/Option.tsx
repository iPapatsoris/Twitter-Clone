import Icon from "../Icon/Icon";
import downArrowIcon from "../../../assets/icons/options/down-arrow.png";
import styles from "./OptionsPopup.module.scss";

interface SimpleOption {
  component: React.ReactNode;
  id: string;
}

export interface OptionType {
  mainOption: SimpleOption;
  nestedOptions?: Array<SimpleOption>;
  showNestedOptions?: boolean;
}

export interface OptionProps extends OptionType {
  onClick?: React.MouseEventHandler;
}

const Option = ({
  mainOption,
  nestedOptions,
  showNestedOptions,
  onClick,
}: OptionProps) => {
  const hasNestedOptions = nestedOptions && nestedOptions.length;

  return (
    <div className={styles.Option} onClick={onClick}>
      {mainOption.component}
      {hasNestedOptions && (
        <div className={styles.PushRight}>
          <Icon
            src={downArrowIcon}
            hover="none"
            alt="Expand option"
            extraStyles={[
              styles.Icon,
              showNestedOptions ? styles.RotateIcon : "",
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default Option;
