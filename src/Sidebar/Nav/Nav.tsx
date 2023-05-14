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
import NavItem from "./NavItem";
import { getPagePath } from "../../util/paths";
import { useAuthStore } from "../../store/AuthStore";

const Nav = () => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { username: state.loggedInUser.username }
  );

  let itemPath = getPagePath("explore");
  const explore = (
    <NavItem
      icon={exploreIcon}
      iconActive={exploreIconActive}
      title="Explore"
      path={itemPath}
    />
  );

  itemPath = getPagePath("settings");
  const guestNav = (
    <>
      {explore}
      <NavItem
        iconActive={settingsIconActive}
        icon={settingsIcon}
        title="Settings"
        path={itemPath}
      />
    </>
  );

  return (
    <nav>
      {!loggedInUser ? (
        guestNav
      ) : (
        <>
          <NavItem
            iconActive={homeIconActive}
            icon={homeIcon}
            title="Home"
            path={getPagePath("home")}
          />
          {explore}
          <NavItem
            iconActive={notificationIconActive}
            icon={notificationIcon}
            title="Notifications"
            path={getPagePath("notifications")}
          />
          <NavItem
            iconActive={messageIconActive}
            icon={messageIcon}
            title="Messages"
            path={getPagePath("messages")}
          />
          <NavItem
            iconActive={bookmarkIconActive}
            icon={bookmarkIcon}
            title="Bookmarks"
            path={getPagePath("bookmarks")}
          />
          <NavItem
            icon={listIcon}
            iconActive={listIconActive}
            title="Lists"
            path={getPagePath("lists", loggedInUser.username)}
          />
          <NavItem
            icon={profileIcon}
            iconActive={profileIconActive}
            title="Profile"
            path={getPagePath("profile", loggedInUser.username)}
          />
          <NavItem icon={moreIcon} title="More" isPopup />
        </>
      )}
    </nav>
  );
};

export default Nav;
