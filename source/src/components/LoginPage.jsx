import Input from './Input';
import {Alert} from './Alert';
import {useEffect, useState} from 'react';
import {login} from '../api/apiCalls';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {ButtonWithProgress} from './ButtonWithProgress';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../state/authActions';

export const LoginPage = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [apiProgress, setApiProgress] = useState(false);
    const [failMessage, setFailMessage] = useState();

    let disabled = !(email && password);
    let navigate = useNavigate();
    const {t} = useTranslation();

    const dispatch = useDispatch();

    useEffect(() => {
        setFailMessage();
    }, [email, password])

    const submit = async (event) => {
        setApiProgress(true)
        event.preventDefault();
        try {
            const response = await login({email, password});
            dispatch(
                loginSuccess({
                    ...response.data,
                    header: `Bearer ${response.data.token}`
                })
            );
            navigate('/');
        } catch (e) {
            setFailMessage(e.response.data.message);
        }
        setApiProgress(false);
    }

    return (
        <div className="col" data-testid='login-page'>
            <form className="card">
                <div className='card-header'>
                    <h3 className="text-center">{t('login')}</h3>
                </div>
                <div className="card-body">
                    <Input id="email"
                           onChange={(event) => {
                               setEmail(event.target.value)
                           }}
                           label={t('email')}
                    >
                    </Input>
                    <Input type="password"
                           onChange={(event) => {
                               setPassword(event.target.value)
                           }}
                           id="password"
                           label={t('password')}>
                    </Input>

                    {failMessage && <Alert type='danger'>{failMessage}</Alert>}

                    <div className="text-center">
                        <ButtonWithProgress disabled={disabled}
                                            apiProgress={apiProgress}
                                            onClick={submit}
                        >
                            {t('login')}
                        </ButtonWithProgress>
                    </div>
                </div>
            </form>
        </div>
    )
}
