import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styles from "./Profile.module.scss";
import { GetUser, GetUserFields } from "../../../../backend/src/api/user";
import { getData } from "../../../util/api";
import { useContext } from "react";
import { HeaderProfileContext } from "../../layouts/Main";

interface ProfileProps {}

const Profile = ({}: ProfileProps) => {
  const { setUser } = useContext(HeaderProfileContext);
  const { username } = useParams();
  const { data } = useQuery<GetUser["response"]>(
    ["userProfile"],
    () => {
      return getData<GetUserFields>("user/" + username, [
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
      ]);
    },
    {
      onSuccess(data) {
        const { name, totalTweets } = data.data!.user;
        if (name !== undefined && totalTweets !== undefined) {
          setUser({ name, totalTweets });
        }
      },
    }
  );
  return null;
};

export default Profile;
