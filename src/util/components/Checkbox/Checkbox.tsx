import { HTMLProps, forwardRef, useRef } from "react";
import styles from "./Checkbox.module.scss";
import useForwardRef from "../../hooks/useForwardRef";

interface CheckboxProps extends Omit<HTMLProps<HTMLInputElement>, "type"> {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, fref) => {
  const prefix = "checkbox-";
  const { id, label } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useForwardRef(fref, inputRef);

  return (
    <label htmlFor={prefix + id?.toString()} className={styles.CheckboxArea}>
      <span>{label}</span>
      <input ref={ref} {...props} id={prefix + id} type="checkbox" />
    </label>
  );
});

export default Checkbox;
