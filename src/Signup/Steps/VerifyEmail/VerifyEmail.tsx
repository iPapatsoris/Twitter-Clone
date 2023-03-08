import { useState } from "react";
import Step from "../../../util/components/Stepper/Step";
import TextInput from "../../../util/components/TextInput/TextInput";
import useStepper from "../../../util/hooks/useStepper";
import Helper from "./Helper";
import styles from "./VerifyEmail.module.scss";

interface VerifyEmailProps {
  email: string;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
}

const VerifyEmail = ({
  header = "",
  email,
  stepper: { step, nextStep, prevStep },
}: VerifyEmailProps) => {
  const [code, setCode] = useState("");
  return (
    <Step
      step={step}
      header={header}
      isNextStepDisabled={!code.length}
      onNextStepClick={nextStep}
      onPrevStepClick={prevStep}
    >
      <div className={styles.VerifyEmail}>
        <h1>We sent you a code</h1>
        <div className={styles.Info}>Enter it below to verify {email}.</div>
        <TextInput
          name="emailCode"
          placeholder="Verification code"
          value={code}
          onChange={setCode}
          autofocus
          helper={<Helper />}
        />
      </div>
    </Step>
  );
};

export default VerifyEmail;
