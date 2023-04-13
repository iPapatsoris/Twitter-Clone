import Minipage from "../../../../util/layouts/Minipage/Minipage";
import { webPath } from "../../../../util/paths";
import { UserProfileT } from "../Profile";
import styles from "./EditProfile.module.scss";
import EditProfileHeader from "./EditProfileHeader/EditProfileHeader";

interface EditProfileProps {
  user: UserProfileT;
}

const EditProfile = ({ user }: EditProfileProps) => {
  return (
    <Minipage alignHeaderWithContent={false} header={<EditProfileHeader />}>
      <div className={styles.EditProfile}>
        <img
          className={styles.Cover}
          src={webPath(user.coverPic)}
          alt="The profile cover of the user"
        />
        <img
          className={styles.Avatar}
          src={webPath(user.avatar)}
          alt="The avatar of the user"
        />
        <div className={styles.Content}>content</div>
      </div>
    </Minipage>
  );
};

export default EditProfile;
