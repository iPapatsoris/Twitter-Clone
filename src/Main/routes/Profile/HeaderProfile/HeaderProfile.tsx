import Icon from "../../../../util/components/Icon/Icon";
import { HeaderProfileUser } from "../../../layouts/Main";
import styles from "./HeaderProfile.module.scss";
import backIcon from "../../../../assets/icons/left-arrow.png";
import { useNavigate } from "react-router-dom";

interface HeaderProfileProps {
  user: HeaderProfileUser;
}

const HeaderProfile = ({ user }: HeaderProfileProps) => {
  const navitage = useNavigate();
  const handleBackClick = () => navitage(-1);

  return (
    <div className={styles.HeaderProfile}>
      <Icon src={backIcon} title={"Back"} onClick={handleBackClick} />
      <div className={styles.UserInfo}>
        <h2>{user?.name}</h2>
        <div className={[styles.SmallerText, styles.LightColor].join(" ")}>
          {user?.totalTweets} Tweets
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;
