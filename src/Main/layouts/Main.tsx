import ContentRight from "./ContentRight/ContentRight";
import HeaderMain from "./Header/HeaderMain/HeaderMain";
import HeaderRight from "./Header/HeaderRight/HeaderRight";
import StickyInbox from "../components/Inbox/StickyInbox/StickyInbox";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./Main.module.scss";
import {
  getPagePath,
  isNotificationsPage as checkIsNotificationsPage,
  useRouteMatch,
  useRouteMatches,
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
import HeaderExtendedCircle from "../routes/Circle/HeaderCircle/HeaderExtendedCircle";

export type HeaderProfileUser = Pick<
  User,
  "name" | "totalTweets" | "isVerified" | "username"
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
  const isProfilePage = useRouteMatch(getPagePath("profile"));
  const isCirclePage = useRouteMatches([
    getPagePath("followers"),
    getPagePath("following"),
  ]);

  const path = useLocation().pathname;
  let header = <HeaderHome />;
  if (path === getPagePath("explore")) {
    header = <HeaderExplore />;
  } else if (isProfilePage) {
    header = <HeaderProfile user={userHeader} showTweets />;
  }

  const isNotificationsPage = checkIsNotificationsPage(path);
  const isPageWithExtendedHeader = isNotificationsPage || isCirclePage;

  let headerLayout;
  if (isPageWithExtendedHeader) {
    let headerMainChild, headerExtendedChild;
    if (isNotificationsPage) {
      headerMainChild = <HeaderNotifications />;
      headerExtendedChild = <HeaderExtendedNotifications />;
    } else if (isCirclePage) {
      headerMainChild = <HeaderProfile user={userHeader} showTweets={false} />;
      headerExtendedChild = <HeaderExtendedCircle />;
    }
    headerLayout = (
      <HeaderMainExtension
        headerMainChild={headerMainChild}
        headerExtendedChild={headerExtendedChild}
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
