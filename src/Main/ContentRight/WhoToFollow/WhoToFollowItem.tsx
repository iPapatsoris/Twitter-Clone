import UserCard, { UserCardDetailsI} from "../../../util/UserCard/UserCard"
import "./WhoToFollow.scss"


const WhoToFollowItem = (props: UserCardDetailsI) => {
	return (
		<UserCard {...props}>
			<button>Follow</button>
		</UserCard>
	)
}

export default WhoToFollowItem