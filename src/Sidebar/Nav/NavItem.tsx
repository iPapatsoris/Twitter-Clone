import { Link, useLocation } from "react-router-dom";
import Icon, { IconProps } from "../../util/components/Icon/Icon";
import { getPagePath } from "../../util/paths";
import MoreOptionsNavItem from "./MoreOptionsNavItem/MoreOptionsNavItem";
import styles from "./Nav.module.scss";
import { ComponentProps, useState } from "react";
import useWindowDimensions from "../../util/hooks/useWindowDimensions";
interface NavItemProps {
  icon: ComponentProps<typeof Icon>["src"];
  iconActive?: ComponentProps<typeof Icon>["src"];
  alternativeActivePaths?: string[];
  title: string;
  path?: string;
  iconProps?: Partial<IconProps>;
  isPopup?: boolean;
}

const NavItem = ({
  icon,
  iconActive,
  alternativeActivePaths,
  title,
  path: itemPath = getPagePath("error"),
  isPopup = false,
  iconProps,
}: NavItemProps) => {
  const currentPath = useLocation().pathname;
  const isActive =
    itemPath === currentPath ||
    alternativeActivePaths?.some((page) => currentPath === page);
  const navItemClasses = [styles.BiggestText, isActive ? styles.Bold : ""];

  const { isSmallScreen, isPcBig } = useWindowDimensions();
  const [forceHover, setForceHover] = useState(false);

  const item = (
    <div
      className={styles.NavItem}
      onMouseEnter={() => setForceHover(true)}
      onMouseLeave={() => setForceHover(false)}
    >
      <Icon
        src={isActive && iconActive ? iconActive : icon}
        alt={title}
        {...iconProps}
        text={isPcBig ? title : ""}
        // noLeftMargin={isPcBig}
        size={26}
        hoverGap={14}
        hoverThroughBothIconAndText
        forceHover={forceHover}
        hover={isSmallScreen ? "none" : "normal"}
        textStyles={navItemClasses}
      />
    </div>
  );

  return isPopup ? (
    <MoreOptionsNavItem>{item}</MoreOptionsNavItem>
  ) : (
    <Link to={itemPath}>{item}</Link>
  );
};

export default NavItem;
