import { useContext } from "react";
import Icon from "../../util/components/Icon/Icon";
import closeIcon from "../../assets/icons/close.png";
import leftArrowIcon from "../../assets/icons/left-arrow.png";
import { ModalContext } from "../../util/components/Modal/Modal";
import styles from "../SingupHeader/SingupHeader.module.scss";

interface SignupHeaderProps {
  stepper: {
    step: number;
    prevStep: VoidFunction;
  };
  header: string;
}

const SignupHeader = ({
  header,
  stepper: { step, prevStep },
}: SignupHeaderProps) => {
  const { setIsActive } = useContext(ModalContext);

  const navIcon = !step ? closeIcon : leftArrowIcon;
  const onNavIconClick = () => {
    if (!step) {
      setIsActive(false);
    } else {
      prevStep();
    }
  };

  return (
    <div className={styles.Header}>
      <div className={styles.NavIcon} onClick={onNavIconClick}>
        <Icon src={navIcon} />
      </div>
      <div className={styles.Title}>{header}</div>
    </div>
  );
};

export default SignupHeader;
