import { Link } from "react-router-dom";
import Icon from "../../util/components/Icon/Icon";
import MoreOptionsNavItem from "./MoreOptionsNavItem/MoreOptionsNavItem";
import styles from "./Nav.module.scss";
interface NavItemProps {
  icon: string;
  title: string;
  alt: string;
  path?: string;
  isActive?: boolean;
  isPopup?: boolean;
}

const NavItem = ({
  icon,
  title,
  alt,
  path = "/error",
  isActive = false,
  isPopup = false,
}: NavItemProps) => {
  const navItemClass = [styles.BiggerText, isActive ? styles.Bold : ""].join(
    " "
  );

  const item = (
    <div className={styles.NavItem}>
      <div className={styles.IconAndTitle}>
        <Icon src={icon} extraStyles={[styles.Icon]} hover="none" alt={alt} />
        <span className={navItemClass}>{title}</span>
      </div>
    </div>
  );

  return isPopup ? (
    <MoreOptionsNavItem>{item}</MoreOptionsNavItem>
  ) : (
    <Link to={path}>{item}</Link>
  );
};

export default NavItem;
