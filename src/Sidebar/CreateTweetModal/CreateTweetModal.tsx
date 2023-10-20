import CreateTweet from "../../Main/components/Tweet/CreateTweet/CreateTweet";
import styles from "./CreateTweetModal.module.scss";

const CreateTweetModal = ({
  replyingToTweetID,
}: {
  replyingToTweetID?: number;
}) => {
  return (
    <div className={styles.CreateTweetModal}>
      <CreateTweet
        asModalContent
        autofocus
        referencedTweetID={replyingToTweetID}
      />
    </div>
  );
};

export default CreateTweetModal;
