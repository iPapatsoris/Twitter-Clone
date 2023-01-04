import styles from "./OptionsPopup.module.scss";

interface SimpleOption {
  component: React.ReactNode;
  id: string;
}

export interface OptionProps {
  mainOption: SimpleOption;
  nestedOptions?: Array<SimpleOption>;
}

const Option = ({ mainOption, nestedOptions }: OptionProps) => {
  return <div className={styles.Option}>{mainOption.component}</div>;
};

export default Option;
