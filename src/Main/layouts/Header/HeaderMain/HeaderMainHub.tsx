import { useLocation } from "react-router-dom";
import Icon from "../../../../util/components/Icon/Icon";
import {
  getPagePath,
  useRouteMatch,
  useRouteMatches,
  isNotificationsPage as checkIsNotificationsPage,
} from "../../../../util/paths";
import Search from "../../../components/Search/Search";
import { HeaderProfileUser } from "../../Main";
import HeaderMain from "./HeaderMain";
// import {ReactComponent as SparkIcon }from "../../../../assets/icons/spark.svg";
import { ReactComponent as SettingsIcon } from "../../../../assets/icons/settings.svg";
import { ReactComponent as VerifiedIcon } from "../../../../assets/icons/verified.svg";
import styles from "./HeaderMain.module.scss";
import HeaderLinkMenu from "./HeaderLinkMenu/HeaderLinkMenu";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import { useAuthStore } from "../../../../store/AuthStore";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";
import { useState } from "react";
import Modal from "../../../../util/components/Modal/Modal";
import MobileSidepanel from "../../../../Sidebar/MobileSidepanel";

interface HeaderMainHubProps {
  user: HeaderProfileUser;
}

const HeaderMainHub = ({ user }: HeaderMainHubProps) => {
  const path = useLocation().pathname;
  const isProfilePage = useRouteMatch(getPagePath("profile"));
  const isNotificationsPage = checkIsNotificationsPage(path);
  const isCirclePage = useRouteMatches([
    getPagePath("followers"),
    getPagePath("following"),
  ]);
  const isTweetPage = useRouteMatch(getPagePath("tweet"));
  const { isSmallScreen } = useWindowDimensions();
  const { loggedInUser } = useAuthStore();
  const [showMobileSidePanel, setShowMobileSidePanel] = useState(false);

  const userTitle = (
    <>
      <h2>{user?.name}</h2>
      {user?.isVerified ? <Icon src={VerifiedIcon} hover="none" /> : null}
    </>
  );

  const profileButton = (
    <>
      {showMobileSidePanel && (
        <Modal
          isSidePanel
          setIsActive={setShowMobileSidePanel}
          withCloseIcon={false}
        >
          <MobileSidepanel />
        </Modal>
      )}
      <Avatar
        size="tiny"
        src={loggedInUser?.avatar}
        onClick={() => setShowMobileSidePanel(true)}
      />
    </>
  );

  let header = (
    <HeaderMain
      title={<h2>Home</h2>}
      leftCornerIcon={isSmallScreen ? profileButton : undefined}
      // rightCornerIcon={
      //   <Icon src={SparkIcon} title="Top Tweets" alt="Top tweets" />
      // }
    />
  );

  if (path === getPagePath("explore")) {
    header = (
      <HeaderMain
        singleComponent={
          <div className={styles.SearchContainer}>
            <Search />
          </div>
        }
        rightCornerIcon={
          <Icon src={SettingsIcon} title="Settings" alt="Settings" />
        }
      />
    );
  } else if (isProfilePage) {
    header = (
      <HeaderMain
        title={userTitle}
        subtitle={<>{user?.totalTweets} Tweets</>}
        leftCornerBackIcon
      />
    );
  } else if (isNotificationsPage) {
    const headerExtension = (
      <HeaderLinkMenu
        items={[
          { page: "notifications", title: "All" },
          { page: "notificationsVerified", title: "Verified" },
          { page: "notificationsMentions", title: "Mentions" },
        ]}
      />
    );
    header = (
      <HeaderMain
        title={<h2>Notifications</h2>}
        extension={headerExtension}
        leftCornerBackIcon
      />
    );
  } else if (isCirclePage) {
    const headerExtension = (
      <HeaderLinkMenu
        items={[
          { page: "following", username: user?.username, title: "Following" },
          { page: "followers", username: user?.username, title: "Followers" },
        ]}
      />
    );
    header = (
      <HeaderMain
        title={userTitle}
        subtitle={<>@{user?.username}</>}
        extension={headerExtension}
        leftCornerBackIcon
      />
    );
  } else if (isTweetPage) {
    header = <HeaderMain title={<h2>Tweet</h2>} leftCornerBackIcon />;
  }

  return header;
};

export default HeaderMainHub;
