import Button from "../util/components/Button/Button";
import Dropdown from "../util/components/Dropdown/Dropdown";
import Input from "../util/components/Input/Input";
import styles from "./Signup.module.scss";

interface SignupProps {}

const Signup = ({}: SignupProps) => {
  // TODO: use moment.js
  const months: React.ComponentProps<typeof Dropdown>["options"] = [
    { value: "1", text: "January" },
    { value: "2", text: "February" },
  ];
  return (
    <div className={styles.Signup}>
      {/* <div className={styles.Header}>Step 1 of 5</div> */}
      <h1>Create your account</h1>
      <div className={styles.Form}>
        <div className={styles.NameEmail}>
          <Input placeholder="Name" characterLimit={50} />
          <Input placeholder="Email" />
        </div>
        <div>
          <h4>Date of birth</h4>
          <div className={styles.DateOfBirth}>
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, a pet, or something else.
          </div>
          <div className={styles.Dropdowns}>
            <Dropdown
              name="Month"
              options={months}
              extraStyles={[styles.Dropdown]}
            />
            <Dropdown
              name="Month"
              options={months}
              extraStyles={[styles.Dropdown]}
            />
          </div>
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
  );
};

export default Signup;
