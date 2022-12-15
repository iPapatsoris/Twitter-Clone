import './UserCard.scss'

export interface UserCardDetailsI {
	name: string;
	username: string;
	avatar: string;
}
interface UserCardPropsI extends UserCardDetailsI {
	children: React.ReactNode;
	isStandalone?: boolean;
}

const UserCard = ({ children, username, avatar, name, isStandalone = false }: UserCardPropsI) => {
	const extraClass = isStandalone ? "Standalone" : "";  
	
	return (
		<div className={"UserCard " + extraClass}>
			<img src={avatar} className="Avatar" />
			<div>
				<div className="Name">{name}</div>
				<div className="Username">{username}</div>
			</div>
			<div className='Action'>
				{children}
			</div>
		</div>
	)		
}

export default UserCard;