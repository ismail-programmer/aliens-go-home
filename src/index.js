import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import { createStore } from 'redux'
import './index.css';
import reducer from './Reducers/Reducers'
import Game from './Container/Game/Game'
import * as serviceWorker from './serviceWorker';


const store = createStore(
    reducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);



ReactDOM.render(
    <Provider store={store}>
        <Game />
    </Provider>,
    document.getElementById('root'),
);

serviceWorker.register();
