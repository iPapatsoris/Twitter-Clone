import React, { useContext } from "react";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Routes,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import App from "./App";
import Home from "./Home/Home";
import "./global.css";
import ErrorPage from "./Main/routes/ErrorPage/ErrorPage";
import Explore from "./Main/routes/Explore/Explore";
import paths from "./util/paths";
import Notifications from "./Main/routes/Notifications/Notifications";
import NotificationsVerified from "./Main/routes/Notifications/NotificationsVerified";
import NotificationsMentions from "./Main/routes/Notifications/NotificationsMentions";
import TestSignup from "./Signup/TestSignup";
import { useAuth } from "./util/hooks/useAuth";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to={paths.explore} state={{ from: location }} />
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route
          path={paths.home}
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path={paths.explore} element={<Explore />} />
        <Route
          path={paths.notifications.self}
          element={
            <RequireAuth>
              <Notifications />
            </RequireAuth>
          }
        />
        <Route
          path={paths.notifications.verified}
          element={
            <RequireAuth>
              <NotificationsVerified />
            </RequireAuth>
          }
        />
        <Route
          path={paths.notifications.mentions}
          element={
            <RequireAuth>
              <NotificationsMentions />
            </RequireAuth>
          }
        />
        {/* <Route index element={<Navigate to={paths.notifications.self} />} /> */}
        <Route path={paths.messages} />
        <Route path={paths.bookmarks} />
        <Route path={paths.lists} />
        <Route path={paths.profile} />
        <Route path={paths.signup} element={<TestSignup />} />
        <Route index element={<Navigate to={paths.home} />} />
        <Route path="*" id={paths.error} element={<ErrorPage />} />
      </Route>
    </>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
