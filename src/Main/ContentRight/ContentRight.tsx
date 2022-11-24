import "./ContentRight.scss";
import ContentRightSection from "./ContentRightSection/ContentRightSection";
import Trends from "./Trends/Trends";
const ContentRight = () => {
	return (
		<div className="ContentRight">
			<ContentRightSection>
				<Trends />	
			</ContentRightSection>
		</div>
	)
}
export default ContentRight;