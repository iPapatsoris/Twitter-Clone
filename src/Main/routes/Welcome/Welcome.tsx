import Icon from "../../../util/components/Icon/Icon";
import styles from "./Welcome.module.scss";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import Button from "../../../util/components/Button/Button";
import { Link, useLocation } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useEffect, useState } from "react";
import useWindowDimensions from "../../../util/hooks/useWindowDimensions";
import Modal from "../../../util/components/Modal/Modal";
import Signup from "../../../Signup/Signup";
import Login from "../../../Login/Login";

const Welcome = () => {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const { state: routerState } = useLocation();

  const { isMobile, isTablet } = useWindowDimensions();
  const isSmallScreen = isMobile || isTablet;
  const showWelcomePage =
    !isSmallScreen || (isSmallScreen && !login && !signup);

  // Open login or signup modal when sent here from another page
  useEffect(() => {
    if (routerState === "login") {
      setLogin(true);
    } else if (routerState === "signup") {
      setSignup(true);
    }
  }, [routerState]);

  const loginSignup = (
    <Modal setIsActive={login ? setLogin : setSignup}>
      {signup ? (
        <Signup removeSignup={() => setSignup(false)} />
      ) : (
        <Login removeLogin={() => setLogin(false)} />
      )}
    </Modal>
  );

  const welcomePage = (
    <div className={styles.Welcome}>
      <Icon
        src={Logo}
        size={!isMobile && !isTablet ? 340 : 100}
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
            onClick={() => setSignup(true)}
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
            onClick={() => setLogin(true)}
            extraClasses={[styles.Button]}
            color="white"
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {(login || signup) && loginSignup}
      {showWelcomePage && welcomePage}
    </>
  );
};

export default Welcome;
