import ContentRight from "./ContentRight/ContentRight";
import HeaderMain from "./Header/HeaderMain/HeaderMain";
import HeaderRight from "./Header/HeaderRight/HeaderRight";
import StickyInbox from "../components/Inbox/StickyInbox/StickyInbox";
import { Outlet, useLocation } from "react-router-dom";
import "./Main.scss";
import paths from "../../util/paths";

const Main = () => {
  const path = useLocation().pathname;

  return (
    <main>
      <HeaderMain />
      <div className="ContentMain">
        <Outlet />
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
      </div>
      {path === paths.explore ? null : <HeaderRight />}
      <ContentRight />
      <StickyInbox />
    </main>
  );
};

export default Main;
