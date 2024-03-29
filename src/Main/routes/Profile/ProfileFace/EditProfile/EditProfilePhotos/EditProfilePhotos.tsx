import AddPhotoButton from "./AddPhotoButton";
import profileStyles from "../../../Profile.module.scss";
import Avatar from "../../Avatar/Avatar";

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
  const coverStyle: React.CSSProperties =
    coverPic && coverPic !== ""
      ? { backgroundImage: "url(" + coverPic + ")" }
      : { backgroundColor: "rgb(207, 217, 222)" };

  return (
    <>
      <div className={profileStyles.Cover} style={coverStyle}>
        <AddPhotoButton alt="Change cover" onClick={focusOnCover} />
      </div>
      <Avatar src={avatar} withBorder>
        <AddPhotoButton alt="Change avatar" onClick={focusOnAvatar} />
      </Avatar>
    </>
  );
};

export default EditProfilePhotos;
