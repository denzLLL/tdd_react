import {Link, Outlet} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import LangSelector from './LangSelector';
import {NavBar} from './NavBar';

export const SharedLayout = (props) => {
    const {t} = useTranslation();
    const {auth} = props;

    return (
        <>
            <NavBar auth={auth}></NavBar>

            <div className='container'>
                <LangSelector></LangSelector>
            </div>
            <div className='container pt-3'>
                <Outlet/>
                <div className='mt-3'>
                    <Link to='/activate/1'>activate/1</Link>
                </div>
                <div>
                    <Link to='/activate/2'>activate/2</Link>
                </div>
            </div>
        </>
    )
}
