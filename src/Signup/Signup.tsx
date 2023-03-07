import dayjs from "dayjs";
import { useState } from "react";
import styles from "./Signup.module.scss";
import SignupHeader from "./SingupHeader/SignupHeader";
import AccountInfo from "./Steps/AccountInfo/AccountInfo";
import MakePassword from "./Steps/MakePassword/MakePassword";
import Settings from "./Steps/Settings/Settings";
import VerifyEmail from "./Steps/VerifyEmail/VerifyEmail";

interface SignupProps {}

export type AccountInfoT = {
  name: string;
  email: string;
  birthDate: dayjs.Dayjs | null;
};

export type SettingsT = {
  receiveEmails: boolean;
  beFoundByEmail: boolean;
  personalizeAds: boolean;
};

const Signup = ({}: SignupProps) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoT>({
    name: "",
    email: "",
    birthDate: null,
  });

  const [settings, setSettings] = useState<SettingsT>({
    receiveEmails: false,
    beFoundByEmail: false,
    personalizeAds: false,
  });

  const [step, setStep] = useState(0);
  const nextStep = () => {
    setStep((s) => s + 1);
  };
  const prevStep = () => {
    setStep((s) => s - 1);
  };
  const steps = [
    <AccountInfo
      nextStep={nextStep}
      accountInfo={accountInfo}
      setAccountInfo={setAccountInfo}
    />,
    <Settings
      settings={settings}
      setSettings={setSettings}
      nextStep={nextStep}
    />,
    <VerifyEmail email={accountInfo.email} nextStep={nextStep} />,
    <MakePassword nextStep={nextStep} />,
  ];

  return (
    <div className={styles.Signup}>
      <SignupHeader
        stepper={{ step, prevStep }}
        header={"Step " + (step + 1) + " of " + steps.length}
      />
      <div className={styles.Content}>{steps[step]}</div>
    </div>
  );
};

export default Signup;
