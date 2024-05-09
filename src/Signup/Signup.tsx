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
import Minipage from "../util/layouts/Minipage/Minipage";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import StepHeader from "./Steps/StepHeader";
import { useAuthStoreActions } from "../store/AuthStore";
import useSignupState from "./useSignupState";

interface SignupProps {
  removeSignup: VoidFunction;
}

const Signup = ({ removeSignup }: SignupProps) => {
  const { handleSignup } = useAuthStoreActions();
  const { isSmallScreen } = useWindowDimensions();

  const { mutate } = useMutation<
    CreateUser["response"],
    unknown,
    CreateUser["request"]
  >({
    mutationFn: async (body) => postData("user", body),
    onSuccess: (res) => {
      handleSignup(res.data?.user!);
    },
  });

  const {
    performRegistration,
    username,
    password,
    accountInfo,
    settings,
    setUsername,
    setAccountInfo,
    setPassword,
    setEmailCodeHint,
    setInputToFocus,
    setPerformRegistration,
    setSettings,
    inputToFocus,
    emailCodeHint,
  } = useSignupState();

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

  const minipage = (
    <Minipage alignContent={isSmallScreen ? "icon" : "header"} />
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

  // Add header prop to each step component
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

  console.log("signup");

  return stepsWithHeader[stepper.step];
};

export default Signup;
