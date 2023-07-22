import reducer from './authReducer';
import {createStore} from 'redux';
import storage from './storage';

export let store;

const createAppStore = () => {
    let initState = storage.getItem('auth') || {
        isLoggedIn: false,
        id: ''
    }

    store = createStore(
        reducer,
        initState,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // for plugin in browser
    );

    store.subscribe(() => {
        storage.setItem('auth', store.getState());
    })

    return store;
}

export default createAppStore;
