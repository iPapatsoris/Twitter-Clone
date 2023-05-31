import { Link, useNavigate, useParams } from "react-router-dom";
import styles, { ProfileNames } from "./Profile.module.scss";
import React, {
  ComponentProps,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { HeaderProfileContext } from "../../layouts/Main";
import Icon from "../../../util/components/Icon/Icon";
import optionsIcon from "../../../assets/icons/dots.png";
import notificationsIcon from "../../../assets/icons/notifications.png";
import verifiedIcon from "../../../assets/icons/verified.png";
import Button from "../../../util/components/Button/Button";
import Info from "./Info/Info";
import Modal from "../../../util/components/Modal/Modal";
import EditProfile from "./EditProfile/EditProfile";
import { defaultCoverColor } from "./defaultPics";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/AuthStore";
import { shallow } from "zustand/shallow";
import { getPagePath } from "../../../util/paths";
import {
  fullProfileFields,
  FullProfileRequestFields,
  mediumPreviewProfileFields,
  profileKeys,
  smallPreviewProfileFields,
} from "./queries";
import { useCircleMutation } from "../Circle/queries";
import Avatar from "./Avatar/Avatar";

interface ProfileProps {
  // If preview is provided, take username from it instead of from router path
  // and show a preview instead of the full profile
  preview?: {
    username: string;
    size: "medium" | "small";
    includeBio?: boolean;
    iconAction?: React.ReactElement;
    noNavOnClick?: boolean;
  };
}

const Profile = ({ preview }: ProfileProps) => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { id: state.loggedInUser.id },
    shallow
  );
  const { setUserHeader } = useContext(HeaderProfileContext);
  const navigate = useNavigate();
  const params = useParams();
  const username = preview ? preview.username : params.username!;

  let fieldsToQuery: Readonly<FullProfileRequestFields[]> = fullProfileFields;
  if (preview && preview.size === "medium") {
    fieldsToQuery = mediumPreviewProfileFields;
  } else if (preview && preview.size === "small") {
    fieldsToQuery = smallPreviewProfileFields;
  }

  const { data, isLoading } = useQuery(
    profileKeys.username(username)._ctx.fields(fieldsToQuery)
  );
  const user = data?.data?.user!;

  const { useFollowMutation, useUnfollowMutation } = useCircleMutation({
    username,
    queryKeyToInvalidate: profileKeys
      .username(username)
      ._ctx.fields(fieldsToQuery).queryKey,
  });

  useLayoutEffect(() => {
    // Set header context after we fetch user information
    if (!isLoading && !preview) {
      setUserHeader(user);
    }
  }, [user, setUserHeader, preview, isLoading]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Action / navigation refs to detect clicking on profile preview except those
  const buttonRef = useRef<HTMLButtonElement>(null);
  const followersRef = useRef<HTMLAnchorElement>(null);
  const followingRef = useRef<HTMLAnchorElement>(null);

  if (isLoading) {
    return null;
  }

  const visitFullProfile = (e: any) => {
    if (
      preview &&
      !preview.noNavOnClick &&
      e.target instanceof Node &&
      !buttonRef.current?.contains(e.target) &&
      !followersRef.current?.contains(e.target) &&
      !followingRef.current?.contains(e.target)
    ) {
      navigate(getPagePath("profile", username));
    }
  };

  const circleButtonKey =
    user.id.toString() +
    (user.isFollowedByActiveUser ? "followed" : "not followed");

  const circleButtonProps: Partial<ComponentProps<typeof Button>> = {
    key: circleButtonKey,
    // extraClasses: [!preview ? styles.FixedWidthButton : ""],
    extraClasses: [styles.FixedWidthButton],
    ref: buttonRef,
  };

  let actionButton: React.ReactElement | null = (
    <Button
      color="black"
      size={preview && preview.size === "small" ? "small" : undefined}
      onClick={() => useFollowMutation.mutate()}
      {...circleButtonProps}
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
        {...circleButtonProps}
        extraClasses={[styles.FixedWidthButton]}
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
      <div
        onClick={visitFullProfile}
        className={[styles.Profile, ...previewStyles].join(" ")}
      >
        {!preview && <div className={styles.Cover} style={coverStyle} />}
        <Avatar src={user.avatar} withBorder={!preview} />
        <div className={styles.Actions}>
          {!preview && (
            <>
              <Icon src={optionsIcon} withBorder title="More" />
              {user.isFollowedByActiveUser && (
                <Icon src={notificationsIcon} withBorder title="Notify" />
              )}
            </>
          )}
          {preview && preview.iconAction ? preview.iconAction : actionButton}
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
          {(!preview || preview.includeBio) && (
            <div className={styles.Bio}>{user.bio}</div>
          )}
          {!preview && <Info user={user} />}
          {(!preview || (preview && preview.size === "medium")) && (
            <div className={styles.Friendship}>
              <Link
                ref={followersRef}
                to={getPagePath("following", user.username)}
              >
                <b>{user.totalFollowees}</b>{" "}
                <span className={styles.LightColor}>Followees</span>
              </Link>
              <Link
                ref={followingRef}
                to={getPagePath("followers", user.username)}
              >
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
