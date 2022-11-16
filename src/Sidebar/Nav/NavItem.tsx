interface NavItemI {
	icon: string; 
	title: string;
	isActive?: boolean;
}

const NavItem = ({icon, title, isActive = false}: NavItemI ) => {
	const navItemClass = "BiggerTextl " + (isActive && "Bold");
	return (
		<a>
			<div className="IconAndTitleWrapper">
				<div className="IconAndTitle">
					<img src={icon} className="Icon"/>
					<span className={navItemClass}>{title}</span>
				</div>
			</div>
		</a>
	)
}

export default NavItem;