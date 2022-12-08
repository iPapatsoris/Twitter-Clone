import "./WhoToFollow.scss"
import avatar from "../../../assets/cats/cat1.jpg";
import WhoToFollowItem from "./WhoToFollowItem";

const WhoToFollow = () => {
	return (
		<div className="WhoToFollow">
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
		</div>
	)
}

export default WhoToFollow;