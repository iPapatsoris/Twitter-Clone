import React from "react";
import TextInput from "../../../util/components/Input/Input";
import useStepper from "../../../util/hooks/useStepper";
import { AccountInfoT } from "../../Signup";
import styles from "./VerifyAccountInfo.module.scss";
import Terms from "../../Terms/Terms";
import { MinipageProps } from "../../../util/layouts/Minipage/Minipage";
import { SetStateAction } from "react";
import useSendEmailCode from "../VerifyEmail/useSendEmailCode";
import Form from "../../../util/components/Form/Form";
import NextStepButton from "../NextStepButton";

interface VerifyAccountInfoProps {
  accountInfo: AccountInfoT;
  stepper: ReturnType<typeof useStepper>;
  minipage?: React.ReactElement<MinipageProps>;
  setEmailCodeHint: React.Dispatch<SetStateAction<string>>;
  setInputToFocus: React.Dispatch<SetStateAction<keyof AccountInfoT>>;
}

const VerifyAccountInfo = ({
  minipage,
  accountInfo,
  stepper: { setStep, nextStep },
  setEmailCodeHint,
  setInputToFocus,
}: VerifyAccountInfoProps) => {
  const sendCode = useSendEmailCode(accountInfo.email).mutate;

  const sendEmailConfirmation = () => {
    sendCode(
      { email: accountInfo.email },
      {
        onSuccess: (res) => {
          setEmailCodeHint(res.data!.code);
          nextStep();
        },
      }
    );
  };

  if (!minipage) {
    return null;
  }

  return (
    <Form onSubmit={sendEmailConfirmation}>
      {React.cloneElement(minipage, {
        footer: (
          <>
            <Terms extraStyles={[styles.Terms]} />
            <NextStepButton color="primary">Confirm</NextStepButton>
          </>
        ),
        children: (
          <div className={styles.VerifyAccountInfo}>
            <TextInput
              name="name"
              placeholder="Name"
              readonly
              showStatusIcon
              value={accountInfo.name}
              onClick={() => {
                setInputToFocus("name");
                setStep(0);
              }}
              onChange={() => {}}
            />
            <TextInput
              name="email"
              placeholder="Email"
              readonly
              showStatusIcon
              value={accountInfo.email}
              onClick={() => {
                setInputToFocus("email");
                setStep(0);
              }}
              onChange={() => {}}
            />
            <TextInput
              name="birthDate"
              placeholder="Date of birth"
              readonly
              showStatusIcon
              value={accountInfo.birthDate!.format("MMM M, YYYY")}
              onClick={() => {
                setInputToFocus("birthDate");
                setStep(0);
              }}
              onChange={() => {}}
            />
          </div>
        ),
      })}
    </Form>
  );
};

export default VerifyAccountInfo;
