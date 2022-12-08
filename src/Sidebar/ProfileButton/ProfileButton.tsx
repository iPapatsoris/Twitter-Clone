import UserCard from "../../util/UserCard/UserCard";
import "./ProfileButton.scss"
import avatar from "../../assets/cats/cat2.jpg";
import dots from '../../assets/icons/dots.png'
		
const ProfileButton = () => (
	<div className="ProfileButton">
		<UserCard
			name="Toulouse"
			username="toulouse-cat"
			avatar={avatar}
		>		
			<img src={dots} className="Dots" />
		</UserCard>
	</div>
)



export default ProfileButton;