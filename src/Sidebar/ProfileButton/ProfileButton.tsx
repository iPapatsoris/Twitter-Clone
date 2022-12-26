import UserCard from "../../util/UserCard/UserCard";
import styles from "./ProfileButton.module.scss";
import avatar from "../../assets/cats/cat2.jpg";
import dots from "../../assets/icons/dots.png";
import Icon from "../../util/Icon/Icon";

const ProfileButton = () => (
  <div className={styles.ProfileButton}>
    <UserCard
      name="Toulouse"
      username="toulouse-cat"
      avatar={avatar}
      isStandalone
    >
      <Icon src={dots} title="" hoverBg="none" />
    </UserCard>
  </div>
);

export default ProfileButton;
