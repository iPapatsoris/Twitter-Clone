import Nav from "./Nav/Nav";
import logo from "../assets/logo.png";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/Button/Button";
import Icon from "../util/Icon/Icon";

const Sidebar = () => {
  return (
    <header className={styles.Sidebar}>
      <div className={styles.Logo}>
        <Icon src={logo} hoverBg="primary" size="largeLogo" />
      </div>
      <Nav />
      <div className={styles.TweetButton}>
        <Button style="large" largeFont stretch>
          Tweet
        </Button>
      </div>
      <ProfileButton />
    </header>
  );
};

export default Sidebar;
