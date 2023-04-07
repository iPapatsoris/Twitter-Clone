import { LoaderFunction, useLoaderData } from "react-router-dom";
import styles from "./Profile.module.scss";
import { ExposedUser, GetUser } from "../../../../backend/src/api/user";
import { getData } from "../../../util/api";
import { useContext, useLayoutEffect } from "react";
import { HeaderProfileContext } from "../../layouts/Main";
import { LoaderData } from "../../../util/types";
import { webPath } from "../../../util/paths";
import Icon from "../../../util/components/Icon/Icon";
import optionsIcon from "../../../assets/icons/dots.png";
import notificationsIcon from "../../../assets/icons/notifications.png";
import Button from "../../../util/components/Button/Button";
import { useAuth } from "../../../util/hooks/useAuth";

interface ProfileProps {}

const userFields = [
  "avatar",
  "bio",
  "birthDate",
  "joinedDate",
  "coverPic",
  "id",
  "isVerified",
  "location",
  "name",
  "username",
  "totalFollowees",
  "totalFollowers",
  "totalTweets",
  "isFollowedByActiveUser",
] as const satisfies Readonly<Array<keyof ExposedUser>>;

type RequestFields = typeof userFields[number];

export const profileLoader = (async ({ params }) => {
  const data = await getData<GetUser<RequestFields>["response"], RequestFields>(
    "user/" + params.username,
    userFields
  );

  if (!data.ok) {
    throw new Error();
  }

  return data;
}) satisfies LoaderFunction;

const Profile = ({}: ProfileProps) => {
  const { user: activeUser } = useAuth();
  const { setUser } = useContext(HeaderProfileContext);
  const res = useLoaderData() as LoaderData<typeof profileLoader>;
  const user = res.data!.user;

  useLayoutEffect(() => {
    const user = res.data?.user!;
    setUser(user);
  }, [res, setUser]);

  let actionButton = <Button color="black">Follow</Button>;
  if (activeUser && user.isFollowedByActiveUser) {
    actionButton = (
      <Button
        color="white"
        hoverColor="red"
        hoverText="Unfollow"
        extraClasses={[styles.FollowButton]}
      >
        Following
      </Button>
    );
  } else if (activeUser && activeUser.id === user.id) {
    actionButton = <Button color="white">Edit profile</Button>;
  }

  return (
    <div className={styles.Profile}>
      <img
        className={styles.Cover}
        src={webPath(user.coverPic)}
        alt="The profile cover of the user"
      />
      <div className={styles.AvatarAndActions}>
        <div className={styles.AvatarContainer}>
          <img
            className={styles.Avatar}
            src={webPath(user.avatar)}
            alt="The avatar of the user"
          />
          <div className={styles.Actions}>
            <Icon src={optionsIcon} withBorder title="More" />
            {user.isFollowedByActiveUser && (
              <Icon src={notificationsIcon} withBorder title="Notify" />
            )}
            {actionButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
