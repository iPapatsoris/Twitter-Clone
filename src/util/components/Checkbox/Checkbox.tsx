import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  label: string;
  id: number;
  isChecked: boolean;
  onChange: VoidFunction;
}

const Checkbox = ({ label, id, isChecked, onChange }: CheckboxProps) => {
  const prefix = "checkbox-";
  return (
    <label htmlFor={prefix + id.toString()} className={styles.CheckboxArea}>
      <span>{label}</span>
      <input
        id={prefix + id}
        type="checkbox"
        checked={isChecked}
        onChange={() => onChange()}
      />
    </label>
  );
};

export default Checkbox;
