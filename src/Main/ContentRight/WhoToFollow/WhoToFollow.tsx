import "./WhoToFollow.scss"
import avatar from "../../../assets/cats/cat2.jpg";
import WhoToFollowItem from "./WhoToFollowItem";

const WhoToFollow = () => {
	return (
		<div className="WhoToFollow">
			<WhoToFollowItem 
				name="Toulouse"
				username="toulouse-cat"
				avatar={avatar}
			/>
			<WhoToFollowItem 
				name="Toulouse2"
				username="toulouse-cat"
				avatar={avatar}
			/>
			<WhoToFollowItem 
				name="Toulouse"
				username="toulouse-cat"
				avatar={avatar}
			/>
		</div>
	)
}

export default WhoToFollow;