import Icon from "../../Icon/Icon";
import { ReactComponent as DownArrowIcon } from "../../../../assets/icons/options/down-arrow.svg";
import styles from "./Option.module.scss";
import { Link } from "react-router-dom";

export type SimpleOption = {
  component: React.ReactNode;
  id: string;
  onSelect?: () => void;
  // Wrap item with anchor
  link?: string;
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
  extraStyles = [],
}: OptionWithNested & {
  extraStyles?: string[];
}) => {
  const hasNestedOptions = nestedOptions && nestedOptions.length;

  const option = (
    <div
      className={[...extraStyles, styles.Option].join(" ")}
      onClick={mainOption.onSelect}
    >
      {mainOption.component}
      {hasNestedOptions && (
        <div className={styles.PushRight}>
          <Icon
            src={DownArrowIcon}
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

  return mainOption.link ? (
    <Link to={mainOption.link}>{option}</Link>
  ) : (
    <>{option}</>
  );
};

export const addClickHandlerToNonExpandableOptions = (
  options: OptionWithNested[],
  onClickHandler: VoidFunction
) => {
  return options.map((option) => {
    return {
      ...option,
      mainOption: {
        ...option.mainOption,
        onSelect: !option.nestedOptions
          ? () => {
              const providedHandler = option.mainOption.onSelect;
              providedHandler && providedHandler();
              onClickHandler();
            }
          : option.mainOption.onSelect,
      },
      nestedOptions:
        option.nestedOptions &&
        option.nestedOptions.map((nested) => ({
          ...nested,
          onSelect: onClickHandler,
        })),
    };
  });
};

export default Option;
