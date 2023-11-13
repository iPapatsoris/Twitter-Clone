import { create } from "zustand";
import { LoginUser } from "../../backend/src/api/auth";
import { persist } from "zustand/middleware";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NormalResponse } from "../../backend/src/api/common";
import { deleteData, postData } from "../util/request";
import {
  mediumPreviewProfileFields,
  profileKeys,
} from "../Main/routes/Profile/ProfileFace/queries";

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

export const useLoginMutation = () => {
  const { setLoggedInUser } = useAuthStoreActions();
  const queryClient = useQueryClient();

  return useMutation<LoginUser["response"], unknown, LoginUser["request"]>({
    mutationFn: (body) => postData("auth/login", body),
    onSuccess: (res) => {
      if (res.data) {
        setLoggedInUser(res.data.user);
        queryClient.prefetchQuery(
          profileKeys
            .username(res.data.user.username)
            ._ctx.fields(mediumPreviewProfileFields)
        );
      }
    },
  });
};

export const useLogoutMutation = () => {
  const { setLoggedInUser } = useAuthStoreActions();
  return useMutation<NormalResponse>({
    mutationFn: () => deleteData("auth/logout"),

    onSuccess: (res) => {
      if (res.ok) {
        setLoggedInUser(null);
      }
    },
  });
};
