import "./StickyInbox.scss"
import newMessageIcon from "../../../assets/icons/new-message.png"
import expandInbox from "../../../assets/icons/expand-inbox.png"


const InboxSticky = () => {
	return (
		<div className="InboxSticky">
			<div className="InboxStickyContent">
				<h3 className="BiggerText">Messages</h3>
				<div className="RightAligned">
					<img src={newMessageIcon} />
					<img src={expandInbox} />
				</div>
			</div>
		</div>
	)
}  

export default InboxSticky;