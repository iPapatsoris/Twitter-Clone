import {
  FetchQueryOptions,
  QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext, useEffect, useLayoutEffect } from "react";
import { LoaderFunctionArgs, useParams } from "react-router-dom";
import { NormalResponse } from "../../../../backend/src/api/common";
import {
  GetUser,
  GetUserFollowees,
  GetUserFollowers,
  UserWithExtra,
} from "../../../../backend/src/api/user";
import { GetUserFields } from "../../../../backend/src/permissions";
import useRequest from "../../../util/hooks/useRequest";
import { getPagePath, useRouteMatch } from "../../../util/paths";
import { HeaderProfileContext } from "../../layouts/Main";
import Profile, {
  getProfileQuery,
  profileQueryKey,
  smallPreviewProfileFields,
} from "../Profile/Profile";
import styles from "./Circle.module.scss";

interface CircleProps {}

type CircleResponse =
  | GetUserFollowees["response"]
  | GetUserFollowers["response"];
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
) => FetchQueryOptions<CircleResponse> = (username, getData, circle) => ({
  queryKey: [circle, username],
  queryFn: async () => {
    const res = await getData<CircleResponse>(
      "user/" + username + "/" + circle
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

    // return await queryClient.fetchQuery(circleQuery);

    // return await queryClient.ensureQueryData<
    //   CircleResponse,
    //   unknown,
    //   CircleResponse,
    //   any
    // >({ queryKey: circleQuery.queryKey, queryFn: circleQuery.queryFn });

    return await Promise.all([
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
  };

const Circle = ({}: CircleProps) => {
  const isFollowersPage = useRouteMatch(getPagePath("followers"));
  const circle: Circle = isFollowersPage ? "followers" : "followees";
  const { username } = useParams();
  const { getData } = useRequest();
  const queryClient = useQueryClient();

  const { data: headerData, isSuccess: isHeaderSuccess } = useQuery(
    getProfileQuery(username!, getData, circleHeaderFields)
  );

  const { data: circleData, isSuccess: isCircleSuccess } = useQuery(
    getCircleQuery(username!, getData, circle)
  );
  const { setUserHeader } = useContext(HeaderProfileContext);

  useEffect(() => {
    console.log("on success");

    console.log(circleData);

    const list =
      circle === "followers"
        ? (circleData!.data as GetUserFollowers["response"]["data"])!.followers
        : (circleData!.data as GetUserFollowees["response"]["data"])!.followees;

    list.forEach((user) => {
      console.log("setting query data for ", [
        profileQueryKey,
        user.username,
        ...smallPreviewProfileFields,
      ]);

      queryClient.setQueryData<
        NormalResponse<{
          user: Pick<UserWithExtra, typeof smallPreviewProfileFields[number]>;
        }>
      >([profileQueryKey, user.username, ...smallPreviewProfileFields], {
        ...circleData,
        data: { user: { ...user, isFollowedByActiveUser: true } },
      });
    });
  }, [circleData, isCircleSuccess]);

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
    return "tefhgxt";
  }

  const userList =
    circle === "followers"
      ? (circleData.data as GetUserFollowers["response"]["data"])!.followers
      : (circleData.data as GetUserFollowees["response"]["data"])!.followees;

  const userCircle = userList.map((f) => (
    <Profile
      noFetch
      key={f.id}
      preview={{ username: f.username, size: "small" }}
    />
  ));

  return <div className={styles.Circle}>{userCircle}</div>;
};

export default Circle;
