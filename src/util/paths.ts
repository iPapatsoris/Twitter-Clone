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
  | "error"
  | "settings"
  | "tos"
  | "privacy"
  | "cookies"
  | "followers"
  | "following";

export const getPagePath = (page: Page, username: string = "") => {
  const usernameInPath = username ? username : ":username";
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
  path === getPagePath("notifications") ||
  path === getPagePath("notificationsMentions") ||
  path === getPagePath("notificationsVerified");

export const webPath = (path: string) => "//www." + path;
