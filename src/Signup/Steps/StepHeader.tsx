import { useContext } from "react";
import { ModalContext } from "../../util/components/Modal/Modal";
import styles from "./StepHeader.module.scss";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ReactComponent as LeftArrowIcon } from "../../assets/icons/left-arrow.svg";
import Icon from "../../util/components/Icon/Icon";

interface StepHeaderProps {
  step: number;
  onPrevStepClick: VoidFunction;
  children: string;
}

const StepHeader = ({ children, step, onPrevStepClick }: StepHeaderProps) => {
  const { setIsActive } = useContext(ModalContext);

  const navIcon = !step ? CloseIcon : LeftArrowIcon;
  const onNavIconClick = () => {
    if (!step) {
      setIsActive(false);
    } else {
      onPrevStepClick();
    }
  };

  return (
    <>
      <div className={styles.NavIcon} onClick={onNavIconClick}>
        <Icon src={navIcon} noBlockMargin noInlineMargin />
      </div>
      <div className={styles.StepHeader}>
        <div>{children}</div>
      </div>
    </>
  );
};

export default StepHeader;
