import "./ContentRight.scss";
import ContentRightSection from "./ContentRightSection/ContentRightSection";
import Trends from "../../components/Trends/Trends";
import WhoToFollow from "../../components/WhoToFollow/WhoToFollow";
import { useLocation } from "react-router-dom";
import paths from "../../../util/paths";

const ContentRight = () => {
  const path = useLocation().pathname;

  return (
    <div className={"ContentRight"}>
      {path === paths.explore ? null : (
        <ContentRightSection title="Trends for you">
          <Trends />
        </ContentRightSection>
      )}
      <ContentRightSection title="Who to follow">
        <WhoToFollow />
      </ContentRightSection>
    </div>
  );
};
export default ContentRight;
