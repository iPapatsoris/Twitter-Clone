import Nav from "./Nav/Nav";
import logo from "../assets/logo.png"
import './Sidebar.scss'

const Sidebar = () => {
	return (
		<div className="Sidebar">
			<div className="LogoWrapper">
				<img src={logo} className="Logo" />	
			</div>
			<Nav />
			<button className="TweetButton Bold">Tweet</button>
		</div>
	)
}

export default Sidebar;