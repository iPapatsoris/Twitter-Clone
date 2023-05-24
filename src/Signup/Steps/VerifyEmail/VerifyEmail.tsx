import { SetStateAction, useState } from "react";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import TextInput from "../../../util/components/Input/Input";
import useStepper from "../../../util/hooks/useStepper";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
import Helper from "./Helper";
import styles from "./VerifyEmail.module.scss";
import { useMutation } from "@tanstack/react-query";
import { VerifyEmailCode } from "../../../../backend/src/api/email";
import useSendEmailCode from "./useSendEmailCode";
import Form from "../../../util/components/Form/Form";
import useRequest from "../../../util/hooks/requests/useRequest";

interface VerifyEmailProps {
  email: string;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
  codeHint: string;
  setEmailCodeHint: React.Dispatch<SetStateAction<string>>;
}

const VerifyEmail = ({
  header = "",
  email,
  stepper: { step, nextStep, prevStep },
  codeHint,
  setEmailCodeHint,
}: VerifyEmailProps) => {
  const [code, setCode] = useState("");
  const [wrongCodeError, setWrongCodeError] = useState("");

  const { postData } = useRequest();

  const {
    mutate: verifyCode,
    // isLoading: isVerificationLoading,
  } = useMutation<
    VerifyEmailCode["response"],
    unknown,
    VerifyEmailCode["request"]
  >(async (body) => postData("email/code/verify", body));

  const handleSubmit = () => {
    verifyCode(
      { email, code },
      {
        onSuccess: (res) => {
          if (res.data?.codesMatch) {
            nextStep();
          } else {
            setWrongCodeError(
              "The code you have entered is incorrect. Please try again"
            );
          }
        },
      }
    );
  };

  const sendCode = useSendEmailCode(email).mutate;
  const onResendCode = () => {
    sendCode(
      { email },
      {
        onSuccess: (res) => {
          setEmailCodeHint(res.data!.code);
        },
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Minipage
        header={
          <StepHeader step={step} onPrevStepClick={prevStep}>
            {header}
          </StepHeader>
        }
        footer={
          <NextStepButton
            onClick={handleSubmit}
            isDisabled={!code.length}
            // isLoading={isVerificationLoading}
          />
        }
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
            helper={<Helper onResendCode={onResendCode} />}
            error={wrongCodeError}
          />
          <span className={styles.Hint}>
            <>(Hint: the code is {codeHint})</>
          </span>
        </div>
      </Minipage>
    </Form>
  );
};

export default VerifyEmail;
