import Profile from "../Main/routes/Profile/Profile";
import { useAuthStore, useLogoutMutation } from "../store/AuthStore";
import IconAndTitle from "../util/components/Popup/OptionsPopup/IconAndTitle/IconAndTitle";
import {
  OptionWithNested,
  addClickHandlerToNonExpandableOptions,
} from "../util/components/Popup/OptionsPopup/Option";
import { ReactComponent as ProfileIcon } from "../assets/icons/nav/user.svg";
import { ReactComponent as BookmarkIcon } from "../assets/icons/nav/bookmark.svg";
import { ReactComponent as ListIcon } from "../assets/icons/nav/list.svg";
import { ReactComponent as LogoutIcon } from "../assets/icons/nav/logout.svg";
import { getPagePath } from "../util/paths";
import OptionsList from "../util/components/Popup/OptionsPopup/OptionsList";
import { navMoreOptionsList } from "./Nav/MoreOptionsNavItem/navMoreOptionsList";
import { useContext } from "react";
import { ModalContext } from "../util/components/Modal/Modal";

const MobileSidepanel = () => {
  const { loggedInUser } = useAuthStore();
  const { setIsActive } = useContext(ModalContext);
  const closeModal = () => setIsActive(false);
  const { mutate: logout } = useLogoutMutation();

  const options: OptionWithNested[] = [
    {
      mainOption: {
        component: (
          <IconAndTitle
            title="Profile"
            alt="Profile"
            icon={ProfileIcon}
            size="large"
          />
        ),
        id: "profile",
        link: getPagePath("profile", loggedInUser?.username),
      },
    },
    {
      mainOption: {
        component: (
          <IconAndTitle
            title="Bookmarks"
            alt="Bookmarks"
            icon={BookmarkIcon}
            size="large"
          />
        ),
        id: "bookmarks",
        link: getPagePath("bookmarks"),
      },
    },
    {
      mainOption: {
        component: (
          <IconAndTitle
            title="Lists"
            alt="Lists"
            icon={ListIcon}
            size="large"
          />
        ),
        id: "lists",
        link: getPagePath("lists"),
      },
    },
    ...addClickHandlerToNonExpandableOptions(navMoreOptionsList, closeModal),
  ];

  options[options.length - 1].nestedOptions?.push({
    component: (
      <IconAndTitle
        title="Logout"
        alt="Logout"
        icon={LogoutIcon}
        size="small"
      />
    ),
    id: "logout",
    onSelect: () => {
      logout();
    },
  });

  return (
    <>
      <Profile
        preview={{
          username: loggedInUser!.username,
          type: "mobile-sidebar",
        }}
      />
      <OptionsList options={options} />
    </>
  );
};

export default MobileSidepanel;
