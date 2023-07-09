import { useParams } from "react-router-dom";
import styles from "./Profile.module.scss";
import Tweets from "./Tweets/Tweets";
import ProfileFace from "./ProfileFace/ProfileFace";

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
  };
}

const Profile = ({ preview }: ProfileProps) => {
  const params = useParams();
  const username = preview ? preview.username : params.username!;

  return (
    <>
      <ProfileFace preview={preview} />
      {!preview && (
        <div className={styles.Tweets}>
          <Tweets username={username} />
        </div>
      )}
    </>
  );
};

export default Profile;
