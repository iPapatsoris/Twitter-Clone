import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { ScrollRestoration, useLocation } from "react-router-dom";
import {
  getPagePath,
  isNotificationsPage,
  useRouteMatches,
} from "./util/paths";
import {
  createContext,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import useWindowDimensions from "./util/hooks/useWindowDimensions";

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

  const isCirclePage = useRouteMatches([
    getPagePath("followers"),
    getPagePath("following"),
  ]);

  const { width } = useWindowDimensions();
  const appRef = useRef(null);
  const [showContentRight, setShowContentRight] = useState(true);
  console.log(showContentRight);

  useEffect(() => {
    if (appRef && appRef.current) {
      const style = getComputedStyle(appRef.current);
      setShowContentRight(
        width >
          parseInt(style.getPropertyValue("--no-content-right-breakpoint"))
      );
    }
  }, [appRef, setShowContentRight, width]);

  let extraClasses = [];
  // Modify grid layout for different pages
  if (isErrorPage) {
    extraClasses.push(styles.ErrorPage);
  } else if (path === getPagePath("explore")) {
    extraClasses.push(styles.NoHeaderRight);
  } else if (isNotificationsPage(path) || isCirclePage) {
    extraClasses.push(styles.ExtendedHeaderMain);
  }

  return (
    <ErrorPageContext.Provider value={{ setIsErrorPage, isErrorPage }}>
      <ScrollRestoration />
      <div ref={appRef} className={[styles.App, ...extraClasses].join(" ")}>
        <>
          <Sidebar />
          <Main showContentRight={showContentRight} />
        </>
      </div>
    </ErrorPageContext.Provider>
  );
};

export default App;
