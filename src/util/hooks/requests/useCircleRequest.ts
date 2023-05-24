import { NormalResponse } from "../../../../backend/src/api/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useRequest from "./useRequest";

export const useCircleRequest = ({
  username,
  queryKeyToInvalidate,
}: {
  username: string;
  queryKeyToInvalidate: string[];
}) => {
  const { postData, deleteData } = useRequest();
  const queryClient = useQueryClient();
  const options: Parameters<typeof useMutation<NormalResponse>>["2"] = {
    onSuccess: async (data) => {
      if (data.ok) {
        await queryClient.invalidateQueries({
          queryKey: queryKeyToInvalidate,
        });
      }
    },
  };

  return {
    useFollowMutation: useMutation<NormalResponse, unknown, void>(
      ["follow", username],
      () => postData("user/" + username + "/follow", {}),
      options
    ),
    useUnfollowMutation: useMutation<NormalResponse, unknown, void>(
      ["unfollow", username],
      () => deleteData("user/" + username + "/follow"),
      options
    ),
  };
};
