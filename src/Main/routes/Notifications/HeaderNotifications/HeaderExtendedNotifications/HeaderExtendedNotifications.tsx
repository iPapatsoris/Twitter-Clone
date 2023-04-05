import { Link, useLocation } from "react-router-dom";
import { getPagePath } from "../../../../../util/paths";
import styles from "./HeaderExtendedNotifications.module.scss";

const HeaderExtendedNotifications = () => {
  const path = useLocation().pathname;
  return (
    <div className={styles.NotificationCategories}>
      <Link to={getPagePath("notifications")}>
        <div
          className={[
            styles.NotificationCategory,
            path === getPagePath("notifications") ? styles.Active : "",
          ].join(" ")}
        >
          All
        </div>
      </Link>
      <Link to={getPagePath("notificationsVerified")}>
        <div
          className={[
            styles.NotificationCategory,
            path === getPagePath("notificationsVerified") ? styles.Active : "",
          ].join(" ")}
        >
          Verified
        </div>
      </Link>
      <Link to={getPagePath("notificationsMentions")}>
        <div
          className={[
            styles.NotificationCategory,
            path == getPagePath("notificationsMentions") ? styles.Active : "",
          ].join(" ")}
        >
          Mentions
        </div>
      </Link>
    </div>
  );
};

export default HeaderExtendedNotifications;
