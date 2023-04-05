import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { getPagePath, isNotificationsPage, useRouteMatch } from "./util/paths";
import { useMemo } from "react";
import useScrollToTop from "./util/hooks/useScrollToTop";

const App = () => {
  const isErrorPage = useRouteMatch(getPagePath("error"));
  const path = useLocation().pathname;
  useScrollToTop();

  // Avoid useless re-rendering when simply a popup becomes active
  const innerContent = useMemo(
    () => (
      <>
        <Sidebar />
        <Main />
      </>
    ),
    []
  );

  let extraClasses = [];
  // Modify grid layout for different pages
  if (isErrorPage) {
    extraClasses.push(styles.ErrorPage);
  } else if (path === getPagePath("explore")) {
    extraClasses.push(styles.NoHeaderRight);
  } else if (isNotificationsPage(path)) {
    extraClasses.push(styles.ExtendedHeaderMain);
  }

  return (
    <div className={[styles.App, ...extraClasses].join(" ")}>
      {innerContent}
    </div>
  );
};

export default App;
