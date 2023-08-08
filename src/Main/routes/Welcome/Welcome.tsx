import Icon from "../../../util/components/Icon/Icon";
import styles from "./Welcome.module.scss";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import Button from "../../../util/components/Button/Button";
import { Link } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useState } from "react";
import Modal from "../../../util/components/Modal/Modal";
import Login from "../../../Login/Login";
import Signup from "../../../Signup/Signup";

interface WelcomeProps {}

const Welcome = ({}: WelcomeProps) => {
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);

  return (
    <>
      {(loginModal || signupModal) && (
        <Modal
          withCloseIcon={false}
          setIsActive={loginModal ? setLoginModal : setSignupModal}
        >
          {loginModal ? <Login /> : <Signup />}
        </Modal>
      )}
      <div className={styles.Welcome}>
        <Icon
          src={Logo}
          size={340}
          extraWrapperStyles={[styles.Logo]}
          title="Twitter"
          alt="Twitter logo"
          hover="none"
          noCursorPointer
        />
        <h1 className={styles.Title}>Happening now</h1>
        <div className={styles.Join}>
          <h2>Join today.</h2>
          <div className={styles.JoinWrapper}>
            <Button
              onClick={() => setSignupModal(true)}
              extraClasses={[styles.Button]}
              color="primary"
            >
              Create account
            </Button>
            <span className={[styles.LightColor, styles.Terms].join(" ")}>
              By signing up, you agree to the{" "}
              <Link to={getPagePath("tos")}>Terms of Service </Link>and{" "}
              <Link to={getPagePath("privacy")}>Privacy Policy</Link>, including{" "}
              <Link to={getPagePath("cookies")}>Cookie Use</Link>.
            </span>
          </div>
          <div className={styles.AlreadyAccount}>
            <span>Already have an account?</span>
            <Button
              onClick={() => setLoginModal(true)}
              extraClasses={[styles.Button]}
              color="white"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
