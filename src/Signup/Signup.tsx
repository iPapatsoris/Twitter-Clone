import dayjs from "dayjs";
import React, { useState } from "react";
import useStepper from "../util/hooks/useStepper";
import AccountInfo from "./Steps/AccountInfo/AccountInfo";
import MakePassword from "./Steps/MakePassword/MakePassword";
import Settings from "./Steps/Settings/Settings";
import VerifyAccountInfo from "./Steps/VerifyAccountInfo/VerifyAccountInfo";
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

  const stepper = useStepper();

  const steps = [
    <AccountInfo
      stepper={stepper}
      accountInfo={accountInfo}
      setAccountInfo={setAccountInfo}
    />,
    <Settings
      stepper={stepper}
      settings={settings}
      setSettings={setSettings}
    />,
    <VerifyAccountInfo stepper={stepper} accountInfo={accountInfo!} />,
    <VerifyEmail stepper={stepper} email={accountInfo.email} />,
    <MakePassword stepper={stepper} />,
  ];

  const stepsWithHeader = steps.map((stepComponent, index) =>
    React.cloneElement(stepComponent, {
      key: index,
      header: "Step " + (index + 1) + " out of " + steps.length,
    })
  );

  return stepsWithHeader[stepper.step];
};

export default Signup;
