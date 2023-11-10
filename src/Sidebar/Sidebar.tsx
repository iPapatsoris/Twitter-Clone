import Nav from "./Nav/Nav";
import { ReactComponent as CreateTweetIcon } from "../assets/icons/tweet/create.svg";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/components/Button/Button";
import Icon from "../util/components/Icon/Icon";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import { useRef, useState } from "react";
import { useLoggedInUser } from "../store/AuthStore";
import Modal from "../util/components/Modal/Modal";
import CreateTweetModal from "./CreateTweetModal/CreateTweetModal";
import useCloseCreateTweetModal from "../Main/components/Tweet/CreateTweet/useCloseCreateTweetModal";

const Sidebar = () => {
  const { isSmallScreen, isPcBig } = useWindowDimensions();
  const ref = useRef<HTMLElement>(null);

  const loggedInUser = useLoggedInUser();

  const [showCreateTweetModal, setShowCreateTweetModal] = useState(false);
  useCloseCreateTweetModal(setShowCreateTweetModal);

  const postTweetButton = isPcBig ? (
    <div className={styles.TweetButtonWrapper}>
      <Button
        onClick={() => setShowCreateTweetModal(true)}
        size="large"
        largeFont
        stretch
      >
        Post
      </Button>
    </div>
  ) : (
    <Icon
      src={CreateTweetIcon}
      hover="none"
      withBackground
      title="Post"
      alt="Post tweet"
      size={26}
      hoverGap={14}
      onClick={() => setShowCreateTweetModal(true)}
      extraWrapperStyles={[styles.TweetIconWrapper]}
    />
  );

  return (
    <>
      <header className={styles.Sidebar} ref={ref}>
        <Nav />
        {loggedInUser && postTweetButton}
        {!isSmallScreen && loggedInUser && <ProfileButton />}
      </header>
      {showCreateTweetModal && (
        <Modal
          extraStyles={[styles.Modal]}
          setIsActive={setShowCreateTweetModal}
        >
          <CreateTweetModal />
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
