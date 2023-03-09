import { useState } from "react";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import TextInput from "../../../util/components/TextInput/TextInput";
import useStepper from "../../../util/hooks/useStepper";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
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
    <Minipage
      header={
        <StepHeader step={step} onPrevStepClick={prevStep}>
          {header}
        </StepHeader>
      }
      footer={<NextStepButton onClick={nextStep} isDisabled={!code.length} />}
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
    </Minipage>
  );
};

export default VerifyEmail;
