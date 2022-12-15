import "./Nav.scss";
import homeIcon from "../../assets/icons/nav/home.png";
import homeIconActive from "../../assets/icons/nav/home-active.png";
import exploreIcon from "../../assets/icons/nav/hashtag.png";
import exploreIconActive from "../../assets/icons/nav/hashtag-active.png";
import notificationIcon from "../../assets/icons/nav/bell.png";
import notificationIconActive from "../../assets/icons/nav/bell-active.png";
import messageIcon from "../../assets/icons/nav/mail.png";
import messageIconActive from "../../assets/icons/nav/mail-active.png";
import moreIcon from "../../assets/icons/nav/more.png";
import bookmarkIcon from "../../assets/icons/nav/bookmark.png";
import bookmarkIconActive from "../../assets/icons/nav/bookmark-active.png";
import profileIcon from "../../assets/icons/nav/user.png";
import profileIconActive from "../../assets/icons/nav/user-active.png";
import listIcon from "../../assets/icons/nav/list.png";
import listIconActive from "../../assets/icons/nav/list-active.png";

import NavItem from "./NavItem";

const Nav = () => {
  return (
    <nav>
      <NavItem icon={homeIcon} title="Home" isActive={true} />
      <NavItem icon={exploreIcon} title="Explore" />
      <NavItem icon={notificationIcon} title="Notifications" />
      <NavItem icon={messageIcon} title="Messages" />
      <NavItem icon={bookmarkIcon} title="Bookmarks" />
      <NavItem icon={listIcon} title="Lists" />
      <NavItem icon={profileIcon} title="Profile" />
      <NavItem icon={moreIcon} title="More" />
    </nav>
  );
};

export default Nav;
