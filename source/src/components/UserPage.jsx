import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {getUserById} from '../api/apiCalls';
import {Spinner} from './Spinner';
import {Alert} from './Alert';
import ProfileCard from './ProfileCard';

export const UserPage = (props) => {
    const [state, setState] = useState({
        user: {},
        pendingApiCall: false,
        failResponse: undefined
    });
    const params = useParams();
    useEffect(() => {
        async function getUser() {
            setState({
                ...state,
                pendingApiCall: true
            })
            try {
                const data = await getUserById(params.id);
                setState({
                    ...state,
                    pendingApiCall: false,
                    user: data?.data
                })

            } catch (err) {
                setState({
                    ...state,
                    failResponse: err.response.data.message
                })
            }
        }
        void getUser();
    }, [params?.id]);


    const {user, pendingApiCall, failResponse} = state || {};
    let content = (
        <Alert type="secondary" center>
            <Spinner size="big"/>
        </Alert>
    );

    if (!pendingApiCall) {
        if (failResponse) {
            content = (
                <Alert type="danger" center>
                    {failResponse}
                </Alert>
            );
        } else {
            content = <ProfileCard user={state?.user}/>;
        }
    }

    return (
        <div data-testid="user-page">
            <span>{content}</span>
        </div>
    )
}
