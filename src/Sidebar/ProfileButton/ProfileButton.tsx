import avatar from '../../assets/cats/cat2.jpg'
import dots from '../../assets/icons/dots.png'
import './ProfileButton.scss'

const ProfileButton = () => {
	return (
		<div className="ProfileButton">
			<img src={avatar} className="Avatar" />
			<div>
				<div className="Name">Toulouse</div>
				<div className="Username">@toulouse-cat</div>
			</div>
			<img src={dots} className="Dots" />
		</div>
	)		
}

export default ProfileButton;