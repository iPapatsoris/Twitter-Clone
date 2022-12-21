import "./StickyInbox.scss";
import newMessageIcon from "../../../../assets/icons/new-message.png";
import expandInbox from "../../../../assets/icons/expand-inbox.png";
import Icon from "../../../../util/Icon/Icon";

const InboxSticky = () => {
  return (
    <div className="InboxSticky">
      <div className="InboxStickyContent">
        <h3 className="BiggerText">Messages</h3>
        <div className="RightAligned">
          <Icon src={newMessageIcon} title="New message" />
          <Icon src={expandInbox} title="Expand" />
        </div>
      </div>
    </div>
  );
};

export default InboxSticky;
