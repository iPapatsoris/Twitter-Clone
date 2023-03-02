import { useState } from "react";
import { Link } from "react-router-dom";
import Signup from "../../../Signup/Signup";
import Button from "../../../util/components/Button/Button";
import Modal, { openModalHandler } from "../../../util/components/Modal/Modal";
import paths from "../../../util/paths";
import styles from "./GuestPrompt.module.scss";

interface GuestPromptProps {}

const GuestPrompt = ({}: GuestPromptProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    openModalHandler({ setIsModalOpen });
  };

  return (
    <>
      {isModalOpen && (
        <Modal withCloseIcon={false} setIsActive={setIsModalOpen}>
          <Signup />
        </Modal>
      )}
      <div className={styles.GuestPrompt}>
        <h2>New to Twitter?</h2>
        <span className={styles.Text}>
          Sign up now to get your own personalized timeline!
        </span>
        <Button size="medium" stretch color="white" onClick={handleClick}>
          Create account
        </Button>
        <div className={styles.Text}>
          By signing up, you agree to the{" "}
          <Link to={paths.tos}> Terms of Service </Link>and{" "}
          <Link to={paths.privacy}>Privacy Policy,</Link> including{" "}
          <Link to={paths.cookies}>Cookie Use.</Link>
        </div>
      </div>
    </>
  );
};

export default GuestPrompt;
