import photoIcon from "../../../../../assets/icons/photo.png";
import styles from "./EditProfilePhotos.module.scss";

interface AddPhotoButtonProps {
  alt: string;
}

const AddPhotoButton = ({ alt }: AddPhotoButtonProps) => (
  <div className={styles.AddPhoto}>
    <img src={photoIcon} title="Add photo" alt={alt} />
  </div>
);

export default AddPhotoButton;
