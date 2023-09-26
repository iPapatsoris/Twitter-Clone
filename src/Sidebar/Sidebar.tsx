import Nav from "./Nav/Nav";
import { ReactComponent as CreateTweet } from "../assets/icons/tweet/create.svg";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/components/Button/Button";
import Icon from "../util/components/Icon/Icon";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/AuthStore";

const Sidebar = () => {
  const { isSmallScreen, isPcBig, height } = useWindowDimensions();
  const ref = useRef<HTMLElement>(null);

  /* Add vertical scrollbar when sidebar overflows and padding.
     Padding is needed because we have icon hover effects that overflow 
     horizontally, but specifying "overflow-y: auto" cuts short the hover effect 
     on the left. We check manually for overflow because we don't want to be 
     forced to always use that padding.
  */
  useEffect(() => {
    if (ref && ref.current) {
      if (!isSmallScreen && height < ref.current.scrollHeight) {
        ref.current.style.overflowY = "auto";
        if (isPcBig) {
          ref.current.style.paddingLeft = "1rem";
        } else {
          ref.current.style.paddingLeft = "0";
        }
      } else {
        ref.current.style.overflowY = "visible";
        ref.current.style.paddingLeft = "0";
      }
    }
  }, [height, ref, isSmallScreen, isPcBig]);

  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { username: state.loggedInUser.username }
  );

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
      withBackground
      title="Post"
      alt="Post tweet"
      size={26}
      hoverGap={14}
    />
  );

  return (
    <header className={styles.Sidebar} ref={ref}>
      <Nav />
      {!isSmallScreen && loggedInUser && postTweetButton}
      {!isSmallScreen && loggedInUser && <ProfileButton />}
    </header>
  );
};

export default Sidebar;
