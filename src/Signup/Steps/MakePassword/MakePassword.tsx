import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import FormInput from "../../../util/components/Input/FormInput";
import useStepper from "../../../util/hooks/useStepper";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
import styles from "./MakePassword.module.scss";
import Form from "../../../util/components/Form/Form";
import { SetStateAction } from "react";

type MakePasswordProps = {
  stepper: ReturnType<typeof useStepper>;
  header?: string;
  setPassword: React.Dispatch<SetStateAction<string>>;
};

const MakePassword = ({
  stepper: { step, nextStep, prevStep },
  header = "",
  setPassword,
}: MakePasswordProps) => {
  type FormInput = {
    password: string;
  };

  const schema = yup.object().shape({
    password: yup
      .string()
      .required("Please enter a password.")
      .min(
        8,
        "Your password needs to be at least 8 characters. Please enter a longer one."
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

  const onSubmit: SubmitHandler<FormInput> = ({ password }) => {
    setPassword(password);
    nextStep();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        header={
          <StepHeader step={step} onPrevStepClick={prevStep}>
            {header}
          </StepHeader>
        }
        footer={<NextStepButton isDisabled={!isValid} />}
      >
        <div className={styles.MakePassword}>
          <h1>You'll need a password</h1>
          <span className={styles.Info}>
            Make sure it's 8 characters or more.
          </span>
          <FormInput
            autofocus
            name="password"
            placeholder="Password"
            control={control}
            type="password"
          />
        </div>
      </Minipage>
    </Form>
  );
};

export default MakePassword;
