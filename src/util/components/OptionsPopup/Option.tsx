import Icon from "../Icon/Icon";
import downArrowIcon from "../../../assets/icons/options/down-arrow.png";
import styles from "./OptionsPopup.module.scss";

export type SimpleOption = {
  component: React.ReactNode;
  id: number;
  onSelect: () => void;
};

export interface OptionWithNested {
  mainOption: SimpleOption;
  nestedOptions?: SimpleOption[];
  showNestedOptions?: boolean;
}

const Option = ({
  mainOption,
  nestedOptions,
  showNestedOptions,
}: OptionWithNested) => {
  const hasNestedOptions = nestedOptions && nestedOptions.length;
  console.log(nestedOptions);

  return (
    <div className={styles.Option} onClick={mainOption.onSelect}>
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
