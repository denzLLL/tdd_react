import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {activate} from '../api/apiCalls';
import {useEffect, useState} from 'react';
import {Alert} from './Alert';
import {Spinner} from './Spinner';

export const AccountActivationPage = (props) => {
    const [result, setResult] = useState();
    let navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    useEffect(() => {
        async function activatedRequest() {
            setResult(null)
            try {
                await activate(params.token)
                setResult('SUCCESS')
            } catch (err) {
                setResult('FAIL')
            }
        }
        void activatedRequest();

    }, [params.token]);

    return (
        <>
            <div data-testid="activation-page">
                {result === 'SUCCESS' && <Alert type='success' text='Account is activated'/>}
                {result === 'FAIL' && <Alert type='danger' text='Activation failure'/>}
                {!result && (<Alert type='secondary' center={true}><Spinner size='big'/></Alert>)}
            </div>
        </>
    )
}
