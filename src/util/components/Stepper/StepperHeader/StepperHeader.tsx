import { useContext } from "react";
import Icon from "../../Icon/Icon";
import closeIcon from "../../../../assets/icons/close.png";
import leftArrowIcon from "../../../../assets/icons/left-arrow.png";
import { ModalContext } from "../../Modal/Modal";
import styles from "./StepperHeader.module.scss";

interface StepperHeaderProps {
  step: number;
  onPrevStepClick: VoidFunction;
  header: string;
}

const StepperHeader = ({
  header,
  step,
  onPrevStepClick,
}: StepperHeaderProps) => {
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
    <div className={styles.Header}>
      <div className={styles.NavIcon} onClick={onNavIconClick}>
        <Icon src={navIcon} />
      </div>
      <div className={styles.Title}>{header}</div>
    </div>
  );
};

export default StepperHeader;
