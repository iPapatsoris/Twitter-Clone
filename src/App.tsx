import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import paths, { isNotificationsPage, useRouteMatch } from "./util/paths";
import React, {
  createContext,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import useScrollToTop from "./util/hooks/useScrollToTop";

export const PopupContext = createContext<{
  disableOuterPointerEvents: boolean;
  isModalOpen: boolean;
  isPopupOpenRef: React.RefObject<boolean> | null;
  setDisableOuterPointerEvents: React.Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsPopupOpen: (value: boolean) => void;
}>({
  disableOuterPointerEvents: false,
  isModalOpen: false,
  isPopupOpenRef: null,
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
  /* We need to know if there is an open modal and/or a popup.
     If there is an open modal, do not disable outer pointer events, since
     the modal includes a fixed div wrapping the whole screen that automatically
     disables them. This behaviour is needed to cover the case that we want to
     use a popup within the modal, because if we were to disable pointer events,
     it would introduce buggy behaviour with the useClickOutside click events,
     regarding identifying clicked elements. Because clicking on an element 
     with disabled pointer events, results in the click source being identified 
     as the most recent ancestor that allows pointer events.
  */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, _setIsPopupOpen] = useState(false);
  /* Use a reference to the state, to avoid "stale state in callback" problem.
     When a modal is opened, a click event listener is added that detects 
     clicking outside of it, to close it. However, it is closed only in the 
     case that there is not a open popup within it. Thus, isPopupOpen needs to 
     be accessed from within the click event handler. If the user opens the 
     popup and clicks again very fast, it is possible that the second click 
     will be handled with an old state for isPopupOpen. Because even though 
     the state has been updated, the callback is stuck with the old state,
     until Modal is rerendered and the event handler replaced with the new 
     callback. This is why we need to use a ref, to make sure we always 
     have access to the latest state. 
  */
  const isPopupOpenRef = useRef(isPopupOpen);
  const setIsPopupOpen = (value: boolean) => {
    isPopupOpenRef.current = value;
    _setIsPopupOpen(value);
  };

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
        isPopupOpenRef,
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
