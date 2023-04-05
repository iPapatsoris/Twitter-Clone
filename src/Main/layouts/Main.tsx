import ContentRight from "./ContentRight/ContentRight";
import HeaderMain from "./Header/HeaderMain/HeaderMain";
import HeaderRight from "./Header/HeaderRight/HeaderRight";
import StickyInbox from "../components/Inbox/StickyInbox/StickyInbox";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./Main.module.scss";
import {
  getPagePath,
  isNotificationsPage,
  useRouteMatch,
} from "../../util/paths";
import HeaderHome from "../routes/Home/HeaderHome/HeaderHome";
import HeaderExplore from "../routes/Explore/HeaderExplore/HeaderExplore";
import HeaderNotifications from "../routes/Notifications/HeaderNotifications/HeaderNotifications";
import HeaderExtendedNotifications from "../routes/Notifications/HeaderNotifications/HeaderExtendedNotifications/HeaderExtendedNotifications";
import HeaderMainExtension from "./Header/HeaderMain/HeaderMainExtension/HeaderMainExtension";
import { User } from "../../../backend/src/entities/user";
import { createContext, SetStateAction, useState } from "react";
import HeaderProfile from "../routes/Profile/HeaderProfile/HeaderProfile";

export type HeaderProfileUser = Pick<User, "name" | "totalTweets"> | null;
export const HeaderProfileContext = createContext<{
  setUser: React.Dispatch<SetStateAction<HeaderProfileUser>>;
}>({ setUser: () => {} });

const Main = () => {
  const [user, setUser] = useState<HeaderProfileUser>(null);

  const isErrorPage = useRouteMatch(getPagePath("error"));
  const isProfilePage = useRouteMatch(getPagePath("profileAny"));

  const path = useLocation().pathname;
  let header = <HeaderHome />;
  if (path === getPagePath("explore")) {
    header = <HeaderExplore />;
  } else if (isProfilePage) {
    header = <HeaderProfile user={user} />;
  }

  let headerLayout;
  if (isNotificationsPage(path)) {
    headerLayout = (
      <HeaderMainExtension
        headerMainChild={<HeaderNotifications />}
        headerExtendedChild={<HeaderExtendedNotifications />}
      />
    );
  } else {
    headerLayout = <HeaderMain>{header}</HeaderMain>;
  }

  const placeholderJSX = [];
  for (let count = 0; count < 100; count++)
    placeholderJSX.push(
      <>
        asdfadsf <br />
      </>
    );

  return (
    <main>
      <HeaderProfileContext.Provider value={{ setUser }}>
        {!isErrorPage && headerLayout}
        <div className={isErrorPage ? styles.ErrorPage : styles.ContentMain}>
          <Outlet />
          {/* {!isErrorPage && placeholderJSX} */}
        </div>
        {!isErrorPage && path !== getPagePath("explore") && <HeaderRight />}
        {!isErrorPage && <ContentRight />}
        {!isErrorPage && <StickyInbox />}
      </HeaderProfileContext.Provider>
    </main>
  );
};

export default Main;
