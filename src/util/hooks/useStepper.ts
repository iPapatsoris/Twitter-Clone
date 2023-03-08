import { useState } from "react";

const useStepper = () => {
  const [step, setStep] = useState(0);
  const nextStep = () => {
    setStep((s) => s + 1);
  };
  const prevStep = () => {
    setStep((s) => s - 1);
  };

  return { step, nextStep, prevStep };
};

export default useStepper;
