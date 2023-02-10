import styles from "../SingupHeader/SingupHeader.module.scss";

interface SignupHeaderProps {}

const SignupHeader = ({}: SignupHeaderProps) => {
  return <div className={styles.Header}>Step 1 of 5</div>;
};

export default SignupHeader;
