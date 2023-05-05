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
import { createContext, SetStateAction, useContext, useState } from "react";
import HeaderProfile from "../routes/Profile/HeaderProfile/HeaderProfile";
import { ErrorPageContext } from "../../App";

export type HeaderProfileUser = Pick<
  User,
  "name" | "totalTweets" | "isVerified"
> | null;
export const HeaderProfileContext = createContext<{
  setUserHeader: React.Dispatch<SetStateAction<HeaderProfileUser>>;
}>({
  setUserHeader: () => {},
});

const Main = () => {
  const [userHeader, setUserHeader] = useState<HeaderProfileUser>(null);
  const { isErrorPage: isErrorPageContext } = useContext(ErrorPageContext);

  const isErrorPage = useRouteMatch(getPagePath("error")) || isErrorPageContext;
  const isProfilePage = useRouteMatch(getPagePath("profileAny"));

  const path = useLocation().pathname;
  let header = <HeaderHome />;
  if (path === getPagePath("explore")) {
    header = <HeaderExplore />;
  } else if (isProfilePage) {
    header = <HeaderProfile user={userHeader} />;
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
      <HeaderProfileContext.Provider
        value={{
          setUserHeader,
        }}
      >
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
