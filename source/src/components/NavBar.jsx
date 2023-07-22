import {useTranslation} from 'react-i18next';
import {NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../api/apiCalls';
import {logoutSuccess} from '../state/authActions';

export const NavBar = (props) => {
    const {t} = useTranslation();

    const auth = useSelector((state) => {
        return state
    })

    const dispatch = useDispatch();

    const onClickLogout = async (event) => {
        event.preventDefault();
        try {
            await logout();
        } catch (error) {}
        dispatch(logoutSuccess());
    };


    return (
        <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
            <div className="container">
                <ul className="navbar-nav">
                    <li>
                        <NavLink
                            title='Home'
                            to='/'
                            className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            Home
                        </NavLink>
                    </li>
                    {auth.isLoggedIn && <>
                        <li>
                            <NavLink
                                to={`/user/${auth.id}`}
                                className={'nav-link'}
                            >
                                My Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink title='Logout'
                                     to='/'
                                     className='nav-link'
                                     onClick={onClickLogout}>Logout</NavLink></li>
                    </>

                    }
                    {!auth.isLoggedIn &&
                        <>
                            <li>
                                <NavLink
                                    title='Sign Up'
                                    to='/signup'
                                    className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
                                >
                                    {t('signUp')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    title='Login'
                                    to='/login'
                                    className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')}
                                >
                                    Login
                                </NavLink>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    )
}
