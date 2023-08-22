import { SetStateAction } from "react";
import Login from "../../../Login/Login";
import Signup from "../../../Signup/Signup";
import useWindowDimensions from "../../../util/hooks/useWindowDimensions";
import Modal from "../../../util/components/Modal/Modal";

interface LoginSignupProps {
  login: boolean;
  signup: boolean;
  setLogin: React.Dispatch<SetStateAction<boolean>>;
  setSignup: React.Dispatch<SetStateAction<boolean>>;
}

const LoginSignup = ({
  login,
  signup,
  setLogin,
  setSignup,
}: LoginSignupProps) => {
  const { isMobile } = useWindowDimensions();

  const loginOrSignup = login ? (
    <Login removeLogin={() => setLogin(false)} />
  ) : (
    <Signup />
  );

  let finalLoginOrSignup = null;
  if (login || signup) {
    finalLoginOrSignup = isMobile ? (
      loginOrSignup
    ) : (
      <Modal withCloseIcon={false} setIsActive={login ? setLogin : setSignup}>
        {loginOrSignup}
      </Modal>
    );
  }

  return finalLoginOrSignup;
};

export default LoginSignup;
