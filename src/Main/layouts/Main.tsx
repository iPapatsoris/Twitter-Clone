import ContentRight from "./ContentRight/ContentRight";
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
import HeaderExtendedNotifications from "../routes/Notifications/HeaderNotifications/HeaderExtendedNotifications/HeaderExtendedNotifications";
import { User } from "../../../backend/src/entities/user";
import { createContext, SetStateAction, useContext, useState } from "react";
import { ErrorPageContext } from "../../App";
import HeaderExtendedCircle from "../routes/Circle/HeaderCircle/HeaderExtendedCircle";
import NewHeader from "./Header/HeaderMain/HeaderMain";
import Icon from "../../util/components/Icon/Icon";
import sparkIcon from "../../assets/icons/spark.png";
import settingsIcon from "../../assets/icons/settings.png";
import verifiedIcon from "../../assets/icons/verified.png";
import Search from "../components/Search/Search";
import HeaderMainHub from "./Header/HeaderMain/HeaderMainHub";

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
  const path = useLocation().pathname;

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
        {!isErrorPage && <HeaderMainHub user={userHeader} />}
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
