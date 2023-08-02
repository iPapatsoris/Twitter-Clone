import styles from "./CreateTweet.module.scss";
import { ReactComponent as FileIcon } from "../../../../assets/icons/tweet/create/file.svg";
import { ReactComponent as GifIcon } from "../../../../assets/icons/tweet/create/gif.svg";
import { ReactComponent as PollIcon } from "../../../../assets/icons/tweet/create/poll.svg";
import { ReactComponent as EmojiIcon } from "../../../../assets/icons/tweet/create/emoji.svg";
import { ReactComponent as ScheduleIcon } from "../../../../assets/icons/tweet/create/schedule.svg";
import { ReactComponent as GlobeIcon } from "../../../../assets/icons/tweet/create/globe.svg";
import { ReactComponent as LocationIcon } from "../../../../assets/icons/location.svg";
import Icon from "../../../../util/components/Icon/Icon";

interface WidgetsProps {}

const Widgets = ({}: WidgetsProps) => (
  <div className={styles.Widgets}>
    <Icon
      src={FileIcon}
      title="Media"
      alt="Upload media"
      hover="primary"
      noInlineMargin
      noBlockMargin
    />
    <Icon
      src={GifIcon}
      title="GIF"
      alt="Add GIF"
      hover="primary"
      noInlineMargin
      noBlockMargin
    />
    <Icon
      src={PollIcon}
      title="Poll"
      alt="Add poll"
      hover="primary"
      noInlineMargin
      noBlockMargin
    />
    <Icon
      src={EmojiIcon}
      title="Emoji"
      alt="Add emoji"
      hover="primary"
      noInlineMargin
      noBlockMargin
    />
    <Icon
      src={ScheduleIcon}
      title="Schedule"
      alt="Schedule an event"
      hover="primary"
      noInlineMargin
      noBlockMargin
    />
    <Icon
      src={LocationIcon}
      title="Location"
      alt="Add location"
      hover="primary"
      noInlineMargin
      noBlockMargin
      extraStyles={[styles.LocationIcon]}
    />
  </div>
);

export default Widgets;
