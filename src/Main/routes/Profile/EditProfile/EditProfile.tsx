import Minipage from "../../../../util/layouts/Minipage/Minipage";
import styles from "./EditProfile.module.scss";
import EditProfileHeader from "./EditProfileHeader/EditProfileHeader";

interface EditProfileProps<T> {
  user: T;
}

const EditProfile = <T,>({ user }: EditProfileProps<T>) => {
  return (
    <Minipage header={<EditProfileHeader />}>
      <div className={styles.EditProfile}>
        <div className={styles.Content}> Edit</div>
      </div>
    </Minipage>
  );
};

export default EditProfile;
