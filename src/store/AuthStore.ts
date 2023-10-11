import { create } from "zustand";
import { LoginUser } from "../../backend/src/api/auth";
import { persist } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import { NormalResponse } from "../../backend/src/api/common";
import { deleteData } from "../util/request";

export type LoggedInUser = NonNullable<LoginUser["response"]["data"]>["user"];
export const useAuthStore = create<{
  loggedInUser: LoggedInUser | null | undefined;
  setLoggedInUser: (user: LoggedInUser | null) => void;
}>()(
  persist(
    (set) => ({
      loggedInUser: null,
      setLoggedInUser: (user) => set({ loggedInUser: user }),
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
