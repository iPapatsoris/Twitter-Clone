import { useMatches } from "react-router-dom";
import { LoggedInUser } from "../Auth";

type Page =
  | "home"
  | "explore"
  | "notifications"
  | "notificationsVerified"
  | "notificationsMentions"
  | "messages"
  | "bookmarks"
  | "lists"
  | "profileLoggedIn"
  | "profileAny"
  | "error"
  | "settings"
  | "tos"
  | "privacy"
  | "cookies";

export const getPagePath = (page: Page, user: LoggedInUser = null) => {
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
    lists: "/" + user?.username + "/lists",
    profileLoggedIn: "/" + user?.username,
    profileAny: "/:username",
    error: "/error",
    settings: "/settings",
    tos: "/tos",
    privacy: "/privacy",
    cookies: "/cookies",
  };

  return paths[page];
};

export const useRouteMatch = (idToMatch: string) => {
  const matches = useMatches();
  for (let match of matches) {
    if (match.id === idToMatch) {
      return true;
    }
  }
  return false;
};

export const isNotificationsPage = (path: string) =>
  path === getPagePath("notifications", null) ||
  path === getPagePath("notificationsMentions", null) ||
  path === getPagePath("notificationsVerified", null);

export const webPath = (path: string) => "//www." + path;
