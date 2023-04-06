import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import App from "./App";
import Home from "./Home/Home";
import "./global.css";
import ErrorPage from "./Main/routes/ErrorPage/ErrorPage";
import Explore from "./Main/routes/Explore/Explore";
import Notifications from "./Main/routes/Notifications/Notifications";
import NotificationsVerified from "./Main/routes/Notifications/NotificationsVerified";
import NotificationsMentions from "./Main/routes/Notifications/NotificationsMentions";
import { useAuth } from "./util/hooks/useAuth";
import { getPagePath } from "./util/paths";
import Profile, { profileLoader } from "./Main/routes/Profile/Profile";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();
  return user ? (
    children
  ) : (
    <Navigate to={getPagePath("explore")} state={{ from: location }} />
  );
};

const Router = () => {
  const { user } = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<App />}>
          <Route
            path={getPagePath("home")}
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path={getPagePath("explore")} element={<Explore />} />
          <Route
            path={getPagePath("notifications")}
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path={getPagePath("notificationsVerified")}
            element={
              <RequireAuth>
                <NotificationsVerified />
              </RequireAuth>
            }
          />
          <Route
            path={getPagePath("notificationsMentions")}
            element={
              <RequireAuth>
                <NotificationsMentions />
              </RequireAuth>
            }
          />
          {/* <Route index element={<Navigate to={paths.notifications.self} />} /> */}
          <Route path={getPagePath("messages")} />
          <Route path={getPagePath("bookmarks")} />
          <Route path={getPagePath("lists", user)} />
          <Route
            path={getPagePath("profileAny")}
            element={<Profile />}
            id={getPagePath("profileAny")}
            loader={profileLoader}
            errorElement={<ErrorPage />}
          />
          <Route index element={<Navigate to={getPagePath("home")} />} />
          <Route path="*" id={getPagePath("error")} element={<ErrorPage />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
