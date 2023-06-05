import styles from "./TweetActions.module.scss";

interface TweetActionProps {
  icon: React.ReactElement;
  stat?: number;
  onClick?: VoidFunction;
}

const TweetAction = ({ icon, stat, onClick }: TweetActionProps) => {
  return (
    <div className={styles.TweetAction} onClick={onClick}>
      {icon}
      <span>{stat}</span>
    </div>
  );
};

export default TweetAction;
