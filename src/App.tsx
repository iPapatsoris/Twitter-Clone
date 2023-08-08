import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { ScrollRestoration, useLocation } from "react-router-dom";
import {
  getPagePath,
  isNotificationsPage,
  useRouteMatches,
} from "./util/paths";
import { createContext, SetStateAction, useState } from "react";
import { useAuthStore } from "./store/AuthStore";
import Welcome from "./Main/routes/Welcome/Welcome";

export const ErrorPageContext = createContext<{
  setIsErrorPage: React.Dispatch<SetStateAction<boolean>>;
  isErrorPage: boolean;
}>({
  setIsErrorPage: () => {},
  isErrorPage: false,
});
const App = () => {
  const [isErrorPage, setIsErrorPage] = useState(false);
  const path = useLocation().pathname;
  const { loggedInUser } = useAuthStore();

  const isCirclePage = useRouteMatches([
    getPagePath("followers"),
    getPagePath("following"),
  ]);

  let extraClasses = [];
  // Modify grid layout for different pages
  if (isErrorPage) {
    extraClasses.push(styles.ErrorPage);
  } else if (path === getPagePath("explore")) {
    extraClasses.push(styles.NoHeaderRight);
  } else if (isNotificationsPage(path) || isCirclePage) {
    extraClasses.push(styles.ExtendedHeaderMain);
  }

  return !loggedInUser ? (
    <Welcome />
  ) : (
    <ErrorPageContext.Provider value={{ setIsErrorPage, isErrorPage }}>
      <ScrollRestoration />
      <div className={[styles.App, ...extraClasses].join(" ")}>
        <>
          <Sidebar />
          <Main />
        </>
      </div>
    </ErrorPageContext.Provider>
  );
};

export default App;
