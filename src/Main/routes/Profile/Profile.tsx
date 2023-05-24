import { Link, LoaderFunctionArgs, useParams } from "react-router-dom";
import styles, { ProfileNames } from "./Profile.module.scss";
import { GetUser } from "../../../../backend/src/api/user";
import { useContext, useLayoutEffect, useState } from "react";
import { HeaderProfileContext } from "../../layouts/Main";
import Icon from "../../../util/components/Icon/Icon";
import optionsIcon from "../../../assets/icons/dots.png";
import notificationsIcon from "../../../assets/icons/notifications.png";
import verifiedIcon from "../../../assets/icons/verified.png";
import Button from "../../../util/components/Button/Button";
import useRequest from "../../../util/hooks/requests/useRequest";
import Info from "./Info/Info";
import Modal from "../../../util/components/Modal/Modal";
import EditProfile from "./EditProfile/EditProfile";
import { GetUserFields } from "../../../../backend/src/permissions";
import { defaultAvatar, defaultCoverColor } from "./defaultPics";
import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { shallow } from "zustand/shallow";
import { getPagePath } from "../../../util/paths";
import { useCircleRequest } from "../../../util/hooks/requests/useCircleRequest";

interface ProfileProps {
  // If preview is provided, take username from it instead of from router path
  // and show a preview instead of the full profile
  preview?: {
    username: string;
    size: "medium" | "small";
  };
  noFetch?: boolean;
}

// Fields to query in small preview mode
export const smallPreviewProfileFields = [
  "avatar",
  "bio",
  "id",
  "isVerified",
  "name",
  "username",
  "isFollowedByActiveUser",
] as const satisfies Readonly<Array<GetUserFields>>;

// Fields to query in medium preview mode
const mediumPreviewProfileFields = [
  ...smallPreviewProfileFields,
  "totalFollowees",
  "totalFollowers",
] as const satisfies Readonly<Array<GetUserFields>>;

// Fields to query in full profile mode
export const fullProfileFields = [
  ...mediumPreviewProfileFields,
  "birthDate",
  "joinedDate",
  "coverPic",
  "location",
  "totalTweets",
  "website",
] as const satisfies Readonly<Array<GetUserFields>>;

type FullProfileRequestFields = typeof fullProfileFields[number];
export type SmallProfileRequestFields =
  typeof smallPreviewProfileFields[number];
type FullProfileResponse = GetUser<FullProfileRequestFields>["response"];

// User prop passed to EditProfile
export type UserProfileT = NonNullable<FullProfileResponse["data"]>["user"];

export const getProfileQueryKey = <T extends Readonly<Array<GetUserFields>>>(
  username: string,
  fieldsToQuery: T
) => ["userProfile", username, ...fieldsToQuery];

// Get specific user profile information, according to fieldsToQuery.
// Type safety ensures that the query result's properties will be limited only
// to the ones mentioned on fieldsToQuery.
export const getProfileQuery = <T extends Readonly<Array<GetUserFields>>>(
  username: string,
  getData: ReturnType<typeof useRequest>["getData"],
  fieldsToQuery: T,
  enabled = true
): UseQueryOptions<FullProfileResponse> => ({
  queryKey: getProfileQueryKey(username, fieldsToQuery),
  queryFn: async () => {
    const res = await getData<GetUser<T[number]>["response"], T[number]>(
      "user/" + username,
      fieldsToQuery
    );

    if (!res.ok) {
      throw new Error();
    }
    return res;
  },
  enabled,
});

// On profile load from URL, fetch the full profile
export const profileLoader =
  (
    getData: ReturnType<typeof useRequest>["getData"],
    queryClient: QueryClient
  ) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = getProfileQuery(params.username!, getData, fullProfileFields);
    const data = await queryClient.ensureQueryData<
      FullProfileResponse,
      unknown,
      FullProfileResponse,
      any
    >({ queryKey: query.queryKey, queryFn: query.queryFn });
    return data;
  };

