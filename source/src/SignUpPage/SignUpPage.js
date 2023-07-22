import {useEffect, useState} from 'react';
import Input from '../components/Input';
import {withTranslation} from 'react-i18next';
import {signup} from '../api/apiCalls';
import {Alert} from '../components/Alert';
import {ButtonWithProgress} from '../components/ButtonWithProgress';

const SignUpPage = (props) => {
    const {t} = props; //  get from HOC i18next , but better use HOOK

    const [data, setData] = useState({
        disabled: false,
        password: null,
        passwordRepeat: null,
        username: '',
        email: '',
        apiProgress: false,
        signUpSuccess: false,
        errors: {}
    })

    useEffect(() => {
        let disabled = true;
        const {password, passwordRepeat} = data;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat;
        }
        setData({
            ...data,
            disabled
        });
        return () => {
        };
    }, [data.password]);

    const onChangePassword = (ev) => {
        const currentValue = ev.target.value;
        setData({
            ...data,
            disabled: currentValue !== data.passwordRepeat,
            password: currentValue
        });
    }

    const onChangePasswordRepeat = (ev) => {
        const currentValue = ev.target.value;
        setData({
            ...data,
            disabled: currentValue !== data.password,
            passwordRepeat: currentValue
        })
    }

    const onChange = (event) => {
        const {id, value} = event.target;

        const errorsCopy = {...data?.errors};
        delete errorsCopy[id];
        setData({
            ...data,
            [id]: value,
            errors: errorsCopy
        });
    }

    const submit = async (event) => {
        event.preventDefault();

        const {username, email, password, passwordRepeat} = data;
        const body = {username, email, password, passwordRepeat};
        let newData = {
            ...data,
            apiProgress: true
        }

        await setData(newData);
        await new Promise((res) => {
            setTimeout(() => {
                res();
            }, 500)
        })
        try {
            await signup(body);

            newData = {
                ...newData,
                signUpSuccess: true
            }
            setData(newData);

        } catch (error) {
            if (error.response.status === 400) {
                newData = {
                    ...newData,
                    errors: error.response.data.validationErrors
                }
                setData(newData);
            }
            newData = {
                ...newData,
                apiProgress: false
            }
            setData(newData);
        }
    }

    return (
        <div className="col" data-testid='signup-page'>
            {!data?.signUpSuccess && <form data-testid="form-sign-up" className="card">
                <div className='card-header'>
                    <h3 className="text-center">{t('signUp')}</h3>
                </div>
                <div className="card-body">
                    <Input
                        id="username"
                        label={t('username')}
                        onChange={onChange}
                        help={data?.errors?.username}>
                    </Input>
                    <Input id="email"
                           label={t('email')}
                           onChange={onChange}
                           help={data?.errors?.email}>

                    </Input>
                    <Input type="password"
                           id="password"
                           label={t('password')}
                           onChange={onChange}
                           help={data?.errors?.password}>

                    </Input>
                    <Input type="password"
                           id="passwordRepeat"
                           label={t('repeat')}
                           onChange={onChangePasswordRepeat}
                           help={data?.password !== data?.passwordRepeat ? t('passwordMismatchValidation') : null}>
                    </Input>
                    <div className="text-center">
                        <ButtonWithProgress disabled={data?.disabled}
                                            apiProgress={data?.apiProgress}
                                            onClick={submit}
                        >
                            Sign Up
                        </ButtonWithProgress>
                    </div>
                </div>
            </form>}
            {data?.signUpSuccess && <Alert type='success' text='Please check your e-mail to activate your account' />}
        </div>
    );
};

const SignUpPageWithTranslation =  withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;

