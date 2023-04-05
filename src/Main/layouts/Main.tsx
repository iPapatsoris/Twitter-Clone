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

const Main = () => {
  const isErrorPage = useRouteMatch(getPagePath("error"));
  const path = useLocation().pathname;
  let header = <HeaderHome />;
  if (path === getPagePath("explore")) {
    header = <HeaderExplore />;
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

  const placeholderJSX = !isErrorPage && (
    <>
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
      asdfadsf <br />
    </>
  );

  return (
    <main>
      {!isErrorPage && headerLayout}
      <div className={isErrorPage ? styles.ErrorPage : styles.ContentMain}>
        <Outlet />
        {/* {placeholderJSX} */}
      </div>
      {!isErrorPage && path !== getPagePath("explore") && <HeaderRight />}
      {!isErrorPage && <ContentRight />}
      {!isErrorPage && <StickyInbox />}
    </main>
  );
};

export default Main;
