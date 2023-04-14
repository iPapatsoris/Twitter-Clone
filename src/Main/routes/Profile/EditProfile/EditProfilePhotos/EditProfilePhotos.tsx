import { webPath } from "../../../../../util/paths";
import AddPhotoButton from "./AddPhotoButton";
import styles from "./EditProfilePhotos.module.scss";

interface EditProfilePhotosProps {
  coverPic: string;
  avatar: string;
}

const EditProfilePhotos = ({ coverPic, avatar }: EditProfilePhotosProps) => (
  <>
    <div
      className={styles.Cover}
      style={{ backgroundImage: "url(" + webPath(coverPic) + ")" }}
    >
      <AddPhotoButton alt="Change cover" />
    </div>
    <div
      className={styles.Avatar}
      style={{ backgroundImage: "url(" + webPath(avatar) + ")" }}
    >
      <AddPhotoButton alt="Change avatar" />
    </div>
  </>
);

export default EditProfilePhotos;
