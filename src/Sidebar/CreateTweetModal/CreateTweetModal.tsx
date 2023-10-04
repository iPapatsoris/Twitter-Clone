import CreateTweet from "../../Main/components/Tweet/CreateTweet/CreateTweet";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import Icon from "../../util/components/Icon/Icon";
import styles from "./CreateTweetModal.module.scss";

interface CreateTweetModalProps {
  closeModal: VoidFunction;
}

const CreateTweetModal = ({ closeModal }: CreateTweetModalProps) => {
  return (
    <div className={styles.CreateTweetModal}>
      <Icon
        extraWrapperStyles={[styles.CloseIcon]}
        src={CloseIcon}
        title="Close"
        alt="Close modal"
        onClick={closeModal}
      />
      <CreateTweet border="between" autofocus />
    </div>
  );
};

export default CreateTweetModal;
