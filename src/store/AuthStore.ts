import { create } from "zustand";
import { LoginUser } from "../../backend/src/api/auth";
import { persist } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import { NormalResponse } from "../../backend/src/api/common";
import { deleteData } from "../util/request";

export type LoggedInUser = NonNullable<LoginUser["response"]["data"]>["user"];
const useAuthStore = create<{
  loggedInUser: LoggedInUser | null | undefined;
  justSignedUp: boolean;
  actions: {
    setLoggedInUser: (user: LoggedInUser | null) => void;
    handleSignup: (user: LoggedInUser | null) => void;
  };
}>()(
  persist(
    (set) => ({
      loggedInUser: null,
      justSignedUp: false,
      actions: {
        setLoggedInUser: (user) => set({ loggedInUser: user }),
        handleSignup: (user) => set({ loggedInUser: user, justSignedUp: true }),
      },
    }),
    {
      name: "loggedInUser",
      partialize: (state) => ({ loggedInUser: state.loggedInUser }),
    }
  )
);

export const useLoggedInUser = () =>
  useAuthStore((state) => state.loggedInUser);
export const useJustSignedUp = () =>
  useAuthStore((state) => state.justSignedUp);
export const useAuthStoreActions = () => useAuthStore((state) => state.actions);
export const getNonReactiveAuthState = () => useAuthStore.getState();

export const useLogoutMutation = () => {
  const { setLoggedInUser } = useAuthStoreActions();
  return useMutation<NormalResponse>(
    ["logout"],
    () => deleteData("auth/logout"),
    {
      onSuccess: (data) => {
        if (data.ok) {
          setLoggedInUser(null);
        }
      },
    }
  );
};
