import { Link, useNavigate, useParams } from "react-router-dom";
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
import { ReactComponent as OptionsIcon } from "../../../../assets/icons/dots.svg";
import { ReactComponent as NotificationsIcon } from "../../../../assets/icons/notifications.svg";
import { ReactComponent as VerifiedIcon } from "../../../../assets/icons/verified.svg";
import Button from "../../../../util/components/Button/Button";
import Info from "./Info/Info";
import Modal from "../../../../util/components/Modal/Modal";
import EditProfile from "./EditProfile/EditProfile";
import { defaultCoverColor } from "./defaultPics";
import { useQuery } from "@tanstack/react-query";
import { useLoggedInUser } from "../../../../store/AuthStore";
import { getPagePath } from "../../../../util/paths";
import {
  fullProfileFields,
  FullProfileRequestFields,
  mediumPreviewProfileFields,
  profileKeys,
  smallPreviewProfileFields,
} from "./queries";
import { useCircleMutation } from "../../Circle/queries";
import ProfileHoverPreview from "./ProfileHoverPreview";
import { ProfileProps } from "../Profile";
import { elementIsContainedInRefs, refsExist } from "../../../../util/ref";
import { useHoverPopup } from "../../../../util/hooks/useHoverPopup";
import Avatar from "./Avatar/Avatar";

const ProfileFace = ({ preview }: ProfileProps) => {
  const loggedInUser = useLoggedInUser();
  const { setUserHeader } = useContext(HeaderProfileContext);
  const params = useParams();
  const username = preview ? preview.username : params.username!;

  let fieldsToQuery: Readonly<FullProfileRequestFields[]> = fullProfileFields;
  if (
    preview &&
    (preview.type === "hover" || preview.type === "mobile-sidebar")
  ) {
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

  const { isHoverPopupOpen, abortHoverPopupOpen, setIsHoverPopupOpen } =
    useHoverPopup();

  const onMouseEnter = () => {
    if (preview && preview.type !== "hover" && !preview.noPreviewOnHover) {
      setIsHoverPopupOpen(true);
    }
  };

  const onMouseLeave = () => {
    if (preview && preview.type !== "hover" && !preview.noPreviewOnHover) {
      abortHoverPopupOpen();
    }
  };
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Action / navigation refs to detect clicking on profile preview except those
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tweetOptionsRef = useRef<HTMLDivElement>(null);

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
    previewStyles = [styles.Preview];
    switch (preview.type) {
      case "hover":
        previewStyles.push(styles.Hover);
        break;
      case "user-list":
        previewStyles.push(styles.Small);
        break;
      case "mobile-sidebar":
        previewStyles.push(styles.MobileSidebar);
        break;
    }
    if (preview.showJustAvatar) {
      previewStyles.push(styles.JustAvatar);
    }
    if (preview.noPreviewOnHover) {
      previewStyles.push(styles.NoHoverUnderline);
    }
  }

  const visitFullProfile = (e: React.MouseEvent) => {
    if (
      preview &&
      preview.type === "user-list" &&
      refsExist([buttonRef, tweetOptionsRef]) &&
      !elementIsContainedInRefs(e, [buttonRef, tweetOptionsRef])
    ) {
      navigate(getPagePath("profile", user.username));
    }
  };

  const getProfileLink = () => getPagePath("profile", user.username);

  const avatar = (
    <div
      className={styles.Semantic}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Avatar src={user.avatar} withBorder={!preview} />
    </div>
  );

  const finalAvatar =
    !preview || preview.noNavOnClick ? (
      avatar
    ) : (
      <Link className={styles.Semantic} to={getProfileLink()}>
        {avatar}
      </Link>
    );

  const nameAndVerified = (
    <>
      <h1 className={[styles.BiggestText, styles.EllipsisOverlow].join(" ")}>
        {user.name}
      </h1>
      {user.isVerified ? <Icon src={VerifiedIcon} hover="none" /> : null}
    </>
  );

  const usernameText = (
    <div
      className={[
        styles.LightColor,
        styles.BigText,
        styles.EllipsisOverlow,
      ].join(" ")}
    >
      @{user.username}
    </div>
  );

  const actions = (
    <div className={styles.Actions}>
      {!preview && (
        <>
          <Icon
            ref={tweetOptionsRef}
            src={OptionsIcon}
            withBorder
            title="More"
          />
          {user.isFollowedByActiveUser && (
            <Icon src={NotificationsIcon} withBorder title="Notify" />
          )}
        </>
      )}
      {preview && preview.iconAction ? preview.iconAction : actionButton}
    </div>
  );

  const info = (
    <>
      <div
        className={styles.Title}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={styles.NameAndVerified}>
          {!preview || preview.noNavOnClick ? (
            nameAndVerified
          ) : (
            <Link className={styles.Semantic} to={getProfileLink()}>
              {nameAndVerified}
            </Link>
          )}
        </div>
        <div>
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
          <div className={styles.BigText}>{user.bio}</div>
        )}
        {!preview && <Info user={user} />}
        {(!preview || (preview && preview.type !== "user-list")) && (
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
    </>
  );

  return (
    <>
      {isEditModalOpen && (
        <Modal setIsActive={setIsEditModalOpen}>
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
        onClick={visitFullProfile}
        ref={profileRef}
      >
        {!preview && <div className={styles.Cover} style={coverStyle} />}
        {finalAvatar}
        {!(preview && preview.showJustAvatar) && (
          <>
            {(!preview || preview.type !== "mobile-sidebar") && actions}
            {info}
          </>
        )}
      </div>
    </>
  );
};

export default ProfileFace;
