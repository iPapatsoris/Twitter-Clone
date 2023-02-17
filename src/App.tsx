import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import paths, { isNotificationsPage, useRouteMatch } from "./util/paths";
import React, { createContext, SetStateAction, useMemo, useState } from "react";
import useScrollToTop from "./util/hooks/useScrollToTop";

export const PopupContext = createContext<{
  disableOuterPointerEvents: boolean;
  isModalOpen: boolean;
  isPopupOpen: boolean;
  setDisableOuterPointerEvents: React.Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<SetStateAction<boolean>>;
}>({
  disableOuterPointerEvents: false,
  isModalOpen: false,
  isPopupOpen: false,
  setDisableOuterPointerEvents: () => {},
  setIsModalOpen: () => {},
  setIsPopupOpen: () => {},
});

const App = () => {
  const isErrorPage = useRouteMatch(paths.error);
  const path = useLocation().pathname;
  useScrollToTop();

  // To use when a popup becomes active, to allow clicking only within popup
  const [disableOuterPointerEvents, setDisableOuterPointerEvents] =
    useState(false);
  /* If there is an open modal, do not disable outer pointer events, since
     it includes a fixed div wrapping the whole screen that automatically
     disables them. This behaviour is needed to cover the case that we want to
     use a popup within the modal, because if we were to disable pointer events,
     it would introduce buggy behaviour with the useClickOutside click events,
     regarding identifying clicked elements. Because clicking on an element 
     with disabled pointer events, results in the click source being identified 
     as the most recent ancestor that allows pointer events.
  */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
  if (!isModalOpen && disableOuterPointerEvents) {
    extraClasses.push(styles.DisablePointerEvents);
  }

  return (
    <PopupContext.Provider
      value={{
        disableOuterPointerEvents,
        isModalOpen,
        isPopupOpen,
        setDisableOuterPointerEvents,
        setIsModalOpen,
        setIsPopupOpen,
      }}
    >
      <div className={[styles.App, ...extraClasses].join(" ")}>
        {innerContent}
      </div>
    </PopupContext.Provider>
  );
};

export default App;
