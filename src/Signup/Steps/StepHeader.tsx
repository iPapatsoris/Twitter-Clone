import styles from "./StepHeader.module.scss";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ReactComponent as LeftArrowIcon } from "../../assets/icons/left-arrow.svg";
import Icon from "../../util/components/Icon/Icon";

interface StepHeaderProps {
  step: number;
  onPrevStepClick: VoidFunction;
  existStepper: VoidFunction;
  children: string;
}

const StepHeader = ({
  existStepper,
  children,
  step,
  onPrevStepClick,
}: StepHeaderProps) => {
  const navIcon = !step ? CloseIcon : LeftArrowIcon;
  const onNavIconClick = () => {
    if (!step) {
      existStepper();
    } else {
      onPrevStepClick();
    }
  };

  return (
    <>
      <div className={styles.NavIcon} onClick={onNavIconClick}>
        <Icon src={navIcon} noInlineMargin />
      </div>
      <div className={[styles.StepHeader, styles.BiggestText].join(" ")}>
        <div>{children}</div>
      </div>
    </>
  );
};

export default StepHeader;
