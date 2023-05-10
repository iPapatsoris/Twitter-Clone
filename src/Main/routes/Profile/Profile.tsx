import { LoaderFunctionArgs, useParams } from "react-router-dom";
import styles from "./Profile.module.scss";
import { GetUser } from "../../../../backend/src/api/user";
import { useContext, useLayoutEffect, useState } from "react";
import { HeaderProfileContext } from "../../layouts/Main";
import Icon from "../../../util/components/Icon/Icon";
import optionsIcon from "../../../assets/icons/dots.png";
import notificationsIcon from "../../../assets/icons/notifications.png";
import verifiedIcon from "../../../assets/icons/verified.png";
import Button from "../../../util/components/Button/Button";
import useRequest from "../../../util/hooks/useRequest";
import Info from "./Info/Info";
import Modal from "../../../util/components/Modal/Modal";
import EditProfile from "./EditProfile/EditProfile";
import { GetUserFields } from "../../../../backend/src/permissions";
import { defaultAvatar, defaultCoverColor } from "./defaultPics";
import {
  FetchQueryOptions,
  QueryClient,
  QueryKey,
  useQuery,
} from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { shallow } from "zustand/shallow";

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
] as const satisfies Readonly<Array<GetUserFields>>;

export type RequestFields = typeof userFields[number];
type Response = GetUser<RequestFields>["response"];
export type UserProfileT = NonNullable<Response["data"]>["user"];
export const profileQueryKey = "userProfile";

const getProfileQuery: (
  username: string,
  getData: ReturnType<typeof useRequest>["getData"]
) => FetchQueryOptions<Response> = (username, getData) => ({
  queryKey: [profileQueryKey, username],
  queryFn: async () => {
    const res = await getData<Response, RequestFields>(
      "user/" + username,
      userFields
    );

    if (!res.ok) {
      throw new Error();
    }
    return res;
  },
});

export const profileLoader =
  (
    getData: ReturnType<typeof useRequest>["getData"],
    queryClient: QueryClient
  ) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = getProfileQuery(params.username!, getData);
    const data = await queryClient.ensureQueryData<
      Response,
      unknown,
      Response,
      any
    >({ queryKey: query.queryKey, queryFn: query.queryFn });
    return data;
  };

const Profile = ({}: ProfileProps) => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { id: state.loggedInUser.id },
    shallow
  );
  const { setUserHeader } = useContext(HeaderProfileContext);
  const params = useParams();
  const { getData } = useRequest();

  const res = useQuery(getProfileQuery(params.username!, getData));
  const user = res.data?.data?.user!;

  useLayoutEffect(() => {
    setUserHeader(user);
  }, [user, setUserHeader]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  let actionButton = (
    <Button color="black" key={user.id}>
      Follow
    </Button>
  );
  if (loggedInUser && user.isFollowedByActiveUser) {
    actionButton = (
      <Button
        color="white"
        hoverColor="red"
        hoverText="Unfollow"
        extraClasses={[styles.FollowButton]}
        key={user.id}
      >
        Following
      </Button>
    );
  } else if (loggedInUser && loggedInUser.id === user.id) {
    actionButton = (
      <Button color="white" onClick={() => setIsModalOpen(true)} key={user.id}>
        Edit profile
      </Button>
    );
  }

  const coverStyle: React.CSSProperties = user.coverPic
    ? { backgroundImage: "url(" + user.coverPic + ")" }
    : { backgroundColor: defaultCoverColor };

  return (
    <>
      {isModalOpen && (
        <Modal withCloseIcon={false} setIsActive={setIsModalOpen}>
          <EditProfile user={user} closeModal={() => setIsModalOpen(false)} />
        </Modal>
      )}
      <div className={styles.Profile}>
        <div className={styles.Cover} style={coverStyle} />
        <div className={styles.AvatarAndActions}>
          <div className={styles.AvatarContainer}>
            <img
              className={styles.Avatar}
              src={user.avatar || defaultAvatar}
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
              {user.isVerified ? (
                <Icon src={verifiedIcon} hover="none" />
              ) : null}
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
    </>
  );
};

export default Profile;
