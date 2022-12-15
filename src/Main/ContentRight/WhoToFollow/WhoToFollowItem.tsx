import UserCard, { UserCardDetailsI} from "../../../util/UserCard/UserCard"
import "./WhoToFollowItem.scss"


const WhoToFollowItem = (props: UserCardDetailsI) => {
	return (
		<UserCard {...props}>
			<button className="WhoToFollowButton">Follow</button>
		</UserCard>
	)
}

export default WhoToFollowItem