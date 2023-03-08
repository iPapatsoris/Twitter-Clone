import { useEffect, useState } from "react";
import { StepperProps } from "../../../util/components/Stepper/Stepper";
import TextInput from "../../../util/components/TextInput/TextInput";
import NextStepButton from "../../NextStepButton/NextStepButton";
import Helper from "./Helper";
import styles from "./VerifyEmail.module.scss";

interface VerifyEmailProps extends StepperProps {
  email: string;
  nextStep: VoidFunction;
}

const VerifyEmail = ({ email, stepper }: VerifyEmailProps) => {
  const [code, setCode] = useState("");
  useEffect(() => {
    stepper.setIsNextStepDisabled(!code.length);
  }, [stepper, code.length]);

  useEffect(() => {
    stepper.nextStepButtonRef.current?.addEventListener(
      "click",
      stepper.nextStep
    );
    return () =>
      stepper.nextStepButtonRef.current?.removeEventListener(
        "click",
        stepper.nextStep
      );
  }, [stepper]);

  return (
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
      {/* <NextStepButton onClick={nextStep} isDisabled={!code.length} /> */}
    </div>
  );
};

export default VerifyEmail;
