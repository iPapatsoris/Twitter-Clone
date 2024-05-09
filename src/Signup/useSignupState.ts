import dayjs from "dayjs";
import { useState } from "react";

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

const useSignupState = () => {
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
  const [emailCodeHint, setEmailCodeHint] = useState("");

  return {
    accountInfo,
    setAccountInfo,
    settings,
    setSettings,
    username,
    setUsername,
    password,
    setPassword,
    emailCodeHint,
    setEmailCodeHint,
    performRegistration,
    setPerformRegistration,
    inputToFocus,
    setInputToFocus,
  };
};

export default useSignupState;
