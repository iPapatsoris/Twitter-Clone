import UserCard from "../../util/UserCard/UserCard";
import "./ProfileButton.scss"
import dots from '../../assets/icons/dots.png'
		
const ProfileButton = () => (
	<UserCard>		
		<img src={dots} className="Dots" />
	</UserCard>
)



export default ProfileButton;