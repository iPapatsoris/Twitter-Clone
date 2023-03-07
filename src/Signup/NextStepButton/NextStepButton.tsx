import Button from "../../util/components/Button/Button";
import styles from "./NextStepButton.module.scss";

interface FooterProps {
  isDisabled: boolean;
  onClick: VoidFunction;
}
// manage on submit (account info) vs non form (settings)
const NextStepButton = ({ onClick, isDisabled }: FooterProps) => {
  return (
    <Button
      type="submit"
      size="large"
      largeFont
      extraClasses={[styles.Footer]}
      color="black"
      stretch
      disabled={isDisabled}
      onClick={onClick}
    >
      Next
    </Button>
  );
};

export default NextStepButton;
