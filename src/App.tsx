import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { getPagePath, isNotificationsPage } from "./util/paths";
import { createContext, SetStateAction, useMemo, useState } from "react";
import useScrollToTop from "./util/hooks/useScrollToTop";

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
    <ErrorPageContext.Provider value={{ setIsErrorPage, isErrorPage }}>
      <div className={[styles.App, ...extraClasses].join(" ")}>
        {innerContent}
      </div>
    </ErrorPageContext.Provider>
  );
};

export default App;
