import styles from "./ContentRight.module.scss";
import ContentRightSection from "./ContentRightSection/ContentRightSection";
import Trends from "../../components/Trends/Trends";
import WhoToFollow from "../../components/WhoToFollow/WhoToFollow";
import { useLocation } from "react-router-dom";
import paths from "../../../util/paths";
import SiteInfo from "../../components/SiteInfo/SiteInfo";
import { useRef } from "react";
import useDynamicSticky from "../../../util/hooks/useDynamicSticky";

const ContentRight = () => {
  const path = useLocation().pathname;
  const ref = useRef<HTMLDivElement>(null);
  useDynamicSticky(ref);

  return (
    <div className={styles.ContentRight} ref={ref}>
      {path !== paths.explore && (
        <ContentRightSection title="Trends for you">
          <Trends />
        </ContentRightSection>
      )}
      <ContentRightSection title="Who to follow">
        <WhoToFollow />
      </ContentRightSection>
      <SiteInfo />
    </div>
  );
};
export default ContentRight;
