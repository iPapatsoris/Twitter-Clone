import Nav from "./Nav/Nav";
import logo from "../assets/logo.png"
import './Sidebar.scss'
import ProfileButton from "./ProfileButton/ProfileButton";

const Sidebar = () => {
	return (
		<header className="Sidebar">
			<div className="LogoWrapper">
				<img src={logo} className="Logo" />	
			</div>
			<Nav />
			<button className="TweetButton Bold">Tweet</button>
			<ProfileButton/>
		</header>
	)
}

export default Sidebar;