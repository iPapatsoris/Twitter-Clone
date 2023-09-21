import Nav from "./Nav/Nav";
import { ReactComponent as CreateTweet } from "../assets/icons/tweet/create.svg";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/components/Button/Button";
import Icon from "../util/components/Icon/Icon";
import useWindowDimensions from "../util/hooks/useWindowDimensions";

const Sidebar = () => {
  const { isPcBig, isSmallScreen } = useWindowDimensions();

  const postTweetButton = isPcBig ? (
    <div className={styles.TweetButtonWrapper}>
      <Button size="large" largeFont stretch>
        Post
      </Button>
    </div>
  ) : (
    <Icon
      src={CreateTweet}
      hover="none"
      noInlineMargin
      withBackground
      title="Post"
      alt="Post tweet"
      size={26}
      hoverGap={14}
    />
  );

  return (
    <header className={styles.Sidebar}>
      <Nav />
      {!isSmallScreen && postTweetButton}
      {!isSmallScreen && <ProfileButton />}
    </header>
  );
};

export default Sidebar;
