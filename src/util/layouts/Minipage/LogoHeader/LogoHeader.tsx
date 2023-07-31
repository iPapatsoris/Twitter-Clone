import styles from "./LogoHeader.module.scss";
import closeIcon from "../../../../assets/icons/close.png";
import logoIcon from "../../../../assets/logo.png";
import Icon from "../../../components/Icon/Icon";

interface LogoHeaderProps {
  onNavIconClick: VoidFunction;
}

const LogoHeader = ({ onNavIconClick }: LogoHeaderProps) => {
  return (
    <>
      <Icon
        src={closeIcon}
        extraWrapperStyles={[styles.NavIcon]}
        onClick={onNavIconClick}
      />
      <div className={styles.Logo}>
        <Icon src={logoIcon} size={24} hover="none" />
      </div>
    </>
  );
};

export default LogoHeader;
