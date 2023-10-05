import Profile from "../Main/routes/Profile/Profile";
import { useAuthStore } from "../store/AuthStore";
import IconAndTitle from "../util/components/Popup/OptionsPopup/IconAndTitle/IconAndTitle";
import {
  OptionWithNested,
  addClickHandlerToNonExpandableOptions,
} from "../util/components/Popup/OptionsPopup/Option";
import { ReactComponent as ProfileIcon } from "../assets/icons/nav/user.svg";
import { ReactComponent as BookmarkIcon } from "../assets/icons/nav/bookmark.svg";
import { ReactComponent as ListIcon } from "../assets/icons/nav/list.svg";
import { Link } from "react-router-dom";
import { getPagePath } from "../util/paths";
import OptionsList from "../util/components/Popup/OptionsPopup/OptionsList";
import { navMoreOptionsList } from "./Nav/MoreOptionsNavItem/navMoreOptionsList";
import { useContext } from "react";
import { ModalContext } from "../util/components/Modal/Modal";

const MobileSidepanel = () => {
  const { loggedInUser } = useAuthStore();
  const { setIsActive } = useContext(ModalContext);
  const closeModal = () => setIsActive(false);

  const options: OptionWithNested[] = [
    {
      mainOption: {
        component: (
          <Link to={getPagePath("profile", loggedInUser?.username)}>
            <IconAndTitle
              title="Profile"
              alt="Profile"
              icon={ProfileIcon}
              size="large"
            />
          </Link>
        ),
        id: "profile",
      },
    },
    {
      mainOption: {
        component: (
          <Link to={getPagePath("bookmarks")}>
            <IconAndTitle
              title="Bookmarks"
              alt="Bookmarks"
              icon={BookmarkIcon}
              size="large"
            />
          </Link>
        ),
        id: "bookmarks",
      },
    },
    {
      mainOption: {
        component: (
          <Link to={getPagePath("lists")}>
            <IconAndTitle
              title="Lists"
              alt="Lists"
              icon={ListIcon}
              size="large"
            />
          </Link>
        ),
        id: "lists",
      },
    },
    ...addClickHandlerToNonExpandableOptions(navMoreOptionsList, closeModal),
  ];

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
