import {useEffect, useState} from 'react';
import {loadUsers} from '../api/apiCalls';
import {UserListItem} from './UserListItem';
import {useTranslation} from 'react-i18next';
import {Spinner} from './Spinner';
import {useSelector} from 'react-redux';

export const UserList = () => {
    const {t} = useTranslation();

    const {header} = useSelector((store) => ({
        header: store.header
    }));

    const [data, setData] = useState({
        content: [],
        page: 0,
        size: 0,
        totalPages: 0,
        pendingApiCall: false
    });

    async function loadUsersApi(page) {
        setData({...data, pendingApiCall: true});
        try {
            const res = await loadUsers(page);
            setData({...res.data, pendingApiCall: false});
        } catch (err) {
            setData(null);
        }
    }

    useEffect(() => {
        void loadUsersApi();
    }, [, header]);

    const loadData = (page) => {
        void loadUsersApi(page);
    }

    const {pendingApiCall= false} = data || {};

    return (
        <div className='card'>
            <div className='card-header text-center'>
                <h3>{t('users')}</h3>
            </div>

            <ul className='list-group list-group-flush'>
                {data && data?.content.map((user) => {
                    return <UserListItem key={user.id} user={user}/>
                })}
            </ul>

            <div className="card-footer text-center">
                {(data?.page !== 0) && !pendingApiCall && (
                    <button
                        className="btn btn-outline-secondary btn-sm float-start"
                        onClick={() => loadData(data?.page - 1)}
                    >
                        {t('previousPage')}
                    </button>
                )}
                {(data?.totalPages > data?.page + 1) && !pendingApiCall && (
                    <button
                        className="btn btn-outline-secondary btn-sm float-end"
                        onClick={() => loadData(data?.page + 1)}
                    >
                        {t('nextPage')}
                    </button>
                )}
                { pendingApiCall && <Spinner/>}
            </div>
        </div>
    )
}
