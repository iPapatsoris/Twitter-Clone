import { Link, useLocation } from "react-router-dom";
import paths from "../../../../../util/paths";
import styles from "./HeaderExtendedNotifications.module.scss";

const HeaderExtendedNotifications = () => {
  const path = useLocation().pathname;
  return (
    <div className={styles.NotificationCategories}>
      <Link to={paths.notifications.self}>
        <div
          className={[
            styles.NotificationCategory,
            path === paths.notifications.self ? styles.Active : "",
          ].join(" ")}
        >
          All
        </div>
      </Link>
      <Link to={paths.notifications.verified}>
        <div
          className={[
            styles.NotificationCategory,
            path === paths.notifications.verified ? styles.Active : "",
          ].join(" ")}
        >
          Verified
        </div>
      </Link>
      <Link to={paths.notifications.mentions}>
        <div
          className={[
            styles.NotificationCategory,
            path === paths.notifications.mentions ? styles.Active : "",
          ].join(" ")}
        >
          Mentions
        </div>
      </Link>
    </div>
  );
};

export default HeaderExtendedNotifications;
