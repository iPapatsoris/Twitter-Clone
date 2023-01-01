import { useMatches } from "react-router-dom";

const paths: {
  home: string;
  explore: string;
  notifications: {
    self: string;
    verified: string;
    mentions: string;
  };
  messages: string;
  bookmarks: string;
  lists: string;
  profile: string;
  error: string;
} = {
  home: "/home",
  explore: "/explore",
  notifications: {
    self: "/notifications",
    verified: "/notifications/verified",
    mentions: "/notifications/mentions",
  },
  messages: "/messages",
  bookmarks: "/i/bookmarks",
  lists: "/:username/lists",
  profile: "/:username",
  error: "/error",
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
  path === paths.notifications.self ||
  path === paths.notifications.verified ||
  path === paths.notifications.mentions;

export default paths;
