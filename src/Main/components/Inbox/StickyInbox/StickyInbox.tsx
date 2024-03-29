import styles from "./StickyInbox.module.scss";
import { ReactComponent as NewMessageIcon } from "../../../../assets/icons/new-message.svg";
import { ReactComponent as ExpandInboxIcon } from "../../../../assets/icons/expand-up.svg";
import Icon from "../../../../util/components/Icon/Icon";

const InboxSticky = () => {
  return (
    <div className={styles.InboxSticky}>
      <div className={styles.InboxStickyContent}>
        <h3 className={styles.BiggestText}>Messages</h3>
        <div className={styles.PushRight}>
          <Icon
            src={NewMessageIcon}
            title="New message"
            alt="Compose message"
            extraStyles={[styles.Icon]}
          />
          <Icon
            src={ExpandInboxIcon}
            extraStyles={[styles.Icon]}
            title="Expand"
            alt="Inbox options"
          />
        </div>
      </div>
    </div>
  );
};

export default InboxSticky;
