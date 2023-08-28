import { ReactComponent as HomeIcon } from "../../assets/icons/nav/home.svg";
import { ReactComponent as HomeIconActive } from "../../assets/icons/nav/home-active.svg";
import { ReactComponent as ExploreIcon } from "../../assets/icons/nav/search.svg";
import { ReactComponent as ExploreIconActive } from "../../assets/icons/nav/search-active.svg";
import { ReactComponent as NotificationIcon } from "../../assets/icons/nav/bell.svg";
import { ReactComponent as NotificationIconActive } from "../../assets/icons/nav/bell-active.svg";
import { ReactComponent as MessageIcon } from "../../assets/icons/nav/mail.svg";
import { ReactComponent as MessageIconActive } from "../../assets/icons/nav/mail-active.svg";
import { ReactComponent as MoreIcon } from "../../assets/icons/nav/more.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/icons/nav/bookmark.svg";
import { ReactComponent as BookmarkIconActive } from "../../assets/icons/nav/bookmark-active.svg";
import { ReactComponent as ProfileIcon } from "../../assets/icons/nav/user.svg";
import { ReactComponent as ProfileIconActive } from "../../assets/icons/nav/user-active.svg";
import { ReactComponent as ListIcon } from "../../assets/icons/nav/list.svg";
import { ReactComponent as ListIconActive } from "../../assets/icons/nav/list-active.svg";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ReactComponent as SettingsIconActive } from "../../assets/icons/nav/settings-active.svg";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import NavItem from "./NavItem";
import { getPagePath } from "../../util/paths";
import { useAuthStore } from "../../store/AuthStore";
import Icon from "../../util/components/Icon/Icon";
import { Link } from "react-router-dom";
import styles from "./Nav.module.scss";

const Nav = () => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { username: state.loggedInUser.username }
  );

  let itemPath = getPagePath("explore");
  const explore = (
    <NavItem
      icon={ExploreIcon}
      iconActive={ExploreIconActive}
      title="Explore"
      path={itemPath}
    />
  );

  itemPath = getPagePath("settings");
  const guestNav = (
    <>
      {explore}
      <NavItem
        iconActive={SettingsIconActive}
        icon={SettingsIcon}
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
          <Link className={styles.Logo} to={getPagePath("home")}>
            <Icon
              src={Logo}
              hover="primary"
              alt="Twitter logo"
              size={26}
              hoverGap={14}
            />
          </Link>
          <NavItem
            iconActive={HomeIconActive}
            icon={HomeIcon}
            title="Home"
            path={getPagePath("home")}
          />
          {explore}
          <NavItem
            iconActive={NotificationIconActive}
            icon={NotificationIcon}
            title="Notifications"
            path={getPagePath("notifications")}
          />
          <NavItem
            iconActive={MessageIconActive}
            icon={MessageIcon}
            title="Messages"
            path={getPagePath("messages")}
          />
          <NavItem
            iconActive={BookmarkIconActive}
            icon={BookmarkIcon}
            title="Bookmarks"
            path={getPagePath("bookmarks")}
          />
          <NavItem
            icon={ListIcon}
            iconActive={ListIconActive}
            title="Lists"
            path={getPagePath("lists", loggedInUser.username)}
          />
          <NavItem
            icon={ProfileIcon}
            iconActive={ProfileIconActive}
            title="Profile"
            path={getPagePath("profile", loggedInUser.username)}
          />
          <NavItem icon={MoreIcon} title="More" isPopup />
        </>
      )}
    </nav>
  );
};

export default Nav;
