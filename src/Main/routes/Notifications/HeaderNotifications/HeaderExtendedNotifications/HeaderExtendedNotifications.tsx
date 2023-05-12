import { Link, useLocation } from "react-router-dom";
import { getPagePath } from "../../../../../util/paths";
import HeaderLinkMenu from "../../../../layouts/Header/HeaderMain/HeaderMainExtension/HeaderLinkMenu/HeaderLinkMenu";

const HeaderExtendedNotifications = () => {
  return (
    <HeaderLinkMenu
      items={[
        { page: "notifications", title: "All" },
        { page: "notificationsVerified", title: "Verified" },
        { page: "notificationsMentions", title: "Mentions" },
      ]}
    />
  );
};

export default HeaderExtendedNotifications;
