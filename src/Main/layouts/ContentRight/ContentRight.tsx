import styles from "./ContentRight.module.scss";
import ContentRightSection from "./ContentRightSection/ContentRightSection";
import Trends from "../../components/Trends/Trends";
import WhoToFollow from "../../components/WhoToFollow/WhoToFollow";
import { useLocation } from "react-router-dom";
import SiteInfo from "../../components/SiteInfo/SiteInfo";
import { useRef } from "react";
import useDynamicSticky from "../../../util/hooks/useDynamicSticky";
import GuestPrompt from "../../components/GuestPrompt/GuestPrompt";
import { getPagePath } from "../../../util/paths";
import { useAuthStore } from "../../../store/AuthStore";

const ContentRight = () => {
  const path = useLocation().pathname;
  const ref = useRef<HTMLDivElement>(null);
  useDynamicSticky(ref);
  const loggedInUser = useAuthStore(
    (state) => state.loggedInUser && { id: state.loggedInUser?.id }
  );

  const guestView = <GuestPrompt />;
  const regularView = (
    <div>
      {path !== getPagePath("explore") && (
        <ContentRightSection title="Trends for you">
          <Trends />
        </ContentRightSection>
      )}
      <ContentRightSection title="Who to follow">
        <WhoToFollow />
      </ContentRightSection>
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
