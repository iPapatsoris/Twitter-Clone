import { useMatches } from "react-router-dom";

export type Page =
  | "home"
  | "explore"
  | "notifications"
  | "notificationsVerified"
  | "notificationsMentions"
  | "messages"
  | "bookmarks"
  | "lists"
  | "profile"
  | "profileWithReplies"
  | "profileLikes"
  | "tweet"
  | "error"
  | "settings"
  | "tos"
  | "privacy"
  | "cookies"
  | "followers"
  | "following";

// TODO: improve code reusability for nested paths
export const getPagePath = (
  page: Page,
  username: string = "",
  tweet: number | undefined = undefined
) => {
  const usernameInPath = username ? username : ":username";
  const tweetInPath = tweet ? tweet : ":tweetID";
  const paths: {
    [key in Page]: string;
  } = {
    home: "/home",
    explore: "/explore",
    notifications: "/notifications",
    notificationsVerified: "/notifications/verified",
    notificationsMentions: "/notifications/mentions",
    messages: "/messages",
    bookmarks: "/i/bookmarks",
    lists: "/" + usernameInPath + "/lists",
    profile: "/" + usernameInPath,
    profileWithReplies: "/" + usernameInPath + "/with_replies",
    profileLikes: "/" + usernameInPath + "/likes",
    tweet: "/" + usernameInPath + "/status/" + tweetInPath,
    error: "/error",
    settings: "/settings",
    tos: "/tos",
    privacy: "/privacy",
    cookies: "/cookies",
    followers: "/" + usernameInPath + "/followers",
    following: "/" + usernameInPath + "/following",
  };

  return paths[page];
};

// Return true if current router ID matches any of the ones in ids array
export const useRouteMatches = (ids: string[]) =>
  useMatches().findIndex(
    (match) => ids.findIndex((item) => item === match.id) !== -1
  ) !== -1;

export const useRouteMatch = (id: string) => useRouteMatches([id]);

export const isNotificationsPage = (path: string) =>
  path === getPagePath("notifications") ||
  path === getPagePath("notificationsMentions") ||
  path === getPagePath("notificationsVerified");

export const webPath = (path: string) => "//www." + path;
