import { useQuery } from "@tanstack/react-query";
import { useContext, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import {
  GetUserFollowees,
  GetUserFollowers,
} from "../../../../backend/src/api/user";
import useRequest from "../../../util/hooks/useRequest";
import { getPagePath, useRouteMatch } from "../../../util/paths";
import { HeaderProfileContext } from "../../layouts/Main";
import { getProfileQuery, SmallProfileRequestFields } from "../Profile/queries";
import Profile from "../Profile/Profile";
import { CircleType, circleHeaderFields, getCircleQuery } from "./queries";
import styles from "./Circle.module.scss";

const Circle = () => {
  const isFollowersPage = useRouteMatch(getPagePath("followers"));
  const circle: CircleType = isFollowersPage ? "followers" : "followees";
  const { username } = useParams();
  const { getData } = useRequest();

  const { data: headerData, isSuccess: isHeaderSuccess } = useQuery(
    getProfileQuery(username!, getData, circleHeaderFields)
  );

  const {
    data: circleData,
    isSuccess: isCircleSuccess,
    isFetching,
  } = useQuery(getCircleQuery(username!, getData, circle));
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

  if (!isHeaderSuccess || !isCircleSuccess || isFetching) {
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
