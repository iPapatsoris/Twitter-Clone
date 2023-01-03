import styles from "./UserCard.module.scss";

export interface UserCardDetails {
  name: string;
  username: string;
  avatar: string;
}
interface UserCardProps extends UserCardDetails {
  children: React.ReactNode;
  isStandalone?: boolean;
}

const UserCard = ({
  children,
  username,
  avatar,
  name,
  isStandalone = false,
}: UserCardProps) => {
  const extraClass = isStandalone ? styles.Standalone : "";

  return (
    <div className={[styles.UserCard, extraClass].join(" ")}>
      <img src={avatar} className={styles.Avatar} />
      <div>
        <div className={styles.Name}>{name}</div>
        <div className={styles.Username}>@{username}</div>
      </div>
      <div className={styles.Action}>{children}</div>
    </div>
  );
};

export default UserCard;
