import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import styles from "./Profile.module.scss";
import { ExposedUser, GetUser } from "../../../../backend/src/api/user";
import { useContext, useLayoutEffect } from "react";
import { HeaderProfileContext } from "../../layouts/Main";
import { LoaderData, LoaderFunctionWithExtra } from "../../../util/types";
import { webPath } from "../../../util/paths";
import Icon from "../../../util/components/Icon/Icon";
import optionsIcon from "../../../assets/icons/dots.png";
import notificationsIcon from "../../../assets/icons/notifications.png";
import verifiedIcon from "../../../assets/icons/verified.png";
import Button from "../../../util/components/Button/Button";
import { useAuth } from "../../../util/hooks/useAuth";
import useRequest from "../../../util/hooks/useRequest";
import Info from "./Info/Info";

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
  "website",
  "isFollowedByActiveUser",
] as const satisfies Readonly<Array<keyof ExposedUser>>;

export type RequestFields = typeof userFields[number];
type Extra = ReturnType<typeof useRequest>["getData"];
export const profileLoader = (async (
  { params }: LoaderFunctionArgs,
  getData: Extra
) => {
  const data = await getData<GetUser<RequestFields>["response"], RequestFields>(
    "user/" + params.username,
    userFields
  );

  if (!data.ok) {
    throw new Error();
  }

  return data;
}) satisfies LoaderFunctionWithExtra<Extra>;

const Profile = ({}: ProfileProps) => {
  const { user: activeUser } = useAuth();
  const { setUser } = useContext(HeaderProfileContext);
  const res = useLoaderData() as LoaderData<
    typeof profileLoader,
    ReturnType<typeof useRequest>["getData"]
  >;
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
      <div className={styles.ProfileInfo}>
        <div className={styles.Title}>
          <div className={styles.NameAndVerified}>
            <h1>{user.name}</h1>
            {user.isVerified ? <Icon src={verifiedIcon} hover="none" /> : null}
          </div>
          <div className={[styles.LightColor, styles.Username].join(" ")}>
            @{user.username}
          </div>
        </div>
        <div className={styles.Bio}>{user.bio}</div>
        <Info user={user} />
        <div className={styles.Friendship}>
          <div>
            <b>{user.totalFollowees}</b>{" "}
            <span className={styles.LightColor}>Following</span>{" "}
          </div>
          <div>
            <b>{user.totalFollowers}</b>{" "}
            <span className={styles.LightColor}>Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
