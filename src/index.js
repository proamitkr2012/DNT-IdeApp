import React from "react";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './css/player.css';
import './css/video.css';
import './css/highlight.css';

import configureStore from './redux/store';
import Spinner from "./lib/spinner";
import Course from './course'

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Course />
        <Spinner />
    </Provider>, document.getElementById('root')
)