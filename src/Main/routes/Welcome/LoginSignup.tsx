import { SetStateAction } from "react";
import Login from "../../../Login/Login";
import Signup from "../../../Signup/Signup";
import Modal from "../../../util/components/Modal/Modal";

interface LoginSignupProps {
  login: boolean;
  signup: boolean;
  setLogin: React.Dispatch<SetStateAction<boolean>>;
  setSignup: React.Dispatch<SetStateAction<boolean>>;
  isSmallScreen: boolean;
}

const LoginSignup = ({
  login,
  signup,
  setLogin,
  setSignup,
  isSmallScreen,
}: LoginSignupProps) => {
  const loginOrSignup = login ? (
    <Login removeLogin={() => setLogin(false)} />
  ) : (
    <Signup removeSignup={() => setSignup(false)} />
  );

  let finalLoginOrSignup = null;
  if (login || signup) {
    finalLoginOrSignup = isSmallScreen ? (
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
