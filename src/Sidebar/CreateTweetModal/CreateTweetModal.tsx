import CreateTweet from "../../Main/components/Tweet/CreateTweet/CreateTweet";
import styles from "./CreateTweetModal.module.scss";

const CreateTweetModal = () => {
  return (
    <div className={styles.CreateTweetModal}>
      <CreateTweet asModalContent autofocus />
    </div>
  );
};

export default CreateTweetModal;
