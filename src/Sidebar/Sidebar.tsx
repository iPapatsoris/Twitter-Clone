import Nav from "./Nav/Nav";
import logo from "../assets/logo.png";
import "./Sidebar.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/Button/Button";

const Sidebar = () => {
  return (
    <header className="Sidebar">
      <div className="LogoWrapper">
        <img src={logo} className="Logo" />
      </div>
      <Nav />
      <div className="TweetButton Bold">
        <Button style="large" largeFont stretch>
          Tweet
        </Button>
      </div>
      <ProfileButton />
    </header>
  );
};

export default Sidebar;
