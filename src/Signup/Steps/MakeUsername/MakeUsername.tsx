import { yupResolver } from "@hookform/resolvers/yup";
import { SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { GetUsernameExists } from "../../../../backend/src/api/user";
import Form from "../../../util/components/Form/Form";
import FormInput from "../../../util/components/Input/FormInput";
import useRequest from "../../../util/hooks/useRequest";
import useStepper from "../../../util/hooks/useStepper";
import Minipage from "../../../util/layouts/Minipage/Minipage";
import yup, { yupSequentialStringSchema } from "../../../util/yup";
import NextStepButton from "../NextStepButton";
import StepHeader from "../StepHeader";
import styles from "./MakeUsername.module.scss";

interface MakeUsernameProps {
  stepper: ReturnType<typeof useStepper>;
  header?: string;
  setUsername: React.Dispatch<SetStateAction<string>>;
  setPerformRegistration: React.Dispatch<SetStateAction<boolean>>;
}

const MakeUsername = ({
  stepper: { step, prevStep },
  header = "",
  setUsername,
  setPerformRegistration,
}: MakeUsernameProps) => {
  type FormInput = {
    username: string;
  };

  const onSubmit: SubmitHandler<FormInput> = ({ username }) => {
    setUsername(username);
    setPerformRegistration(true);
  };

  const { getData } = useRequest();

  const { refetch } = useQuery<GetUsernameExists["response"]>(
    ["usernameExists"],
    () => {
      return getData("user/usernameExists/" + getValues("username"));
    },
    { enabled: false }
  );

  const schema: any = yup.object().shape({
    username: yupSequentialStringSchema([
      yup
        .string()
        .required("Please enter a username.")
        .max(15, "Your username cannot be longer than 15 characters.")
        .matches(
          /^\w*$/,
          "Your usename can only contain alphanumeric characters and underscores."
        )
        .test(
          "reservedWords",
          'Your username cannot include the words "admin" or "twitter."',
          (username) => {
            const lowerCaseUsername = username!.toLowerCase();
            return (
              !lowerCaseUsername.includes("admin") &&
              !lowerCaseUsername.includes("twitter")
            );
          }
        ),
      yup
        .string()
        .test(
          "usernameExists",
          "That username has been taken. Please choose another.",
          async () => {
            const res = await refetch();
            return !res.data?.data?.usernameExists;
          }
        ),
    ]),
  });

  const form = useForm<FormInput>({
    defaultValues: {
      username: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
    getValues,
  } = form;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        header={
          <StepHeader step={step} onPrevStepClick={prevStep}>
            {header}
          </StepHeader>
        }
        footer={
          <NextStepButton color="primary" isDisabled={!isValid}>
            Sign up
          </NextStepButton>
        }
      >
        <div className={styles.MakeUsername}>
          <h1>What should we call you?</h1>
          <span className={styles.Info}>
            Your @ username is unique. You can always change it later.
          </span>
          <FormInput
            autofocus
            name="username"
            placeholder="Usename"
            control={control}
            leader="@"
            showStatusIcon
          />
        </div>
      </Minipage>
    </Form>
  );
};

export default MakeUsername;
