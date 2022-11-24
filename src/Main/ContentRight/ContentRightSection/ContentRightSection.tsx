import "./ContentRightSection.scss"
import * as React from "react";

interface ContentRightSectionPropsI {
	children: React.ReactNode;
}

const ContentRightSection = ({ children }: ContentRightSectionPropsI) => (
	<div className="ContentRightSection">
		{children}
	</div>
) 



export default ContentRightSection;