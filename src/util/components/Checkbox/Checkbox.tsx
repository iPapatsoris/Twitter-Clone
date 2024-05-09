import { HTMLProps } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, "type"> {}

const Checkbox = (props: CheckboxProps) => {
  const prefix = "checkbox-";
  const { id, label } = props;
  return (
    <label htmlFor={prefix + id?.toString()} className={styles.CheckboxArea}>
      <span>{label}</span>
      <input {...props} id={prefix + id} type="checkbox" />
    </label>
  );
};

export default Checkbox;
