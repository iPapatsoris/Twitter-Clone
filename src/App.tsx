import "./App.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import paths from "./util/paths";

const App = () => {
  const path = useLocation().pathname;
  const extraClass = path === paths.explore ? "NoHeaderRight" : "";
  return (
    <div className={"App " + extraClass}>
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
