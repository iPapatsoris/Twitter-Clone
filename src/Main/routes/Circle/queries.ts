import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  QueryClient,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { NormalResponse } from "../../../../backend/src/api/common";
import {
  GetUser,
  GetUserFollowees,
  GetUserFollowers,
} from "../../../../backend/src/api/user";
import { GetUserFields } from "../../../../backend/src/permissions";
import useRequest from "../../../util/hooks/requests/useRequest";
import {
  getProfileQuery,
  profileKeys,
  smallPreviewProfileFields,
  SmallProfileRequestFields,
} from "../Profile/queries";

type CircleResponse =
  | GetUserFollowees<SmallProfileRequestFields>["response"]
  | GetUserFollowers<SmallProfileRequestFields>["response"];
export type CircleType = "followers" | "followees";

export const circleHeaderFields = [
  "username",
  "name",
  "isVerified",
] as const satisfies Readonly<Array<GetUserFields>>;
type UserHeaderResponse = GetUser<
  typeof circleHeaderFields[number]
>["response"];

export const circleKeys = createQueryKeys("circle", {
  circleType: (circle: CircleType) => ({
    queryKey: [circle],
    contextQueries: {
      username: (username) => ({ queryKey: [username] }),
    },
  }),
});

// export const circleKeys = {
//   all: (circle: CircleType) => [circle],
//   username: (circle: CircleType, username: string) => [
//     ...circleKeys.all(circle),
//     username,
//   ],
// };

export const getCircleQuery: (
  username: string,
  getData: ReturnType<typeof useRequest>["getData"],
  circle: CircleType
) => UseQueryOptions<CircleResponse> = (username, getData, circle) => ({
  queryKey: circleKeys.circleType(circle)._ctx.username(username).queryKey,
  queryFn: async () => {
    const res = await getData<CircleResponse>(
      "user/" + username + "/" + circle,
      smallPreviewProfileFields
    );

    if (!res.ok) {
      throw new Error();
    }
    return res;
  },
});

// Fetch user header info and circle
export const circleLoader =
  (
    getData: ReturnType<typeof useRequest>["getData"],
    queryClient: QueryClient,
    circle: CircleType
  ) =>
  async ({ params }: LoaderFunctionArgs) => {
    // User header query
    const query = getProfileQuery(
      params.username!,
      getData,
      circleHeaderFields
    );

    // User circle query
    const circleQuery = getCircleQuery(params.username!, getData, circle);

    const promsieResults = await Promise.all([
      queryClient.ensureQueryData<
        UserHeaderResponse,
        unknown,
        UserHeaderResponse,
        any
      >({ queryKey: query.queryKey, queryFn: query.queryFn }),
      queryClient.ensureQueryData<CircleResponse, unknown, CircleResponse, any>(
        { queryKey: circleQuery.queryKey, queryFn: circleQuery.queryFn }
      ),
    ]);
    const circleResult = promsieResults[1];

    const list =
      circle === "followers"
        ? (circleResult.data as GetUserFollowers<SmallProfileRequestFields>["response"]["data"])!
            .followers
        : (circleResult.data as GetUserFollowees<SmallProfileRequestFields>["response"]["data"])!
            .followees;

    // Populate profile cache for each follower / followee to not re-fetch
    list.forEach((user) => {
      queryClient.setQueryData(
        profileKeys
          .username(user.username)
          ._ctx.fields(smallPreviewProfileFields).queryKey,
        {
          ...circleResult,
          data: { user },
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
      () => postData("user/" + username + "/follow", {}),
      options
    ),
    useUnfollowMutation: useMutation<NormalResponse, unknown, void>(
      () => deleteData("user/" + username + "/follow"),
      options
    ),
  };
};
