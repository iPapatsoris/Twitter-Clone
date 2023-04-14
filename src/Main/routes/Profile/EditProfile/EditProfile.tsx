import Minipage from "../../../../util/layouts/Minipage/Minipage";
import { webPath } from "../../../../util/paths";
import { UserProfileT } from "../Profile";
import AddPhotoButton from "./AddPhotoButton";
import styles from "./EditProfile.module.scss";
import EditProfileHeader from "./EditProfileHeader/EditProfileHeader";

interface EditProfileProps {
  user: UserProfileT;
}

const EditProfile = ({ user }: EditProfileProps) => {
  return (
    <Minipage alignHeaderWithContent={false} header={<EditProfileHeader />}>
      <div className={styles.EditProfile}>
        <div
          className={styles.Cover}
          style={{ backgroundImage: "url(" + webPath(user.coverPic) + ")" }}
        >
          <AddPhotoButton alt="Change cover" />
        </div>
        <div
          className={styles.Avatar}
          style={{ backgroundImage: "url(" + webPath(user.avatar) + ")" }}
        >
          <AddPhotoButton alt="Change avatar" />
        </div>
        <div className={styles.Content}>content</div>
      </div>
    </Minipage>
  );
};

export default EditProfile;
