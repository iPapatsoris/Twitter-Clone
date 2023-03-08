import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { StepperProps } from "../../../util/components/Stepper/Stepper";
import FormInput from "../../../util/components/TextInput/FormTextInput";
import TextInput from "../../../util/components/TextInput/TextInput";
import NextStepButton from "../../NextStepButton/NextStepButton";
import styles from "./MakePassword.module.scss";

const MakePassword = ({ stepper }: StepperProps) => {
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

  useEffect(() => {
    stepper.setIsNextStepDisabled(!isValid);
  }, [isValid, stepper]);

  useEffect(() => {
    const onSubmit: SubmitHandler<FormInput> = ({ password }) => {
      stepper.nextStep();
    };
    const nextStepClickHandler = handleSubmit(onSubmit);

    stepper.nextStepButtonRef.current?.addEventListener(
      "click",
      nextStepClickHandler
    );
    return () =>
      stepper.nextStepButtonRef.current?.removeEventListener(
        "click",
        nextStepClickHandler
      );
  }, [stepper, handleSubmit]);

  return (
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
      {/* <NextStepButton isDisabled={!isValid} onClick={handleSubmit(nextStep)} /> */}
    </div>
  );
};

export default MakePassword;
