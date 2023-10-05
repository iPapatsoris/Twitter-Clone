import { create } from "zustand";
import { LoginUser } from "../../backend/src/api/auth";
import { persist } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import { NormalResponse } from "../../backend/src/api/common";
import { deleteData } from "../util/request";

export type LoggedInUser = NonNullable<LoginUser["response"]["data"]>["user"];

type LoggedInUserMiniInfo = Pick<LoggedInUser, "name" | "avatar">;

export const useAuthStore = create<{
  loggedInUser: LoggedInUser | null | undefined;
  setLoggedInUser: (user: LoggedInUser | null) => void;
  setLoggedInUserMiniInfo: (userInfo: LoggedInUserMiniInfo) => void;
}>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "loggedInUser",
      partialize: (state) => ({ loggedInUser: state.loggedInUser }),
    }
  )
);

export const useLogoutMutation = () => {
  const setUser = useAuthStore((state) => state.setLoggedInUser);
  return useMutation<NormalResponse>(
    ["logout"],
    () => deleteData("auth/logout"),
    {
      onSuccess: (data) => {
        if (data.ok) {
          setUser(null);
        }
      },
    }
  );
};
