import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Home from "./Home/Home";
import "./index.css";
import ErrorPage from "./Main/routes/ErrorPage/ErrorPage";
import Explore from "./Main/routes/Explore/Explore";
import paths from "./util/paths";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: paths.home,
        element: <Home />,
      },
      {
        path: paths.explore,
        element: <Explore />,
      },
      {
        index: true,
        element: <Navigate to={paths.home} />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
