import { UserProfileT } from "../../Profile";
import styles from "./EditProfileInfo.module.scss";

interface EditProfileInfoProps {
  user: UserProfileT;
}

const EditProfileInfo = ({ user }: EditProfileInfoProps) => {
  return <div className={styles.EditProfileInfo}>content</div>;
};

export default EditProfileInfo;
