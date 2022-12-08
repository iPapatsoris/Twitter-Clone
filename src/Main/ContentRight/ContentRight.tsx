import "./ContentRight.scss";
import ContentRightSection from "./ContentRightSection/ContentRightSection";
import Trends from "./Trends/Trends";
import WhoToFollow from "./WhoToFollow/WhoToFollow";
const ContentRight = () => {
	return (
		<div className="ContentRight">
			<ContentRightSection title="Trends for you">
				<Trends />	
			</ContentRightSection>
			<ContentRightSection title="Who to follow">
				<WhoToFollow />	
			</ContentRightSection>
		</div>
	)
}
export default ContentRight;