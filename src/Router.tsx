import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  redirect,
} from "react-router-dom";
import App from "./App";
import Home from "./Home/Home";
import ErrorPage from "./Main/routes/ErrorPage/ErrorPage";
import Explore from "./Main/routes/Explore/Explore";
import Notifications from "./Main/routes/Notifications/Notifications";
import NotificationsVerified from "./Main/routes/Notifications/NotificationsVerified";
import NotificationsMentions from "./Main/routes/Notifications/NotificationsMentions";
import { getPagePath } from "./util/paths";
import Profile from "./Main/routes/Profile/Profile";
import { profileLoader } from "./Main/routes/Profile/ProfileFace/queries";
import { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./store/AuthStore";
import Circle from "./Main/routes/Circle/Circle";
import { circleLoader } from "./Main/routes/Circle/queries";
import TweetThread from "./Main/components/Tweet/TweetThread/TweetThread";
import { tweetThreadLoader } from "./Main/components/Tweet/TweetThread/queries";
import TweetsWithReplies from "./Main/routes/Profile/Tweets/Replies";
import Tweets from "./Main/routes/Profile/Tweets/Tweets";
import LikedTweets from "./Main/routes/Profile/Tweets/LikedTweets";
import {
  userLikedTweetsLoader,
  userTweetsLoader,
  userRepliesLoader,
} from "./Main/routes/Profile/Tweets/queries";
import { homeLoader } from "./Home/queries";
import { ComponentProps } from "react";
import Welcome from "./Main/routes/Welcome/Welcome";

const Router = ({ queryClient }: { queryClient: QueryClient }) => {
  const loggedInUser = useAuthStore((state) => state.loggedInUser);
  const justSignedUp = useAuthStore((state) => state.justSignedUp);

  const protectedLoader = (
    loader: NonNullable<ComponentProps<typeof Route>["loader"]> = () => ({})
  ) =>
    loggedInUser
      ? loader
      : () => {
          throw redirect("/");
        };

  let rootRedirect = <Navigate to={getPagePath("home")} />;
  if (!loggedInUser) {
    rootRedirect = <Welcome />;
  } else if (justSignedUp) {
    rootRedirect = (
      <Navigate to={getPagePath("profile", loggedInUser?.username)} />
    );
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<App />}>
          <Route
            path={getPagePath("home")}
            loader={protectedLoader(homeLoader(queryClient))}
            element={<Home />}
          />
          <Route path={getPagePath("explore")} element={<Explore />} />
          <Route
            path={getPagePath("notifications")}
            loader={protectedLoader()}
            element={<Notifications />}
          />
          <Route
            path={getPagePath("notificationsVerified")}
            loader={protectedLoader()}
            element={<NotificationsVerified />}
          />
          <Route
            path={getPagePath("notificationsMentions")}
            loader={protectedLoader()}
            element={<NotificationsMentions />}
          />
          <Route path={getPagePath("messages")} loader={protectedLoader()} />
          <Route path={getPagePath("bookmarks")} />
          <Route path={getPagePath("lists")} />
          <Route
            path={getPagePath("profile")}
            element={<Profile />}
            id={getPagePath("profile")}
            loader={profileLoader(queryClient)}
            errorElement={<ErrorPage />} // Can ErrorPage be included globally?
          >
            <Route
              index
              loader={userTweetsLoader(queryClient)}
              element={<Tweets />}
              errorElement={<ErrorPage />}
            />
            <Route
              path={getPagePath("profileWithReplies")}
              loader={userRepliesLoader(queryClient)}
              element={<TweetsWithReplies />}
              errorElement={<ErrorPage />}
            />
            <Route
              path={getPagePath("profileLikes")}
              loader={userLikedTweetsLoader(queryClient)}
              element={<LikedTweets />}
              errorElement={<ErrorPage />}
            />
          </Route>
          <Route
            path={getPagePath("tweet")}
            element={<TweetThread />}
            id={getPagePath("tweet")}
            loader={tweetThreadLoader(queryClient)}
            errorElement={<ErrorPage />}
          />
          <Route
            path={getPagePath("followers")}
            element={<Circle />}
            id={getPagePath("followers")}
            loader={circleLoader(queryClient, "followers")}
            errorElement={<ErrorPage />}
          />
          <Route
            path={getPagePath("following")}
            element={<Circle />}
            id={getPagePath("following")}
            loader={circleLoader(queryClient, "followees")}
            errorElement={<ErrorPage />}
          />
          <Route path="*" id={getPagePath("error")} element={<ErrorPage />} />
        </Route>
        <Route index element={rootRedirect} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
