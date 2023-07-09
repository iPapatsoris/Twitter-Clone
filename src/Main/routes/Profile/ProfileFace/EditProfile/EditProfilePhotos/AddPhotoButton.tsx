import photoIcon from "../../../../../../assets/icons/photo.png";
import styles from "./EditProfilePhotos.module.scss";

interface AddPhotoButtonProps {
  alt: string;
  onClick: VoidFunction;
}

const AddPhotoButton = ({ alt, onClick }: AddPhotoButtonProps) => (
  <div className={styles.AddPhoto} onClick={onClick}>
    <img src={photoIcon} title="Add photo" alt={alt} />
  </div>
);

export default AddPhotoButton;
