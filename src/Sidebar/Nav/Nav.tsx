import './Nav.scss';
import homeIcon from '../../assets/nav/home.png'
import homeIconActive from '../../assets/nav/home-active.png'
import exploreIcon from '../../assets/nav/hashtag.png'
import exploreIconActive from '../../assets/nav/hashtag-active.png'
import notificationIcon from '../../assets/nav/bell.png'
import notificationIconActive from '../../assets/nav/bell-active.png'
import messageIcon from '../../assets/nav/mail.png'
import messageIconActive from '../../assets/nav/mail-active.png'
import moreIcon from '../../assets/nav/more.png'
import bookmarkIcon from '../../assets/nav/bookmark.png'
import bookmarkIconActive from '../../assets/nav/bookmark-active.png'
import profileIcon from '../../assets/nav/user.png'
import profileIconActive from '../../assets/nav/user-active.png'
import listIcon from '../../assets/nav/list.png'
import listIconActive from '../../assets/nav/list-active.png'

import NavItem from './NavItem';

const Nav = () => {

	return (
		<nav>
			<NavItem icon={homeIcon} title="Home" isActive={true}/>
			<NavItem icon={exploreIcon} title="Explore" />
			<NavItem icon={notificationIcon} title="Notifications" />
			<NavItem icon={messageIcon} title="Messages" />
			<NavItem icon={bookmarkIcon} title="Bookmarks" />
			<NavItem icon={listIcon} title="Lists" />
			<NavItem icon={profileIcon} title="Profile" />
			<NavItem icon={moreIcon} title="More" />
		</nav>
	)
}

export default Nav