const Profile = ({ preview, noFetch = false }: ProfileProps) => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { id: state.loggedInUser.id },
    shallow
  );
  const { setUserHeader } = useContext(HeaderProfileContext);
  const { getData } = useRequest();
  const params = useParams();
  const username = preview ? preview.username : params.username!;

  let fieldsToQuery: Readonly<Array<GetUserFields>> = fullProfileFields;
  if (preview && preview.size === "medium") {
    fieldsToQuery = mediumPreviewProfileFields;
  } else if (preview && preview.size === "small") {
    fieldsToQuery = smallPreviewProfileFields;
  }

  const { data, isLoading } = useQuery(
    getProfileQuery(username, getData, fieldsToQuery, !noFetch)
  );
  const user = data?.data?.user!;

  const { useFollowMutation, useUnfollowMutation } = useCircleRequest({
    username,
    queryKeyToInvalidate: getProfileQueryKey(username, fieldsToQuery),
  });

  useLayoutEffect(() => {
    // Set header context after we fetch user information
    if (!isLoading && !preview) {
      setUserHeader(user);
    }
  }, [user, setUserHeader, preview, isLoading]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return null;
  }

  const actionButtonKey =
    user.id.toString() +
    (user.isFollowedByActiveUser ? "followed" : "not followed");
  let actionButton: React.ReactElement | null = (
    <Button
      color="black"
      size={preview && preview.size === "small" ? "small" : undefined}
      key={user.id.toString() + user.isFollowedByActiveUser}
      onClick={() => useFollowMutation.mutate()}
    >
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
        key={actionButtonKey}
        onClick={() => useUnfollowMutation.mutate()}
      >
        Following
      </Button>
    );
  } else if (loggedInUser && loggedInUser.id === user.id) {
    if (!preview) {
      actionButton = (
        <Button
          color="white"
          onClick={() => setIsModalOpen(true)}
          key={user.id}
        >
          Edit profile
        </Button>
      );
    } else {
      actionButton = null;
    }
  }

  const coverStyle: React.CSSProperties = user.coverPic
    ? { backgroundImage: "url(" + user.coverPic + ")" }
    : { backgroundColor: defaultCoverColor };

  let previewStyles: ProfileNames[] = [];
  if (preview) {
    previewStyles = [
      styles.Preview,
      preview.size === "medium" ? styles.Medium : styles.Small,
    ];
  }

  return (
    <>
      {isModalOpen && (
        <Modal withCloseIcon={false} setIsActive={setIsModalOpen}>
          <EditProfile user={user} closeModal={() => setIsModalOpen(false)} />
        </Modal>
      )}
      <div className={[styles.Profile, ...previewStyles].join(" ")}>
        {!preview && <div className={styles.Cover} style={coverStyle} />}
        <img
          className={styles.Avatar}
          src={user.avatar || defaultAvatar}
          alt="The avatar of the user"
        />
        <div className={styles.Actions}>
          {!preview && (
            <>
              <Icon src={optionsIcon} withBorder title="More" />
              {user.isFollowedByActiveUser && (
                <Icon src={notificationsIcon} withBorder title="Notify" />
              )}
            </>
          )}
          {actionButton}
        </div>
        <div className={styles.Title}>
          <div className={styles.NameAndVerified}>
            <h1>{user.name}</h1>
            {user.isVerified ? (
              <Icon
                src={verifiedIcon}
                hover="none"
                extraStyles={[styles.Verified]}
              />
            ) : null}
          </div>
          <div className={[styles.LightColor, styles.Username].join(" ")}>
            @{user.username}
          </div>
        </div>
        <div className={styles.ProfileInfo}>
          <div className={styles.Bio}>{user.bio}</div>
          {!preview && <Info user={user} />}
          {(!preview || (preview && preview.size === "medium")) && (
            <div className={styles.Friendship}>
              <Link to={getPagePath("following", user.username)}>
                <b>{user.totalFollowees}</b>{" "}
                <span className={styles.LightColor}>Followees</span>
              </Link>
              <Link to={getPagePath("followers", user.username)}>
                <b>{user.totalFollowers}</b>{" "}
                <span className={styles.LightColor}>Followers</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
