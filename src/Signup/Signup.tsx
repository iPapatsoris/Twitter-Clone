import Button from "../util/components/Button/Button";
import Input from "../util/components/Input/Input";
import styles from "./Signup.module.scss";

interface SignupProps {}

const Signup = ({}: SignupProps) => {
  return (
    <div className={styles.Center}>
      <div className={styles.Signup}>
        <div className={styles.Header}>Step 1 of 5</div>
        <h1>Create your account</h1>
        <div className={styles.Form}>
          <div className={styles.NameEmail}>
            <Input placeholder="Name" characterLimit={50} />
            <Input placeholder="Email" />
          </div>
          <div>
            <h4>Date of birth</h4>
            <span>
              This will not be shown publicly. Confirm your own age, even if
              this account is for a business, a pet, or something else.
            </span>
          </div>
        </div>
        <Button
          size="large"
          largeFont
          extraClasses={[styles.Button]}
          color="black"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Signup;
