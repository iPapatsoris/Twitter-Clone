import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Home from "./Home/Home";
import "./index.css";
import ErrorPage from "./Main/routes/ErrorPage/ErrorPage";
import Explore from "./Main/routes/Explore/Explore";
import paths from "./util/paths";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path={paths.home} element={<Home />} />
      <Route path={paths.explore} element={<Explore />} />
      <Route path={paths.notifications} />
      <Route path={paths.messages} />
      <Route path={paths.bookmarks} />
      <Route path={paths.lists} />
      <Route path={paths.profile} />
      <Route index element={<Navigate to={paths.home} />} />
      <Route path="*" id={paths.error} element={<ErrorPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
