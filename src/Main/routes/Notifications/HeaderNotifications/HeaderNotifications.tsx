import Icon from "../../../../util/components/Icon/Icon";
import settingsIcon from "../../../../assets/icons/settings.png";
import styles from "./HeaderNotifications.module.scss";
import stylesHeaderMain from "../../../layouts/Header/HeaderMain/HeaderMain.module.scss";

interface HeaderNotificationsProps {}

const HeaderNotifications = (props: HeaderNotificationsProps) => {
  return (
    <div
      className={[styles.HeaderNotifications, stylesHeaderMain.HeaderMain].join(
        " "
      )}
    >
      <h2>Notifications</h2>
      <div className="PushRight">
        <Icon src={settingsIcon} title="Settings" alt="Settings" />
      </div>
    </div>
  );
};

export default HeaderNotifications;
