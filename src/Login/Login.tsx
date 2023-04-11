import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { LoginUser } from "../../backend/src/api/auth";
import Button from "../util/components/Button/Button";
import Form from "../util/components/Form/Form";
import { ModalContext } from "../util/components/Modal/Modal";
import FormInput from "../util/components/TextInput/FormTextInput";
import { useAuth } from "../util/hooks/useAuth";
import useRequest from "../util/hooks/useRequest";
import LogoHeader from "../util/layouts/Minipage/LogoHeader/LogoHeader";
import Minipage from "../util/layouts/Minipage/Minipage";
import yup from "../util/yup";
import styles from "./Login.module.scss";

const Login = () => {
  const { setUser } = useAuth();
  const { postData } = useRequest();
  const { mutate, isLoading } = useMutation<
    LoginUser["response"],
    unknown,
    LoginUser["request"]
  >(["login"], (body) => postData("auth/login", body), {
    onSuccess: (data) => {
      if (data.data) {
        setUser(data.data.user);
      }
    },
  });

  const schema: any = yup.object().shape({
    email: yup
      .string()
      .required("Please enter your email.")
      .email("Please enter a valid email."),
    password: yup.string().required(),
  });

  const form = useForm<LoginUser["request"]["user"]>({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        header={<LogoHeader onNavIconClick={() => setIsActive(false)} />}
        footer={
          <Button
            type="submit"
            size="large"
            largeFont
            color="primary"
            stretch
            disabled={!isValid}
            isLoading={isLoading}
          >
            Login
          </Button>
        }
        contentStyles={[styles.Wrapper]}
      >
        <div className={styles.Login}>
          <h1>Login</h1>
          <FormInput
            autofocus
            name="email"
            placeholder="Email"
            control={control}
          />
          <FormInput name="password" placeholder="Password" control={control} />
        </div>
      </Minipage>
    </Form>
  );
};

export default Login;
