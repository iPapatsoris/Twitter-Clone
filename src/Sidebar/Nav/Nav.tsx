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
import { useLocation } from "react-router-dom";

import NavItem from "./NavItem";
import paths, { isNotificationsPage } from "../../util/paths";

const Nav = () => {
  const path = useLocation().pathname;
  return (
    <nav>
      <NavItem
        icon={path === paths.home ? homeIconActive : homeIcon}
        title="Home"
        path={paths.home}
        isActive={path === paths.home}
      />
      <NavItem
        icon={path === paths.explore ? exploreIconActive : exploreIcon}
        title="Explore"
        path={paths.explore}
        isActive={path === paths.explore}
      />
      <NavItem
        icon={
          isNotificationsPage(path) ? notificationIconActive : notificationIcon
        }
        title="Notifications"
        path={paths.notifications.self}
        isActive={isNotificationsPage(path)}
      />
      <NavItem
        icon={path === paths.messages ? messageIconActive : messageIcon}
        title="Messages"
        path={paths.messages}
        isActive={path === paths.messages}
      />
      <NavItem
        icon={path === paths.bookmarks ? bookmarkIconActive : bookmarkIcon}
        title="Bookmarks"
        path={paths.bookmarks}
        isActive={path === paths.bookmarks}
      />
      <NavItem
        icon={path === paths.lists ? listIconActive : listIcon}
        title="Lists"
        path={paths.lists}
        isActive={path === paths.lists}
      />
      <NavItem
        icon={path === paths.profile ? profileIconActive : profileIcon}
        title="Profile"
        path={paths.profile}
        isActive={path === paths.profile}
      />
      <NavItem icon={moreIcon} title="More" isPopup />
    </nav>
  );
};

export default Nav;
