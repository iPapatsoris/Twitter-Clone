import { useState } from "react";
import styles from "./TweetActions.module.scss";
import Icon, {
  IconProps,
  getHoverClass,
} from "../../../../util/components/Icon/Icon";

interface TweetActionProps {
  stat?: number;
  onClick?: VoidFunction;
  iconProps: Omit<IconProps, "forceHover">;
}

const TweetAction = ({ stat, onClick, iconProps }: TweetActionProps) => {
  const [hover, setHover] = useState(false);
  const hoverClass = getHoverClass(iconProps.hover, styles);

  return (
    <div
      className={[
        styles.TweetAction,
        hoverClass,
        hover ? styles.hover : "",
      ].join(" ")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <Icon forceHover={hover} {...iconProps} />
      <span>{stat}</span>
    </div>
  );
};

export default TweetAction;
