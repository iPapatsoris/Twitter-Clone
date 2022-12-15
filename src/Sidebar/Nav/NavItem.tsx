interface NavItem {
	icon: string; 
	title: string;
	isActive?: boolean;
}

const NavItem = ({icon, title, isActive = false}: NavItem ) => {
	const navItemClass = "BiggerTextl " + (isActive && "Bold");
	return (
		<a>
			<div className="IconAndTitleWrapper">
				<div className="IconAndTitle">
					<img src={icon} />
					<span className={navItemClass}>{title}</span>
				</div>
			</div>
		</a>
	)
}

export default NavItem;