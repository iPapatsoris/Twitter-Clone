import { Link } from "react-router-dom";
import Icon from "../../util/components/Icon/Icon";
import styles from "./Nav.module.scss";
interface NavItem {
  icon: string;
  title: string;
  path?: string;
  isActive?: boolean;
  isPopup?: boolean;
}

const NavItem = ({
  icon,
  title,
  path = "/error",
  isActive = false,
  isPopup = false,
}: NavItem) => {
  const navItemClass = [styles.BiggerText, isActive ? styles.Bold : ""].join(
    " "
  );

  const item = (
    <div className={styles.IconAndTitleWrapper}>
      <div className={styles.IconAndTitle}>
        <Icon src={icon} size="large" hoverBg="none" />
        <span className={navItemClass}>{title}</span>
      </div>
    </div>
  );

  return isPopup ? <div>{item}</div> : <Link to={path}>{item}</Link>;
};

export default NavItem;
