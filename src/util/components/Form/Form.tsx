import styles from "../Input/Input.module.scss";

interface FormProps {
  onSubmit: VoidFunction;
  children: React.ReactElement | React.ReactElement[];
}

const Form = ({ onSubmit, children }: FormProps) => (
  <form
    className={styles.Semantic}
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    {children}
  </form>
);

export default Form;
