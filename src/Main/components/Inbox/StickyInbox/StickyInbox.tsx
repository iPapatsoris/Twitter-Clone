import styles from "./StickyInbox.module.scss";
import newMessageIcon from "../../../../assets/icons/new-message.png";
import expandInbox from "../../../../assets/icons/expand-inbox.png";
import Icon from "../../../../util/components/Icon/Icon";

const InboxSticky = () => {
  return (
    <div className={styles.InboxSticky}>
      <div className={styles.InboxStickyContent}>
        <h3 className={styles.BiggerText}>Messages</h3>
        <div className={styles.PushRight}>
          <Icon
            src={newMessageIcon}
            title="New message"
            alt="Compose message"
          />
          <Icon src={expandInbox} title="Expand" alt="Inbox options" />
        </div>
      </div>
    </div>
  );
};

export default InboxSticky;
