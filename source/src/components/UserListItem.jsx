import {Link} from 'react-router-dom';
import defaultImportImage from '../assets/taxi_icon.png'

export const UserListItem = ({user}) => {
	return (
		<li
			className='list-group-item list-group-item-action'>
			<Link className='text-decoration-none' to={`/user/${user.id}`}>
				<img src={defaultImportImage} alt="" width="20px" className='rounded-circle shadow-sm'/> &nbsp;
				{user.username}</Link>
		</li>
	)
}
