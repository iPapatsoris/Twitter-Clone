import CreateTweet from "../../Main/components/Tweet/CreateTweet/CreateTweet";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import Icon from "../../util/components/Icon/Icon";
import styles from "./CreateTweetModal.module.scss";

interface CreateTweetModalProps {}

const CreateTweetModal = ({}: CreateTweetModalProps) => {
  return (
    <div className={styles.CreateTweetModal}>
      <Icon
        extraWrapperStyles={[styles.CloseIcon]}
        src={CloseIcon}
        title="Close"
        alt="Close modal"
      />
      <CreateTweet border="between" autofocus />
    </div>
  );
};

export default CreateTweetModal;
