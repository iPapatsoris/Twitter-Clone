import styles from "./Avatar.module.scss";
import { defaultAvatar } from "../defaultPics";
import { UserProfileT } from "../queries";

interface AvatarProps {
  src: UserProfileT["avatar"];
  withBorder?: boolean;
  children?: React.ReactElement;
  extraClasses?: string[];
}

const Avatar = ({
  src,
  withBorder,
  extraClasses = [],
  children,
}: AvatarProps) => {
  const classes = [
    ...extraClasses,
    styles.Avatar,
    withBorder ? styles.Border : " ",
  ];

  return children ? (
    <div
      className={[styles.AsBackground, ...classes].join(" ")}
      style={{
        backgroundImage: "url(" + (src || defaultAvatar) + ")",
      }}
    >
      {children}
    </div>
  ) : (
    <img
      className={[...classes].join(" ")}
      src={src || defaultAvatar}
      alt="The avatar of the user"
    />
  );
};

export default Avatar;
