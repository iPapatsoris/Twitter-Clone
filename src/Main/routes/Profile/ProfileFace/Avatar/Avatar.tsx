import styles from "./Avatar.module.scss";
import { defaultAvatar } from "../defaultPics";
import { UserProfileT } from "../queries";
import Icon from "../../../../../util/components/Icon/Icon";
import { getGlobalCssVar } from "../../../../../util/hooks/useMapPropToCssVar";

interface AvatarProps {
  src: UserProfileT["avatar"];
  // If size is not provided, avatar takes the full size of its container
  size?: "full" | "medium" | "small" | "smaller" | "tiny";
  withBorder?: boolean;
  onClick?: VoidFunction;
  children?: React.ReactElement;
  extraClasses?: string[];
}

const Avatar = ({
  src,
  size,
  withBorder,
  onClick,
  extraClasses = [],
  children,
}: AvatarProps) => {
  const classes = [
    ...extraClasses,
    styles.Avatar,
    withBorder ? styles.Border : " ",
  ];

  let avatarSizeCssVar = "--avatar-small-height";
  if (size === "tiny") {
    avatarSizeCssVar = "--avatar-tiny-height";
  } else if (size === "smaller") {
    avatarSizeCssVar = "--avatar-smaller-height";
  } else if (size === "medium") {
    avatarSizeCssVar = "--avatar-medium-height";
  } else if (size === "full") {
    avatarSizeCssVar = "--avatar-full-height";
  }
  const avatarSize = getGlobalCssVar(avatarSizeCssVar);

  return children ? (
    <div
      className={[styles.AsBackground, ...classes].join(" ")}
      style={{
        backgroundImage: "url(" + (src || defaultAvatar) + ")",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  ) : (
    <Icon
      size={avatarSize}
      extraStyles={[styles.Avatar, withBorder ? styles.Border : ""]}
      extraWrapperStyles={[styles.AvatarGridArea]}
      nonSvgSrc={src || defaultAvatar}
      alt="The avatar of the user"
      fullSize={size === undefined}
      hover="none"
      onClick={onClick}
    />
  );
};

export default Avatar;
