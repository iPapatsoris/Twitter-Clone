import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { NormalResponse } from "../../../../backend/src/api/common";
import {
  GetUserFollowees,
  GetUserFollowers,
} from "../../../../backend/src/api/user";
import { GetUserFields } from "../../../../backend/src/permissions";
import {
  addQueryParams,
  deleteData,
  getData,
  postData,
} from "../../../util/request";
import {
  profileKeys,
  smallPreviewProfileFields,
  SmallProfileRequestFields,
} from "../Profile/ProfileFace/queries";

type CircleResponse =
  | GetUserFollowees<SmallProfileRequestFields>["response"]
  | GetUserFollowers<SmallProfileRequestFields>["response"];
export type CircleType = "followers" | "followees";

export const circleHeaderFields = [
  "username",
  "name",
  "isVerified",
] as const satisfies Readonly<Array<GetUserFields>>;

export const circleKeys = createQueryKeys("circle", {
  circleType: (circle: CircleType) => ({
    queryKey: [circle],
    contextQueries: {
      username: (username) => ({
        queryKey: [username],
        queryFn: () => circleQuery(username, circle),
      }),
    },
  }),
});

const circleQuery = async (username: string, circle: CircleType) => {
  const res = await getData<CircleResponse>(
    "user/" + username + "/" + circle,
    addQueryParams(smallPreviewProfileFields)
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data!;
};

// Fetch user header info and circle
export const circleLoader =
  (queryClient: QueryClient, circle: CircleType) =>
  async ({ params }: LoaderFunctionArgs) => {
    // User header query
    const { queryKey: headerQueryKey, queryFn: headerQueryFn } = profileKeys
      .username(params.username!)
      ._ctx.fields(circleHeaderFields);

    // User circle query
    const { queryKey: circleQueryKey, queryFn: circleQueryFn } = circleKeys
      .circleType(circle)
      ._ctx.username(params.username!);

    const promsieResults = await Promise.all([
      queryClient.fetchQuery({
        queryKey: headerQueryKey,
        queryFn: headerQueryFn,
      }),
      queryClient.fetchQuery({
        queryKey: circleQueryKey,
        queryFn: circleQueryFn,
      }),
    ]);
    const circleResult = promsieResults[1]!;

    const list =
      circle === "followers"
        ? (circleResult as GetUserFollowers<SmallProfileRequestFields>["response"]["data"])!
            .followers
        : (circleResult as GetUserFollowees<SmallProfileRequestFields>["response"]["data"])!
            .followees;

    // Populate profile cache for each follower / followee to not re-fetch
    list.forEach((user) => {
      queryClient.setQueryData(
        profileKeys
          .username(user.username)
          ._ctx.fields(smallPreviewProfileFields).queryKey,
        {
          user,
        }
      );
    });

    return promsieResults;
  };

export const useCircleMutation = ({
  username,
  queryKeyToInvalidate,
}: {
  username: string;
  queryKeyToInvalidate: readonly string[];
}) => {
  const queryClient = useQueryClient();
  const options: Parameters<typeof useMutation<NormalResponse>>["0"] = {
    onSuccess: async (data) => {
      if (data.ok) {
        await queryClient.invalidateQueries({
          queryKey: queryKeyToInvalidate,
        });
      }
    },
  };

  return {
    useFollowMutation: useMutation<NormalResponse, Error, void>({
      mutationFn: () => postData("user/" + username + "/follow", {}),
      ...options,
    }),
    useUnfollowMutation: useMutation<NormalResponse, Error, void>({
      mutationFn: () => deleteData("user/" + username + "/follow"),
      ...options,
    }),
  };
};
