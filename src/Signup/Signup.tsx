import dayjs from "dayjs";
import { useState } from "react";
import styles from "./Signup.module.scss";
import SignupHeader from "./SingupHeader/SignupHeader";
import AccountInfo from "./Steps/AccountInfo/AccountInfo";
import Settings from "./Steps/Settings/Settings";

interface SignupProps {}

const Signup = ({}: SignupProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<dayjs.Dayjs | null>(null);

  const [step, setStep] = useState(0);
  const nextStep = () => {
    setStep((s) => s + 1);
  };
  const prevStep = () => {
    setStep((s) => s - 1);
  };
  const steps = [
    <AccountInfo
      name={name}
      email={email}
      birthDate={birthDate}
      nextStep={nextStep}
      setName={setName}
      setEmail={setEmail}
      setBirthDate={setBirthDate}
    />,
    <Settings />,
  ];

  return (
    <div className={styles.Signup}>
      <SignupHeader
        stepper={{ step, nextStep, prevStep }}
        header={"Step " + (step + 1) + " of " + steps.length}
      />
      <div className={styles.Content}>{steps[step]}</div>
    </div>
  );
};

export default Signup;
