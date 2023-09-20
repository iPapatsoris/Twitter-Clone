import { Outlet, useParams } from "react-router-dom";
import styles from "./Profile.module.scss";
import ProfileFace from "./ProfileFace/ProfileFace";
import HeaderLinkMenu from "../../layouts/Header/HeaderMain/HeaderLinkMenu/HeaderLinkMenu";
import { ComponentProps } from "react";

export interface ProfileProps {
  // If preview is provided, take username from it instead of from router path
  // and show a preview instead of the full profile
  preview?: {
    username: string;
    type: "hover" | "user-list";
    includeBio?: boolean;
    iconAction?: React.ReactElement;
    noNavOnClick?: boolean;
    noPreviewOnHover?: boolean;
    showJustAvatar?: boolean;
  };
}

const Profile = ({ preview }: ProfileProps) => {
  const params = useParams();
  const username = preview ? preview.username : params.username!;

  const tweetDisplayOptions: ComponentProps<typeof HeaderLinkMenu>["items"] = [
    { page: "profile", title: "Tweets", username: username },
    { page: "profileWithReplies", title: "Replies", username: username },
    { page: "profileLikes", title: "Likes", username: username },
  ];

  return (
    <>
      <ProfileFace preview={preview} />
      {!preview && (
        <>
          <HeaderLinkMenu
            extraStyles={[styles.TweetMenu]}
            items={tweetDisplayOptions}
          />
          <Outlet context={username} />
        </>
      )}
    </>
  );
};

export default Profile;
