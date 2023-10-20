import Terms from "../../../Signup/Terms/Terms";
import Button from "../../../util/components/Button/Button";
import styles from "./GuestPrompt.module.scss";
import { useNavigate } from "react-router-dom";
import { getPagePath } from "../../../util/paths";

const GuestPrompt = () => {
  const navigate = useNavigate();

  const handleClick = (signup: boolean) => {
    navigate(getPagePath("welcome"), { state: signup ? "signup" : "login" });
  };

  return (
    <>
      <div className={styles.GuestPrompt}>
        <h2>New to Twitter?</h2>
        <span className={[styles.LightColor, styles.SmallText].join(" ")}>
          Sign up now to get your own personalized timeline!
        </span>
        <Button
          size="medium"
          stretch
          color="white"
          onClick={() => handleClick(true)}
        >
          Create account
        </Button>
        <Button
          size="medium"
          stretch
          color="white"
          onClick={() => handleClick(false)}
        >
          Sign in
        </Button>
        <Terms
          length="short"
          extraStyles={[styles.LightColor, styles.SmallText]}
        />
      </div>
    </>
  );
};

export default GuestPrompt;
