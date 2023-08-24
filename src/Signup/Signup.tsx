import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateUser } from "../../backend/src/api/user";
import useStepper from "../util/hooks/useStepper";
import AccountInfo from "./Steps/AccountInfo/AccountInfo";
import MakePassword from "./Steps/MakePassword/MakePassword";
import MakeUsername from "./Steps/MakeUsername/MakeUsername";
import Settings from "./Steps/Settings/Settings";
import VerifyAccountInfo from "./Steps/VerifyAccountInfo/VerifyAccountInfo";
import VerifyEmail from "./Steps/VerifyEmail/VerifyEmail";
import { postData } from "../util/request";
import { redirect } from "react-router-dom";
import { getPagePath } from "../util/paths";
import Minipage from "../util/layouts/Minipage/Minipage";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import StepHeader from "./Steps/StepHeader";

interface SignupProps {
  removeSignup: VoidFunction;
}

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

const Signup = ({ removeSignup }: SignupProps) => {
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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [performRegistration, setPerformRegistration] = useState(false);
  const [inputToFocus, setInputToFocus] = useState<keyof AccountInfoT>("name");

  const { mutate } = useMutation<
    CreateUser["response"],
    unknown,
    CreateUser["request"]
  >(async (body) => postData("user", body), {
    onSuccess: () => {
      redirect(getPagePath("profile"));
    },
  });

  useEffect(() => {
    if (performRegistration) {
      mutate({
        user: {
          username,
          password,
          name: accountInfo.name,
          email: accountInfo.email,
          birthDate: accountInfo.birthDate!.format("YYYY-MM-DD"),
        },
      });
    }
  }, [performRegistration, accountInfo, mutate, username, password]);

  const [emailCodeHint, setEmailCodeHint] = useState("");
  const { isMobile, isTablet } = useWindowDimensions();

  const minipage = (
    <Minipage alignContent={isMobile || isTablet ? "icon" : "header"} />
  );

  const stepper = useStepper();
  const steps = [
    <AccountInfo
      stepper={stepper}
      accountInfo={accountInfo}
      setAccountInfo={setAccountInfo}
      inputToFocus={inputToFocus}
    />,
    <Settings
      stepper={stepper}
      settings={settings}
      setSettings={setSettings}
    />,
    <VerifyAccountInfo
      setEmailCodeHint={setEmailCodeHint}
      stepper={stepper}
      accountInfo={accountInfo!}
      setInputToFocus={setInputToFocus}
    />,
    <VerifyEmail
      setEmailCodeHint={setEmailCodeHint}
      stepper={stepper}
      email={accountInfo.email}
      codeHint={emailCodeHint}
    />,
    <MakePassword setPassword={setPassword} stepper={stepper} />,
    <MakeUsername
      setPerformRegistration={setPerformRegistration}
      setUsername={setUsername}
      stepper={stepper}
    />,
  ];

  const stepsWithHeader = steps.map((stepComponent, index) =>
    React.cloneElement(stepComponent, {
      key: index,
      minipage: React.cloneElement(minipage, {
        header: (
          <StepHeader
            step={index}
            onPrevStepClick={!index ? () => {} : stepper.prevStep}
            existStepper={removeSignup}
          >
            {"Step " + (index + 1) + " out of " + steps.length}
          </StepHeader>
        ),
      }),
    })
  );

  return stepsWithHeader[stepper.step];
};

export default Signup;
