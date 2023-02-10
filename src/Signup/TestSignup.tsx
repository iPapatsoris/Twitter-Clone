import { useState } from "react";
import Modal, { openModalHandler } from "../util/components/Modal/Modal";
import SignupHeader from "./SingupHeader/SignupHeader";
import Signup from "./Signup";

interface TestSignupProps {}

const TestSignup = ({}: TestSignupProps) => {
  const [showModal, setShowModal] = useState(false);
  console.log(showModal);

  return (
    <>
      {showModal && (
        <Modal header={<SignupHeader />} setShowModal={setShowModal}>
          <Signup />
        </Modal>
      )}
      <div>
        <button
          onClick={(e: any) =>
            openModalHandler({
              e,
              isOpenModal: showModal,
              setIsOpenModal: setShowModal,
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
