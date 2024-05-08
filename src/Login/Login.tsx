import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { LoginUser } from "../../backend/src/api/auth";
import Button from "../util/components/Button/Button";
import Form from "../util/components/Form/Form";
import { ModalContext } from "../util/components/Modal/Modal";
import FormInput from "../util/components/Input/FormInput";
import LogoHeader from "../util/layouts/Minipage/LogoHeader/LogoHeader";
import Minipage from "../util/layouts/Minipage/Minipage";
import yup from "../util/yup";
import styles from "./Login.module.scss";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import { useLoginMutation } from "../store/AuthStore";

const Login = ({ removeLogin }: { removeLogin: VoidFunction }) => {
  const { mutate, isPending, data } = useLoginMutation();
  const schema: any = yup.object().shape({
    username: yup.string().required("Please enter your username."),
    password: yup.string().required("Please enter your password"),
  });

  const form = useForm<LoginUser["request"]["user"]>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
    getValues,
  } = form;

  const onSubmit = () => {
    const loginInfo = getValues();
    mutate({ user: loginInfo });
  };

  const { setIsActive } = useContext(ModalContext);
  const { isSmallScreen } = useWindowDimensions();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        header={
          <LogoHeader
            onNavIconClick={
              isSmallScreen ? removeLogin : () => setIsActive(false)
            }
          />
        }
        footer={
          <Button
            type="submit"
            size="large"
            largeFont
            color="primary"
            stretch
            disabled={!isValid}
            isLoading={isPending}
          >
            Sign in
          </Button>
        }
      >
        <div className={styles.Login}>
          <h1>Sign in to Twitter</h1>
          <div className={styles.Form}>
            <FormInput
              autoFocus
              name="username"
              placeholder="Username"
              control={control}
              autoComplete="username"
            />
            <FormInput
              name="password"
              placeholder="Password"
              control={control}
              type="password"
              autoComplete="current-password"
            />
          </div>
          {data && !data.ok && (
            <span className={styles.Error}>
              Sorry, the credentials you provided are incorrect.
            </span>
          )}
        </div>
      </Minipage>
    </Form>
  );
};

export default Login;
