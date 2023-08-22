import Icon from "../../../util/components/Icon/Icon";
import styles from "./Welcome.module.scss";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import Button from "../../../util/components/Button/Button";
import { Link } from "react-router-dom";
import { getPagePath } from "../../../util/paths";
import { useState } from "react";
import useWindowDimensions from "../../../util/hooks/useWindowDimensions";
import LoginSignup from "./LoginSignup";

interface WelcomeProps {}

const Welcome = ({}: WelcomeProps) => {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const { isMobile, isTablet } = useWindowDimensions();

  const loginSignup = (
    <LoginSignup
      login={login}
      signup={signup}
      setSignup={setSignup}
      setLogin={setLogin}
    />
  );

  const showWelcomePage = !isMobile || (isMobile && !login && !signup);

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
      {loginSignup}
      {showWelcomePage && welcomePage}
    </>
  );
};

export default Welcome;
