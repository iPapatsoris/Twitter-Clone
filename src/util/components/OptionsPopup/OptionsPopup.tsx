import Option, { OptionProps } from "./Option";
import styles from "./OptionsPopup.module.scss";

interface OptionsPopupProps {
  isVisible: boolean;
  options: Array<OptionProps>;
}

const OptionsPopup = ({ isVisible, options }: OptionsPopupProps) => {
  const optionsJSX = options.map((option) => {
    return isVisible && <Option key={option.mainOption.id} {...option} />;
  });

  return <div className={styles.OptionsPopup}>{optionsJSX}</div>;
};

export default OptionsPopup;
