import { Link } from "react-router-dom";
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
  const navItemClass = "BiggerText " + (isActive && "Bold");
  const item = (
    <div className="IconAndTitleWrapper">
      <div className="IconAndTitle">
        <img src={icon} />
        <span className={navItemClass}>{title}</span>
      </div>
    </div>
  );

  return isPopup ? <div>{item}</div> : <Link to={path}>{item}</Link>;
};

export default NavItem;
