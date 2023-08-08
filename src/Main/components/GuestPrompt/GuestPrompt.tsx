import { useState } from "react";
import Login from "../../../Login/Login";
import Signup from "../../../Signup/Signup";
import Terms from "../../../Signup/Terms/Terms";
import Button from "../../../util/components/Button/Button";
import Modal, { openModalHandler } from "../../../util/components/Modal/Modal";
import styles from "./GuestPrompt.module.scss";

interface GuestPromptProps {}

const GuestPrompt = ({}: GuestPromptProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [willSignup, setWillSignup] = useState(false);

  const handleClick = (signup: boolean) => {
    openModalHandler({ setIsModalOpen });
    setWillSignup(signup);
  };

  return (
    <>
      {isModalOpen && (
        <Modal withCloseIcon={false} setIsActive={setIsModalOpen}>
          {willSignup ? <Signup /> : <Login />}
        </Modal>
      )}
      <div className={styles.GuestPrompt}>
        <h2>New to Twitter?</h2>
        <span className={styles.Text}>
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
        <Terms length="short" extraStyles={[styles.Text]} />
      </div>
    </>
  );
};

export default GuestPrompt;
