import { combineReducers } from 'redux';
import articleReducer from './articleReducer';
import playerReducer from './playerReducer';

const rootReducer = combineReducers({
    ideState: articleReducer,
    playerState: playerReducer,
});

export default rootReducer;