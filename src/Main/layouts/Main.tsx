import ContentRight from "./ContentRight/ContentRight";
import HeaderRight from "./Header/HeaderRight/HeaderRight";
import StickyInbox from "../components/Inbox/StickyInbox/StickyInbox";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./Main.module.scss";
import { getPagePath, useRouteMatch } from "../../util/paths";
import { User } from "../../../backend/src/entities/user";
import { createContext, SetStateAction, useContext, useState } from "react";
import { ErrorPageContext } from "../../App";
import HeaderMainHub from "./Header/HeaderMain/HeaderMainHub";

export type HeaderProfileUser = Partial<
  Pick<User, "name" | "totalTweets" | "isVerified" | "username">
> | null;
export const HeaderProfileContext = createContext<{
  setUserHeader: React.Dispatch<SetStateAction<HeaderProfileUser>>;
}>({
  setUserHeader: () => {},
});

const Main = ({ showContentRight }: { showContentRight: boolean }) => {
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

  const headerRight = path !== getPagePath("explore") && <HeaderRight />;

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
        </div>
        {!isErrorPage && showContentRight && (
          <>
            {headerRight}
            <ContentRight />
            <StickyInbox />
          </>
        )}
      </HeaderProfileContext.Provider>
    </main>
  );
};

export default Main;
