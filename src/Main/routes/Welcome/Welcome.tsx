import Icon from "../../../util/components/Icon/Icon";
import styles from "./Welcome.module.scss";
import { ReactComponent as Logo } from "../../../assets/logo.svg";
import Button from "../../../util/components/Button/Button";
import { Link } from "react-router-dom";
import { getPagePath } from "../../../util/paths";

interface WelcomeProps {}

const Welcome = ({}: WelcomeProps) => {
  return (
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
          <Button extraClasses={[styles.Button]} color="primary">
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
          <Button extraClasses={[styles.Button]} color="white">
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
