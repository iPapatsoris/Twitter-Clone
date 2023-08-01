import styles from "./LogoHeader.module.scss";
import { ReactComponent as CloseIcon } from "../../../../assets/icons/close.svg";
import { ReactComponent as LogoIcon } from "../../../../assets/logo.svg";
import Icon from "../../../components/Icon/Icon";

interface LogoHeaderProps {
  onNavIconClick: VoidFunction;
}

const LogoHeader = ({ onNavIconClick }: LogoHeaderProps) => {
  return (
    <>
      <Icon
        src={CloseIcon }
        extraWrapperStyles={[styles.NavIcon]}
        onClick={onNavIconClick}
      />
      <div className={styles.Logo}>
        <Icon src={LogoIcon } size={24} hover="none" />
      </div>
    </>
  );
};

export default LogoHeader;
