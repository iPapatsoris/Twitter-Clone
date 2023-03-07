import Button from "../../util/components/Button/Button";
import styles from "./SignupFooter.module.scss";

interface FooterProps {
  isDisabled: boolean;
}

const SignupFooter = ({ isDisabled }: FooterProps) => {
  return (
    <Button
      type="submit"
      size="large"
      largeFont
      extraClasses={[styles.Footer]}
      color="black"
      disabled={isDisabled}
    >
      Next
    </Button>
  );
};

export default SignupFooter;
