import React from "react";
import StepperFooter from "./StepperFooter/StepperFooter";
import StepperHeader from "./StepperHeader/StepperHeader";
import styles from "./Stepper.module.scss";

interface StepProps {
  step: number;
  header: string;
  onNextStepClick: VoidFunction;
  onPrevStepClick: VoidFunction;
  isNextStepDisabled: boolean;
  children: React.ReactElement[] | React.ReactElement;
}

const Step = ({
  step,
  header,
  onNextStepClick,
  onPrevStepClick,
  isNextStepDisabled,
  children,
}: StepProps) => {
  return (
    <div className={styles.Stepper}>
      <StepperHeader
        step={step}
        onPrevStepClick={onPrevStepClick}
        header={header}
      />
      <div className={styles.Wrapper}>
        <div className={styles.Content}>{children}</div>
      </div>
      <StepperFooter
        onNextStepClick={onNextStepClick}
        isNextStepDisabled={isNextStepDisabled}
      />
    </div>
  );
};

export default Step;
