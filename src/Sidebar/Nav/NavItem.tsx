import { Link, useLocation } from "react-router-dom";
import Icon from "../../util/components/Icon/Icon";
import { getPagePath } from "../../util/paths";
import MoreOptionsNavItem from "./MoreOptionsNavItem/MoreOptionsNavItem";
import styles from "./Nav.module.scss";
interface NavItemProps {
  icon: string;
  iconActive?: string;
  title: string;
  path?: string;
  isPopup?: boolean;
}

const NavItem = ({
  icon,
  iconActive,
  title,
  path: itemPath = getPagePath("error"),
  isPopup = false,
}: NavItemProps) => {
  const currentPath = useLocation().pathname;
  const isActive = itemPath === currentPath;
  const navItemClass = [styles.BiggerText, isActive ? styles.Bold : ""].join(
    " "
  );

  const item = (
    <div className={styles.NavItem}>
      <div className={styles.IconAndTitle}>
        <Icon
          src={isActive && iconActive ? iconActive : icon}
          extraStyles={[styles.Icon]}
          hover="none"
          alt={title}
        />
        <span className={navItemClass}>{title}</span>
      </div>
    </div>
  );

  return isPopup ? (
    <MoreOptionsNavItem>{item}</MoreOptionsNavItem>
  ) : (
    <Link to={itemPath}>{item}</Link>
  );
};

export default NavItem;
