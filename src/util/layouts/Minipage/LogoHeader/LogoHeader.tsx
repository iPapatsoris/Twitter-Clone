import styles from "./LogoHeader.module.scss";
import closeIcon from "../../../../assets/icons/close.png";
import logoIcon from "../../../../assets/logo.png";
import Icon from "../../../components/Icon/Icon";

interface LogoHeaderProps {
  onNavIconClick: VoidFunction;
}

const LogoHeader = ({ onNavIconClick }: LogoHeaderProps) => {
  return (
    <div className={styles.LogoHeader}>
      <div className={styles.NavIcon} onClick={onNavIconClick}>
        <Icon src={closeIcon} />
      </div>
      <div className={styles.Logo}>
        <Icon src={logoIcon} extraStyles={[styles.LogoSize]} hover="none" />
      </div>
    </div>
  );
};

export default LogoHeader;
