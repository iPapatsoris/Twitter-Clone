import {
  FetchQueryOptions,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useContext, useLayoutEffect } from "react";
import { LoaderFunctionArgs, useParams } from "react-router-dom";
import { GetUserFollowers } from "../../../../backend/src/api/user";
import useRequest from "../../../util/hooks/useRequest";
import { getPagePath, useRouteMatch } from "../../../util/paths";
import { HeaderProfileContext } from "../../layouts/Main";
import styles from "./Circle.module.scss";

interface CircleProps {}

type Response = GetUserFollowers["response"];
type Circle = "followers" | "followees";

const getCircleQuery: (
  username: string,
  getData: ReturnType<typeof useRequest>["getData"],
  circle: Circle
) => FetchQueryOptions<Response> = (username, getData, circle) => ({
  queryKey: [circle, username],
  queryFn: async () => {
    const res = await getData<Response>("user/" + username + "/" + circle);

    if (!res.ok) {
      throw new Error();
    }
    return res;
  },
});

export const circleLoader =
  (
    getData: ReturnType<typeof useRequest>["getData"],
    queryClient: QueryClient,
    circle: Circle
  ) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = getCircleQuery(params.username!, getData, circle);
    const data = await queryClient.ensureQueryData<
      Response,
      unknown,
      Response,
      any
    >({ queryKey: query.queryKey, queryFn: query.queryFn });
    return data;
  };

const Circle = ({}: CircleProps) => {
  const isFollowersPage = useRouteMatch(getPagePath("followers"));
  const circle: Circle = isFollowersPage ? "followers" : "followees";
  const { username } = useParams();
  const { getData } = useRequest();
  const { data, isSuccess } = useQuery(
    getCircleQuery(username!, getData, circle)
  );
  const { setUserHeader } = useContext(HeaderProfileContext);

  useLayoutEffect(() => {
    if (isSuccess) {
      setUserHeader({
        totalTweets: -1,
        username: username!,
        isVerified: false,
        name: "fix me",
      });
    }
  }, [username, setUserHeader, isSuccess]);

  return <span>circle</span>;
};

export default Circle;
