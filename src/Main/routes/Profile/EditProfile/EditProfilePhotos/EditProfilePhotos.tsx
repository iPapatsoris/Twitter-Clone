import { defaultAvatar } from "../../defaultPics";
import AddPhotoButton from "./AddPhotoButton";
import styles from "./EditProfilePhotos.module.scss";
import profileStyles from "../../Profile.module.scss";

interface EditProfilePhotosProps {
  coverPic?: string;
  avatar?: string;
  focusOnAvatar: VoidFunction;
  focusOnCover: VoidFunction;
}

const EditProfilePhotos = ({
  coverPic,
  avatar,
  focusOnAvatar,
  focusOnCover,
}: EditProfilePhotosProps) => {
  const coverStyle: React.CSSProperties = coverPic
    ? { backgroundImage: "url(" + coverPic + ")" }
    : { backgroundColor: "background-color: rgb(207, 217, 222)" };

  return (
    <>
      <div className={profileStyles.Cover} style={coverStyle}>
        <AddPhotoButton alt="Change cover" onClick={focusOnCover} />
      </div>
      <div
        className={[styles.Avatar, profileStyles.Avatar].join(" ")}
        style={{
          backgroundImage: "url(" + (avatar || defaultAvatar) + ")",
        }}
      >
        <AddPhotoButton alt="Change avatar" onClick={focusOnAvatar} />
      </div>
    </>
  );
};

export default EditProfilePhotos;
