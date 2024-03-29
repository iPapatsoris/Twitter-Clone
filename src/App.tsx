import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { ScrollRestoration, useLocation } from "react-router-dom";
import { getPagePath } from "./util/paths";
import {
  createContext,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import useWindowDimensions from "./util/hooks/useWindowDimensions";
import { getLocalCssVar } from "./util/hooks/useMapPropToCssVar";

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

  const { width } = useWindowDimensions();
  const appRef = useRef(null);
  const [showContentRight, setShowContentRight] = useState(true);

  useEffect(() => {
    if (appRef && appRef.current) {
      setShowContentRight(
        width >
          getLocalCssVar({
            cssVar: "--no-content-right-breakpoint",
            ref: appRef,
          })
      );
    }
  }, [appRef, setShowContentRight, width]);

  // Modify grid layout for explore page
  const extraClasses =
    path === getPagePath("explore") ? [styles.NoHeaderRight] : [];

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
