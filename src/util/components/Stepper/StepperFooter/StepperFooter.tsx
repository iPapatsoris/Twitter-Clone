import Button from "../../Button/Button";
import styles from "./StepperFooter.module.scss";

interface StepperFooterProps {
  onNextStepClick: VoidFunction;
  isNextStepDisabled: boolean;
}
const StepperFooter = ({
  onNextStepClick,
  isNextStepDisabled,
}: StepperFooterProps) => {
  return (
    <div className={styles.Footer}>
      <Button
        type="submit"
        size="large"
        largeFont
        color="black"
        stretch
        disabled={isNextStepDisabled}
        extraClasses={[styles.Button]}
        onClick={onNextStepClick}
      >
        Next
      </Button>
    </div>
  );
};
export default StepperFooter;
