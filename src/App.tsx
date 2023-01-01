import styles from "./App.module.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import paths, { useRouteMatch } from "./util/paths";

const App = () => {
  const isErrorPage = useRouteMatch(paths.error);
  const path = useLocation().pathname;
  let extraClass = "";
  if (isErrorPage) {
    extraClass = styles.ErrorPage;
  } else if (path === paths.explore) {
    extraClass = styles.NoHeaderRight;
  } else if (path === paths.notifications) {
    extraClass = styles.ExtendedHeaderMain;
  }

  return (
    <div className={[styles.App, extraClass].join(" ")}>
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
