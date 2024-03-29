import styles from "./ContentRight.module.scss";
import List from "./List/List";
import Trends from "../../components/Trends/Trends";
import WhoToFollow from "../../components/WhoToFollow/WhoToFollow";
import { useLocation } from "react-router-dom";
import SiteInfo from "../../components/SiteInfo/SiteInfo";
import { useRef } from "react";
import useDynamicSticky from "../../../util/hooks/useDynamicSticky";
import GuestPrompt from "../../components/GuestPrompt/GuestPrompt";
import { getPagePath } from "../../../util/paths";
import { useLoggedInUser } from "../../../store/AuthStore";

const ContentRight = () => {
  const path = useLocation().pathname;
  const ref = useRef<HTMLDivElement>(null);
  useDynamicSticky(ref);
  const loggedInUser = useLoggedInUser();
  const guestView = <GuestPrompt />;
  const regularView = (
    <div>
      {path !== getPagePath("explore") && (
        <List title="Trends for you" withBackgroundColor>
          <Trends />
        </List>
      )}
      <List title="Who to follow" withBackgroundColor>
        <WhoToFollow />
      </List>
    </div>
  );

  return (
    <div className={styles.ContentRight} ref={ref}>
      {loggedInUser ? regularView : guestView}
      <SiteInfo />
    </div>
  );
};
export default ContentRight;
