import "./App.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import paths, { useRouteMatch } from "./util/paths";

const App = () => {
  const isErrorPage = useRouteMatch(paths.error);
  const path = useLocation().pathname;
  let extraClass = "";
  if (isErrorPage) {
    extraClass = "ErrorPage";
  } else if (path === paths.explore) {
    extraClass = "NoHeaderRight";
  }

  return (
    <div className={"App " + extraClass}>
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
