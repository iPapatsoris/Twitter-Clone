import './UserCard.scss'

export interface UserCardDetailsI {
	name: string;
	username: string;
	avatar: string;
}
interface UserCardPropsI extends UserCardDetailsI {
	children: React.ReactNode;
}


const UserCard = ({ children, username, avatar, name }: UserCardPropsI) => {
	return (
		<div className="UserCard">
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