import TextInput from "../../../util/components/TextInput/TextInput";
import useStepper from "../../../util/hooks/useStepper";
import { AccountInfoT } from "../../Signup";
import styles from "./VerifyAccountInfo.module.scss";
import Terms from "../../Terms/Terms";
import StepHeader from "../StepHeader";
import Button from "../../../util/components/Button/Button";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import { SetStateAction } from "react";
import useSendEmailCode from "../VerifyEmail/useSendEmailCode";
import Form from "../../../util/components/Form/Form";

interface VerifyAccountInfoProps {
  accountInfo: AccountInfoT;
  stepper: ReturnType<typeof useStepper>;
  header?: string;
  setEmailCodeHint: React.Dispatch<SetStateAction<string>>;
}

const VerifyAccountInfo = ({
  header = "",
  accountInfo,
  stepper: { step, setStep, nextStep, prevStep },
  setEmailCodeHint,
}: VerifyAccountInfoProps) => {
  const sendCode = useSendEmailCode(accountInfo.email).mutate;

  const sendEmailConfirmation = () => {
    sendCode(
      { email: accountInfo.email },
      {
        onSuccess: (res) => {
          setEmailCodeHint(res.data!.code);
          nextStep();
          console.log("nextStep from verify account info");
        },
      }
    );
  };

  return (
    <Form onSubmit={sendEmailConfirmation}>
      <Minipage
        header={
          <StepHeader step={step} onPrevStepClick={prevStep}>
            {header}
          </StepHeader>
        }
        footer={
          <>
            <Terms extraStyles={[styles.Terms]} />
            <Button
              type="submit"
              size="large"
              largeFont
              color="primary"
              stretch
            >
              Sign up
            </Button>
          </>
        }
      >
        <div className={styles.VerifyAccountInfo}>
          <TextInput
            name="name"
            placeholder="Name"
            readonly
            showStatusIcon
            value={accountInfo.name}
            onClick={() => setStep(0)}
            onChange={() => {}}
          />
          <TextInput
            name="email"
            placeholder="Email"
            readonly
            showStatusIcon
            value={accountInfo.email}
            onClick={() => setStep(0)}
            onChange={() => {}}
          />
          <TextInput
            name="birthDate"
            placeholder="Date of birth"
            readonly
            showStatusIcon
            value={accountInfo.birthDate!.format("MMM M, YYYY")}
            onClick={() => setStep(0)}
            onChange={() => {}}
          />
        </div>
      </Minipage>
    </Form>
  );
};

export default VerifyAccountInfo;
