import { useMatches } from "react-router-dom";

const paths: {
  home: string;
  explore: string;
  notifications: string;
  messages: string;
  bookmarks: string;
  lists: string;
  profile: string;
  error: string;
} = {
  home: "/home",
  explore: "/explore",
  notifications: "/notifications",
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

export default paths;
