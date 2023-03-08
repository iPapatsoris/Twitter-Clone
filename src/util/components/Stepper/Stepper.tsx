import {
  cloneElement,
  ForwardedRef,
  SetStateAction,
  useRef,
  useState,
} from "react";
import NextStepButton from "../../../Signup/NextStepButton/NextStepButton";
import SignupHeader from "../../../Signup/SingupHeader/SignupHeader";
import styles from "./Stepper.module.scss";

interface InternalStepperProps {
  steps: React.ReactElement[];
}

export type StepperProps = {
  stepper: {
    nextStepButtonRef: React.RefObject<HTMLButtonElement>;
    setIsNextStepDisabled: React.Dispatch<SetStateAction<boolean>>;
    nextStep: VoidFunction;
  };
};

const Stepper = ({ steps }: InternalStepperProps) => {
  const nextStepButtonRef = useRef<HTMLButtonElement>(null);
  const [isNextStepDisabled, setIsNextStepDisabled] = useState(true);
  const [step, setStep] = useState(0);
  const nextStep = () => {
    setStep((s) => s + 1);
  };
  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const stepElement = cloneElement(steps[step], {
    stepper: { nextStepButtonRef, setIsNextStepDisabled, nextStep },
  });

  return (
    <div className={styles.Stepper}>
      <SignupHeader
        stepper={{ step, prevStep }}
        header={"Step " + (step + 1) + " of " + steps.length}
      />
      <div className={styles.Wrapper}>
        <div className={styles.Content}>{stepElement}</div>
      </div>
      <NextStepButton ref={nextStepButtonRef} isDisabled={isNextStepDisabled} />
    </div>
  );
};

export default Stepper;
