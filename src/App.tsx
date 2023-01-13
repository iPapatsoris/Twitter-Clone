import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import paths, { isNotificationsPage, useRouteMatch } from "./util/paths";
import React, { createContext, SetStateAction, useMemo, useState } from "react";
import useScrollToTop from "./util/hooks/useScrollToTop";

export const PopupContext = createContext<{
  disableOuterPointerEvents: boolean;
  setDisableOuterPointerEvents: React.Dispatch<SetStateAction<boolean>>;
}>({
  disableOuterPointerEvents: false,
  setDisableOuterPointerEvents: () => {},
});

const App = () => {
  const isErrorPage = useRouteMatch(paths.error);
  const path = useLocation().pathname;
  useScrollToTop();

  // To use when a popup becomes active
  const [disableOuterPointerEvents, setDisableOuterPointerEvents] =
    useState(false);
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
  } else if (path === paths.explore) {
    extraClasses.push(styles.NoHeaderRight);
  } else if (isNotificationsPage(path)) {
    extraClasses.push(styles.ExtendedHeaderMain);
  }
  if (disableOuterPointerEvents) {
    extraClasses.push(styles.DisablePointerEvents);
  }

  return (
    <PopupContext.Provider
      value={{ disableOuterPointerEvents, setDisableOuterPointerEvents }}
    >
      <div className={[styles.App, ...extraClasses].join(" ")}>
        {innerContent}
      </div>
    </PopupContext.Provider>
  );
};

export default App;
