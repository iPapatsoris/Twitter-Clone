import Nav from "./Nav/Nav";
import { ReactComponent as CreateTweetIcon } from "../assets/icons/tweet/create.svg";
import styles from "./Sidebar.module.scss";
import ProfileButton from "./ProfileButton/ProfileButton";
import Button from "../util/components/Button/Button";
import Icon from "../util/components/Icon/Icon";
import useWindowDimensions from "../util/hooks/useWindowDimensions";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import Modal from "../util/components/Modal/Modal";
import CreateTweetModal from "./CreateTweetModal/CreateTweetModal";

const Sidebar = () => {
  const { isSmallScreen, isPcBig } = useWindowDimensions();
  const ref = useRef<HTMLElement>(null);

  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { username: state.loggedInUser.username }
  );

  const [showCreateTweetModal, setShowCreateTweetModal] = useState(false);

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
          withCloseIcon={false}
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
