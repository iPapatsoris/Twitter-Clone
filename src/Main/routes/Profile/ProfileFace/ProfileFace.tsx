import { Link, useParams } from "react-router-dom";
import styles from "../Profile.module.scss";
import React, {
  ComponentProps,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { HeaderProfileContext } from "../../../layouts/Main";
import Icon from "../../../../util/components/Icon/Icon";
import optionsIcon from "../../../../assets/icons/dots.png";
import notificationsIcon from "../../../../assets/icons/notifications.png";
import verifiedIcon from "../../../../assets/icons/verified.png";
import Button from "../../../../util/components/Button/Button";
import Info from "./Info/Info";
import Modal from "../../../../util/components/Modal/Modal";
import EditProfile from "./EditProfile/EditProfile";
import { defaultCoverColor } from "./defaultPics";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store/AuthStore";
import { shallow } from "zustand/shallow";
import { getPagePath } from "../../../../util/paths";
import {
  fullProfileFields,
  FullProfileRequestFields,
  mediumPreviewProfileFields,
  profileKeys,
  smallPreviewProfileFields,
} from "./queries";
import { useCircleMutation } from "../../Circle/queries";
import Avatar from "./Avatar/Avatar";
import ProfileHoverPreview from "./ProfileHoverPreview";
import { ProfileProps } from "../Profile";

const ProfileFace = ({ preview }: ProfileProps) => {
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { id: state.loggedInUser.id },
    shallow
  );
  const { setUserHeader } = useContext(HeaderProfileContext);
  const params = useParams();
  const username = preview ? preview.username : params.username!;

  let fieldsToQuery: Readonly<FullProfileRequestFields[]> = fullProfileFields;
  if (preview && preview.type === "hover") {
    fieldsToQuery = mediumPreviewProfileFields;
  } else if (preview && preview.type === "user-list") {
    fieldsToQuery = smallPreviewProfileFields;
  }

  const { data, isSuccess } = useQuery(
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
    if (isSuccess && !preview) {
      setUserHeader(user);
    }
  }, [user, setUserHeader, preview, isSuccess]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHoverPopupOpen, setIsHoverPopupOpen] = useState(false);
  const onMouseEnter = () => {
    if (preview && preview.type !== "hover" && !preview.noPreviewOnHover) {
      setIsHoverPopupOpen(true);
    }
  };
  const profileRef = useRef<HTMLDivElement>(null);

  // Action / navigation refs to detect clicking on profile preview except those
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!isSuccess) {
    return null;
  }

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
      size={preview && preview.type === "user-list" ? "small" : undefined}
      onClick={(e) => {
        e.stopPropagation();
        useFollowMutation.mutate();
      }}
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
        onClick={(e) => {
          e.stopPropagation();
          useUnfollowMutation.mutate();
        }}
      >
        Following
      </Button>
    );
  } else if (loggedInUser && loggedInUser.id === user.id) {
    if (!preview) {
      actionButton = (
        <Button
          color="white"
          onClick={() => setIsEditModalOpen(true)}
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

  let previewStyles: Array<keyof typeof styles> = [];
  if (preview) {
    previewStyles = [
      styles.Preview,
      preview.type === "hover" ? styles.Hover : styles.Small,
    ];
  }

  const getProfileLink = () => getPagePath("profile", user.username);

  const avatar = (
    <div className={styles.Semantic} onMouseEnter={onMouseEnter}>
      <Avatar src={user.avatar} withBorder={!preview} />
    </div>
  );

  const nameAndVerified = (
    <>
      <h1>{user.name}</h1>
      {user.isVerified ? (
        <Icon src={verifiedIcon} hover="none" extraStyles={[styles.Verified]} />
      ) : null}
    </>
  );

  const usernameText = <span>@{user.username}</span>;

  return (
    <>
      {isEditModalOpen && (
        <Modal withCloseIcon={false} setIsActive={setIsEditModalOpen}>
          <EditProfile
            user={user}
            closeModal={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
      <ProfileHoverPreview
        isOpen={isHoverPopupOpen}
        setIsOpen={setIsHoverPopupOpen}
        targetAreaRef={profileRef}
        username={user.username}
      />
      <div
        className={[styles.Profile, ...previewStyles].join(" ")}
        ref={profileRef}
      >
        {!preview && <div className={styles.Cover} style={coverStyle} />}
        {!preview || preview.noNavOnClick ? (
          avatar
        ) : (
          <Link className={styles.Semantic} to={getProfileLink()}>
            {avatar}
          </Link>
        )}
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
        <div className={styles.Title} onMouseEnter={onMouseEnter}>
          <div className={styles.NameAndVerified}>
            {!preview || preview.noNavOnClick ? (
              nameAndVerified
            ) : (
              <Link className={styles.Semantic} to={getProfileLink()}>
                {nameAndVerified}
              </Link>
            )}
          </div>
          <div className={[styles.LightColor, styles.Username].join(" ")}>
            {!preview || preview.noNavOnClick ? (
              usernameText
            ) : (
              <Link className={styles.Semantic} to={getProfileLink()}>
                {usernameText}
              </Link>
            )}
          </div>
        </div>
        <div className={styles.ProfileInfo}>
          {(!preview || preview.includeBio) && (
            <div className={styles.Bio}>{user.bio}</div>
          )}
          {!preview && <Info user={user} />}
          {(!preview || (preview && preview.type === "hover")) && (
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

export default ProfileFace;
