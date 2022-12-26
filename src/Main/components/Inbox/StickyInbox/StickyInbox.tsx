import styles from "./StickyInbox.module.scss";
import newMessageIcon from "../../../../assets/icons/new-message.png";
import expandInbox from "../../../../assets/icons/expand-inbox.png";
import Icon from "../../../../util/Icon/Icon";

const InboxSticky = () => {
  return (
    <div className={styles.InboxSticky}>
      <div className={styles.InboxStickyContent}>
        <h3 className={styles.BiggerText}>Messages</h3>
        <div className={styles.PushRight}>
          <Icon src={newMessageIcon} title="New message" />
          <Icon src={expandInbox} title="Expand" />
        </div>
      </div>
    </div>
  );
};

export default InboxSticky;
