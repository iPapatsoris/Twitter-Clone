import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useContext, useLayoutEffect } from "react";
import { LoaderFunctionArgs, useParams } from "react-router-dom";
import {
  GetUser,
  GetUserFollowees,
  GetUserFollowers,
} from "../../../../backend/src/api/user";
import { GetUserFields } from "../../../../backend/src/permissions";
import useRequest from "../../../util/hooks/requests/useRequest";
import { getPagePath, useRouteMatch } from "../../../util/paths";
import { HeaderProfileContext } from "../../layouts/Main";
import Profile, {
  getProfileQuery,
  getProfileQueryKey,
  smallPreviewProfileFields,
  SmallProfileRequestFields,
} from "../Profile/Profile";
import styles from "./Circle.module.scss";

interface CircleProps {}

type CircleResponse =
  | GetUserFollowees<SmallProfileRequestFields>["response"]
  | GetUserFollowers<SmallProfileRequestFields>["response"];
type Circle = "followers" | "followees";
const circleHeaderFields = [
  "username",
  "name",
  "isVerified",
] as const satisfies Readonly<Array<GetUserFields>>;
type UserHeaderResponse = GetUser<
  typeof circleHeaderFields[number]
>["response"];

const getCircleQuery: (
  username: string,
  getData: ReturnType<typeof useRequest>["getData"],
  circle: Circle
) => UseQueryOptions<CircleResponse> = (username, getData, circle) => ({
  queryKey: [circle, username],
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
    circle: Circle
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
        getProfileQueryKey(user.username, smallPreviewProfileFields),
        {
          ...circleResult,
          data: { user },
        }
      );
    });

    return promsieResults;
  };

const Circle = ({}: CircleProps) => {
  const isFollowersPage = useRouteMatch(getPagePath("followers"));
  const circle: Circle = isFollowersPage ? "followers" : "followees";
  const { username } = useParams();
  const { getData } = useRequest();

  const { data: headerData, isSuccess: isHeaderSuccess } = useQuery(
    getProfileQuery(username!, getData, circleHeaderFields)
  );

  const { data: circleData, isSuccess: isCircleSuccess } = useQuery(
    getCircleQuery(username!, getData, circle)
  );
  const { setUserHeader } = useContext(HeaderProfileContext);

  useLayoutEffect(() => {
    if (isHeaderSuccess) {
      const { user } = headerData?.data!;
      setUserHeader({
        username: user.username,
        isVerified: user.isVerified,
        name: user.name,
      });
    }
  }, [headerData, username, setUserHeader, isHeaderSuccess]);

  if (!isHeaderSuccess || !isCircleSuccess) {
    return null;
  }

  const userList =
    circle === "followers"
      ? (circleData.data as GetUserFollowers<SmallProfileRequestFields>["response"]["data"])!
          .followers
      : (circleData.data as GetUserFollowees<SmallProfileRequestFields>["response"]["data"])!
          .followees;

  const userCircle = userList.map((f) => (
    <Profile key={f.id} preview={{ username: f.username, size: "small" }} />
  ));

  return <div className={styles.Circle}>{userCircle}</div>;
};

export default Circle;
