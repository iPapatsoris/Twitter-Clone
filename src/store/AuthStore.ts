import { create } from "zustand";
import { LoginUser } from "../../backend/src/api/auth";

export type LoggedInUser = NonNullable<LoginUser["response"]["data"]>["user"];

type LoggedInUserMiniInfo = Pick<LoggedInUser, "name" | "avatar">;

export const useAuthStore = create<{
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: (user: LoggedInUser | null) => void;
  setLoggedInUserMiniInfo: (userInfo: LoggedInUserMiniInfo) => void;
}>((set) => ({
  loggedInUser: null,
  setLoggedInUser: (user) => set({ loggedInUser: user }),
  setLoggedInUserMiniInfo: (userInfo) =>
    set((state) => ({
      loggedInUser: {
        ...state.loggedInUser!,
        name: userInfo?.name,
        avatar: userInfo?.avatar,
      },
    })),
}));
