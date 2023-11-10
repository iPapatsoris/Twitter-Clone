import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginUser } from "../../backend/src/api/auth";
import Button from "../util/components/Button/Button";
import Form from "../util/components/Form/Form";
import { ModalContext } from "../util/components/Modal/Modal";
import FormInput from "../util/components/Input/FormInput";
import LogoHeader from "../util/layouts/Minipage/LogoHeader/LogoHeader";
import Minipage from "../util/layouts/Minipage/Minipage";
import yup from "../util/yup";
import styles from "./Login.module.scss";
import { postData } from "../util/request";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import {
  mediumPreviewProfileFields,
  profileKeys,
} from "../Main/routes/Profile/ProfileFace/queries";
import { useAuthStoreActions } from "../store/AuthStore";

const Login = ({ removeLogin }: { removeLogin: VoidFunction }) => {
  const { setLoggedInUser } = useAuthStoreActions();
  const queryClient = useQueryClient();

  const { mutate, isLoading, data } = useMutation<
    LoginUser["response"],
    unknown,
    LoginUser["request"]
  >(["login"], (body) => postData("auth/login", body), {
    onSuccess: (data) => {
      if (data.data) {
        setLoggedInUser(data.data.user);
        queryClient.prefetchQuery(
          profileKeys
            .username(data.data.user.username)
            ._ctx.fields(mediumPreviewProfileFields)
        );
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
  const { isMobile, isTablet } = useWindowDimensions();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Minipage
        header={
          <LogoHeader
            onNavIconClick={
              isMobile || isTablet ? removeLogin : () => setIsActive(false)
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
            isLoading={isLoading}
          >
            Sign in
          </Button>
        }
      >
        <div className={styles.Login}>
          <h1>Sign in to Twitter</h1>
          <div className={styles.Form}>
            <FormInput
              autofocus
              name="email"
              placeholder="Email"
              control={control}
              autocomplete="email"
            />
            <FormInput
              name="password"
              placeholder="Password"
              control={control}
              type="password"
              autocomplete="current-password"
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
