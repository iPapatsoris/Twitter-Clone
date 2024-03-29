import { yupResolver } from "@hookform/resolvers/yup";
import React, { SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  GetUsernameExists,
  charLimits,
} from "../../../../backend/src/api/user";
import Form from "../../../util/components/Form/Form";
import FormInput from "../../../util/components/Input/FormInput";
import useStepper from "../../../util/hooks/useStepper";
import { MinipageProps } from "../../../util/layouts/Minipage/Minipage";
import yup, { yupSequentialStringSchema } from "../../../util/yup";
import NextStepButton from "../NextStepButton";
import styles from "./MakeUsername.module.scss";
import { getData } from "../../../util/request";

interface MakeUsernameProps {
  stepper: ReturnType<typeof useStepper>;
  minipage?: React.ReactElement<MinipageProps>;
  setUsername: React.Dispatch<SetStateAction<string>>;
  setPerformRegistration: React.Dispatch<SetStateAction<boolean>>;
}

const MakeUsername = ({
  minipage,
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

  const { refetch } = useQuery<GetUsernameExists["response"]>({
    queryKey: ["usernameExists"],
    queryFn: () => {
      return getData("user/usernameExists/" + getValues("username"));
    },
    enabled: false,
  });

  const schema: any = yup.object().shape({
    username: yupSequentialStringSchema([
      yup
        .string()
        .required("Please enter a username.")
        .max(
          charLimits.username,
          "Your username cannot be longer than 15 characters."
        )
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

  if (!minipage) {
    return null;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {React.cloneElement(minipage, {
        footer: (
          <NextStepButton color="primary" isDisabled={!isValid}>
            Sign up
          </NextStepButton>
        ),
        children: (
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
        ),
      })}
    </Form>
  );
};

export default MakeUsername;
