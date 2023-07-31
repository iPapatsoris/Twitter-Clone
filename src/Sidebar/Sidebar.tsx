import Nav from "./Nav/Nav";
import logo from "../assets/logo.png";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/components/Button/Button";
import Icon from "../util/components/Icon/Icon";

const Sidebar = () => {
  return (
    <header className={styles.Sidebar}>
      <div className={styles.Logo}>
        <Icon
          src={logo}
          hover="primary"
          extraStyles={[styles.Icon]}
          alt="Twitter logo"
          size={30}
        />
      </div>
      <Nav />
      <div className={styles.TweetButton}>
        <Button size="large" largeFont stretch>
          Tweet
        </Button>
      </div>
      <ProfileButton />
    </header>
  );
};

export default Sidebar;
