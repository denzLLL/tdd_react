import React from 'react';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import LangSelector from '../components/LangSelector';
import createAppStore from '../state/store';
import {Provider} from 'react-redux';

const RootWrapper = ({children}) => {
    return (
        <BrowserRouter>
            <Provider store={createAppStore()}>
                {children}
                <LangSelector/>
            </Provider>
        </BrowserRouter>
    );
};

const customRender = (ui, options) => render(ui, {wrapper: RootWrapper, ...options});

export * from '@testing-library/react';

export {customRender as render};
