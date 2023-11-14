import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateTweet as CreateTweetAPI } from "../../../../../backend/src/api/tweet";
import { postData } from "../../../../util/request";
import { tweetKeys } from "../queries";
import { useNavigate } from "react-router-dom";
import { getPagePath } from "../../../../util/paths";
import { useExtraTweetActions } from "../../../../Home/useExtraTweetsStore";
import { tweetThreadKeys } from "../TweetThread/queries";
import { useLoggedInUser } from "../../../../store/AuthStore";
import { CreateTweetForm } from "./CreateTweet";
import { UseFormReturn } from "react-hook-form";

const useCreateTweetMutation = ({
  asModalContent,
  isReply,
  form,
  referencedTweetID,
}: {
  referencedTweetID?: number;
  asModalContent?: boolean;
  isReply: boolean;
  form: UseFormReturn<CreateTweetForm>;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loggedInUser = useLoggedInUser();
  const { addTweetsAtFront } = useExtraTweetActions();

  return useMutation<
    CreateTweetAPI["response"],
    unknown,
    CreateTweetAPI["request"]
  >({
    mutationFn: (body) => postData("tweet", body),
    onSuccess: (data) => {
      if (data.ok) {
        if (!asModalContent) {
          form.reset();
        }
        if (!isReply) {
          const options = tweetKeys.tweetID(data.data?.tweet.id!);
          queryClient.setQueryData(queryOptions(options).queryKey, () => ({
            tweet: data.data?.tweet!,
          }));
          addTweetsAtFront([{ id: data.data?.tweet.id! }]);
          navigate(getPagePath("home"), {
            state: { closeCreateTweetModal: true },
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: tweetThreadKeys.tweetID(referencedTweetID!, queryClient)
              .queryKey,
          });
          navigate(
            getPagePath("tweet", loggedInUser?.username, data.data?.tweet.id),
            { state: { closeCreateTweetModal: true } }
          );
        }
      }
    },
  });
};

export default useCreateTweetMutation;
