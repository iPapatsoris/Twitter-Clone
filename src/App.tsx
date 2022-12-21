import "./App.scss";
import Main from "./Main/layouts/Main";
import Sidebar from "./Sidebar/Sidebar";

const App = () => {
  return (
    <div className="App">
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
