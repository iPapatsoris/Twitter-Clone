import Nav from "./Nav/Nav";
import { ReactComponent as CreateTweet } from "../assets/icons/tweet/create.svg";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/components/Button/Button";
import Icon from "../util/components/Icon/Icon";
import useWindowDimensions from "../util/hooks/useWindowDimensions";

const Sidebar = () => {
  const { isPcBig } = useWindowDimensions();

  const postTweetButton = isPcBig ? (
    <div className={styles.TweetButtonWrapper}>
      <Button size="large" largeFont stretch>
        Post
      </Button>
    </div>
  ) : (
    <Button extraClasses={[styles.TweetButton]} round title="Post">
      <Icon
        src={CreateTweet}
        title="Post"
        alt="Post tweet"
        hover="none"
        size={24}
      />
    </Button>
  );

  return (
    <header className={styles.Sidebar}>
      <Nav />
      {postTweetButton}
      <ProfileButton />
    </header>
  );
};

export default Sidebar;
