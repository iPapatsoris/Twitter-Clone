import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Step from "../../../util/components/Stepper/Step";
import FormInput from "../../../util/components/TextInput/FormTextInput";
import useStepper from "../../../util/hooks/useStepper";
import styles from "./MakePassword.module.scss";

type MakePasswordProps = {
  stepper: ReturnType<typeof useStepper>;
  header?: string;
};

const MakePassword = ({
  stepper: { step, nextStep, prevStep },
  header = "",
}: MakePasswordProps) => {
  type FormInput = {
    password: string;
  };

  const schema = yup.object().shape({
    password: yup
      .string()
      .required("Please enter a password")
      .min(
        8,
        "Your password needs to be at least 8 characters. Please enter a longer one"
      ),
  });

  const form = useForm<FormInput>({
    defaultValues: {
      password: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  return (
    <Step
      header={header}
      step={step}
      onNextStepClick={handleSubmit(nextStep)}
      onPrevStepClick={prevStep}
      isNextStepDisabled={!isValid}
    >
      <div className={styles.MakePassword}>
        <h1>You'll need a password</h1>
        <span className={styles.Info}>Make sure it's 8 characters or more</span>
        <FormInput
          autofocus
          name="password"
          placeholder="Password"
          control={control}
          type="password"
        />
      </div>
    </Step>
  );
};

export default MakePassword;
