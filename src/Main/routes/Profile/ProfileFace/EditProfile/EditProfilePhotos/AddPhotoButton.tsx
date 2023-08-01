import {ReactComponent as PhotoIcon } from "../../../../../../assets/icons/photo.svg";
import Icon from "../../../../../../util/components/Icon/Icon";
import styles from "./EditProfilePhotos.module.scss";

interface AddPhotoButtonProps {
  alt: string;
  onClick: VoidFunction;
}

const AddPhotoButton = ({ alt, onClick }: AddPhotoButtonProps) => (
  <div className={styles.AddPhoto} onClick={onClick}>
    <Icon src={PhotoIcon} title="Add photo" alt={alt} />
  </div>
);

export default AddPhotoButton;
