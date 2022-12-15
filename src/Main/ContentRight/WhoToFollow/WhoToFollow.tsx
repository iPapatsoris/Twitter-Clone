import avatar from "../../../assets/cats/cat1.jpg";
import WhoToFollowItem from "./WhoToFollowItem";

const WhoToFollow = () => {
	return (
		<>
			<WhoToFollowItem 
				name="Other Cat"
				username="other-cat"
				avatar={avatar}
			/>
			<WhoToFollowItem 
				name="Other Cat"
				username="other-cat"
				avatar={avatar}
			/>
			<WhoToFollowItem 
				name="Other Cat"
				username="other-cat"
				avatar={avatar}
			/>
		</>
	)
}

export default WhoToFollow;