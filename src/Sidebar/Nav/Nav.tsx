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
import settingsIcon from "../../assets/icons/settings.png";
import settingsIconActive from "../../assets/icons/nav/settings-active.png";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import paths, { isNotificationsPage } from "../../util/paths";
import { useAuth } from "../../util/hooks/useAuth";

const Nav = () => {
  const path = useLocation().pathname;
  const { user } = useAuth();

  const explore = (
    <NavItem
      icon={path === paths.explore ? exploreIconActive : exploreIcon}
      title="Explore"
      alt="Explore"
      path={paths.explore}
      isActive={path === paths.explore}
    />
  );

  const guestNav = (
    <>
      {explore}
      <NavItem
        icon={path === paths.settings ? settingsIconActive : settingsIcon}
        title="Settings"
        alt="Settings"
        path={paths.settings}
        isActive={path === paths.settings}
      />
    </>
  );

  return (
    <nav>
      {!user ? (
        guestNav
      ) : (
        <>
          <NavItem
            icon={path === paths.home ? homeIconActive : homeIcon}
            title="Home"
            alt="Home"
            path={paths.home}
            isActive={path === paths.home}
          />
          {explore}
          <NavItem
            icon={
              isNotificationsPage(path)
                ? notificationIconActive
                : notificationIcon
            }
            title="Notifications"
            alt="Notifications"
            path={paths.notifications.self}
            isActive={isNotificationsPage(path)}
          />
          <NavItem
            icon={path === paths.messages ? messageIconActive : messageIcon}
            title="Messages"
            alt="Messages"
            path={paths.messages}
            isActive={path === paths.messages}
          />
          <NavItem
            icon={path === paths.bookmarks ? bookmarkIconActive : bookmarkIcon}
            title="Bookmarks"
            alt="Bookmarks"
            path={paths.bookmarks}
            isActive={path === paths.bookmarks}
          />
          <NavItem
            icon={path === paths.lists ? listIconActive : listIcon}
            title="Lists"
            alt="Lists"
            path={paths.lists}
            isActive={path === paths.lists}
          />
          <NavItem
            icon={path === paths.profile ? profileIconActive : profileIcon}
            title="Profile"
            alt="Profile"
            path={paths.profile}
            isActive={path === paths.profile}
          />
          <NavItem icon={moreIcon} title="More" alt="More options" isPopup />
        </>
      )}
    </nav>
  );
};

export default Nav;
