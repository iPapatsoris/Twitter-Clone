import styles from "./Avatar.module.scss";
import { defaultAvatar } from "../defaultPics";
import { UserProfileT } from "../queries";
import Icon, { IconProps } from "../../../../../util/components/Icon/Icon";

interface AvatarProps {
  src: UserProfileT["avatar"];
  size?: "full" | "medium" | "small";
  withBorder?: boolean;
  children?: React.ReactElement;
  extraClasses?: string[];
  iconProps?: Partial<IconProps>;
}

const Avatar = ({
  src,
  size = "small",
  withBorder,
  extraClasses = [],
  children,
  iconProps,
}: AvatarProps) => {
  const classes = [
    ...extraClasses,
    styles.Avatar,
    withBorder ? styles.Border : " ",
  ];

  const style = getComputedStyle(document.body);
  let avatarSizeCssVar = "--avatar-small-height";
  if (size === "medium") {
    avatarSizeCssVar = "--avatar-medium-height";
  } else if (size === "full") {
    avatarSizeCssVar = "--avatar-full-height";
  }
  const avatarSize = parseInt(style.getPropertyValue(avatarSizeCssVar));

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
    <Icon
      size={avatarSize}
      extraStyles={[styles.Avatar, withBorder ? styles.Border : ""]}
      extraWrapperStyles={[styles.AvatarGridArea]}
      nonSvgSrc={src || defaultAvatar}
      alt="The avatar of the user"
      title={iconProps?.title}
      {...iconProps}
    />
  );
};

export default Avatar;
