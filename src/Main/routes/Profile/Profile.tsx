import { LoaderFunction, useLoaderData } from "react-router-dom";
import styles from "./Profile.module.scss";
import { GetUser, GetUserFields } from "../../../../backend/src/api/user";
import { getData } from "../../../util/api";
import { useContext, useLayoutEffect } from "react";
import { HeaderProfileContext, HeaderProfileUser } from "../../layouts/Main";
import { LoaderData } from "../../../util/types";

interface ProfileProps {}

export const profileLoader = (async ({ params }) => {
  const data = await getData<GetUser["response"], GetUserFields>(
    "user/" + params.username,
    [
      "avatar",
      "bio",
      "birthDate",
      "joinedDate",
      "coverPic",
      "id",
      "isVerified",
      "location",
      "name",
      "totalFollowees",
      "totalFollowers",
      "totalTweets",
    ]
  );

  if (!data.ok) {
    throw new Error();
  }

  return data;
}) satisfies LoaderFunction;

const Profile = ({}: ProfileProps) => {
  const { setUser } = useContext(HeaderProfileContext);
  const data = useLoaderData() as LoaderData<typeof profileLoader>;

  useLayoutEffect(() => {
    const user = data.data?.user as HeaderProfileUser;
    setUser(user);
  }, [data, setUser]);

  return <span>Profile</span>;
};

export default Profile;
