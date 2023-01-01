import styles from "./HeaderExtendedNotifications.module.scss";

interface HeaderExtendedNotificationsProps {}

const HeaderExtendedNotifications = ({}: HeaderExtendedNotificationsProps) => {
  return (
    <div className={styles.NotificationCategories}>
      <div className={styles.NotificationCategory}>All</div>
      <div className={styles.NotificationCategory}>Verified</div>
      <div className={styles.NotificationCategory}>Mentions</div>
    </div>
  );
};

export default HeaderExtendedNotifications;
