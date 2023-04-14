import Minipage from "../../../../util/layouts/Minipage/Minipage";
import { UserProfileT } from "../Profile";
import styles from "./EditProfile.module.scss";
import EditProfileHeader from "./EditProfileHeader/EditProfileHeader";
import EditProfileInfo from "./EditProfileInfo/EditProfileInfo";
import EditProfilePhotos from "./EditProfilePhotos/EditProfilePhotos";

interface EditProfileProps {
  user: UserProfileT;
}

const EditProfile = ({ user }: EditProfileProps) => {
  return (
    <Minipage alignHeaderWithContent={false} header={<EditProfileHeader />}>
      <div className={styles.EditProfile}>
        <EditProfilePhotos coverPic={user.coverPic} avatar={user.avatar} />
        <EditProfileInfo user={user} />
      </div>
    </Minipage>
  );
};

export default EditProfile;
