import SignUpPage from './SignUpPage/SignUpPage';
import {HomePage} from './components/HomePage';
import {LoginPage} from './components/LoginPage';
import {UserPage} from './components/UserPage';
import {Route, Routes} from 'react-router-dom';
import {SharedLayout} from './components/SharedLayout';
import {AccountActivationPage} from './components/AccountActivationPage';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<SharedLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="/signup" element={<SignUpPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/user/:id" element={<UserPage/>}/>
                    <Route path="/activate/:token" element={<AccountActivationPage/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;
