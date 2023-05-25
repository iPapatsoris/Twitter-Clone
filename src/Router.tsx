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
import { getPagePath } from "./util/paths";
import Profile from "./Main/routes/Profile/Profile";
import { profileLoader } from "./Main/routes/Profile/queries";
import useRequest from "./util/hooks/useRequest";
import { QueryClient } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { LoggedInUser, useAuthStore } from "./store/AuthStore";
import Circle from "./Main/routes/Circle/Circle";
import { circleLoader } from "./Main/routes/Circle/queries";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const loggedInUser: Pick<LoggedInUser, "id"> | null = useAuthStore(
    (state) => state.loggedInUser && { id: state.loggedInUser.id },
    shallow
  );
  const location = useLocation();
  return loggedInUser ? (
    children
  ) : (
    <Navigate to={getPagePath("explore")} state={{ from: location }} />
  );
};

const Router = ({ queryClient }: { queryClient: QueryClient }) => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { username: state.loggedInUser.username },
    shallow
  );
  const { getData } = useRequest();
  console.log("rendering router");

  const router = createBrowserRouter(
    createRoutesFromElements(
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
        <Route path={getPagePath("lists")} />
        <Route
          path={getPagePath("profile")}
          element={<Profile />}
          id={getPagePath("profile")}
          loader={profileLoader(getData, queryClient)}
          errorElement={<ErrorPage />} // is this needed? can i have it globally?
        />
        <Route
          path={getPagePath("followers")}
          element={<Circle />}
          id={getPagePath("followers")}
          loader={circleLoader(getData, queryClient, "followers")}
          errorElement={<ErrorPage />} // is this needed?
        />
        <Route
          path={getPagePath("following")}
          element={<Circle />}
          id={getPagePath("following")}
          loader={circleLoader(getData, queryClient, "followees")}
          errorElement={<ErrorPage />} // is this needed?
        />
        <Route index element={<Navigate to={getPagePath("home")} />} />
        <Route path="*" id={getPagePath("error")} element={<ErrorPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
