import { useContext } from "react";
import Modal, { openModalHandler } from "../util/components/Modal/Modal";
import SignupHeader from "./SingupHeader/SignupHeader";
import Signup from "./Signup";
import { PopupContext } from "../App";

interface TestSignupProps {}

const TestSignup = ({}: TestSignupProps) => {
  const { isModalOpen, setIsModalOpen } = useContext(PopupContext);

  return (
    <>
      {isModalOpen && (
        <Modal header={<SignupHeader />}>
          <Signup />
        </Modal>
      )}
      <div>
        <button
          onClick={(e: any) =>
            openModalHandler({
              e,
              isModalOpen,
              setIsModalOpen,
            })
          }
        >
          Sign up
        </button>
      </div>
    </>
  );
};

export default TestSignup;
