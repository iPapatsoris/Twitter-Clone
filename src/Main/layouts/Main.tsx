import ContentRight from "./ContentRight/ContentRight";
import HeaderMain from "./Header/HeaderMain/HeaderMain";
import HeaderRight from "./Header/HeaderRight/HeaderRight";
import StickyInbox from "../components/Inbox/StickyInbox/StickyInbox";
import { Outlet, useLocation } from "react-router-dom";
import "./Main.scss";
import paths, { useRouteMatch } from "../../util/paths";
import HeaderHome from "../routes/Home/HeaderHome/HeaderHome";
import HeaderExplore from "../routes/Explore/HeaderExplore/HeaderExplore";

const Main = () => {
  const isErrorPage = useRouteMatch(paths.error);
  const path = useLocation().pathname;
  let header = <HeaderHome />;
  if (path === paths.explore) {
    header = <HeaderExplore />;
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
      {!isErrorPage && <HeaderMain>{header}</HeaderMain>}
      <div className={isErrorPage ? "ErrorPage" : "ContentMain"}>
        <Outlet />
        {placeholderJSX}
      </div>
      {!isErrorPage && path !== paths.explore && <HeaderRight />}
      {!isErrorPage && <ContentRight />}
      {!isErrorPage && <StickyInbox />}
    </main>
  );
};

export default Main;
