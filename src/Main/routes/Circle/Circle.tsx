import { useQuery } from "@tanstack/react-query";
import { useContext, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import {
  GetUserFollowees,
  GetUserFollowers,
} from "../../../../backend/src/api/user";
import { getPagePath, useRouteMatch } from "../../../util/paths";
import { HeaderProfileContext } from "../../layouts/Main";
import { profileKeys, SmallProfileRequestFields } from "../Profile/queries";
import Profile from "../Profile/Profile";
import { CircleType, circleHeaderFields, circleKeys } from "./queries";
import List from "../../layouts/ContentRight/List/List";

const Circle = () => {
  const isFollowersPage = useRouteMatch(getPagePath("followers"));
  const circle: CircleType = isFollowersPage ? "followers" : "followees";
  const { username } = useParams();

  const { data: headerData, isSuccess: isHeaderSuccess } = useQuery(
    profileKeys.username(username!)._ctx.fields(circleHeaderFields)
  );

  const {
    data: circleData,
    isSuccess: isCircleSuccess,
    isFetching,
  } = useQuery(circleKeys.circleType(circle)._ctx.username(username!));
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
    <Profile
      key={f.id}
      preview={{ username: f.username, type: "user-list", includeBio: true }}
    />
  ));

  return <List>{userCircle}</List>;
};

export default Circle;
