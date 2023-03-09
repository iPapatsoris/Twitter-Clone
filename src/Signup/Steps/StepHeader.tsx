import { useContext } from "react";
import { ModalContext } from "../../util/components/Modal/Modal";
import styles from "./StepHeader.module.scss";
import closeIcon from "../../assets/icons/close.png";
import leftArrowIcon from "../../assets/icons/left-arrow.png";
import Icon from "../../util/components/Icon/Icon";

interface StepHeaderProps {
  step: number;
  onPrevStepClick: VoidFunction;
  children: string;
}

const StepHeader = ({ children, step, onPrevStepClick }: StepHeaderProps) => {
  const { setIsActive } = useContext(ModalContext);

  const navIcon = !step ? closeIcon : leftArrowIcon;
  const onNavIconClick = () => {
    if (!step) {
      setIsActive(false);
    } else {
      onPrevStepClick();
    }
  };

  return (
    <div className={styles.StepHeader}>
      <div className={styles.NavIcon} onClick={onNavIconClick}>
        <Icon src={navIcon} />
      </div>
      <div className={styles.Title}>{children}</div>
    </div>
  );
};

export default StepHeader;
