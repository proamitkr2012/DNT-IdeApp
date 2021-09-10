import * as actionTypes from './actionTypes';

export const saveIDEState = (ideState) => {
    return {
        type: actionTypes.SAVE_IDE_STATE,
        ideState //ES6 style to skip the key if value is same
    };
}

export const loadIDE = () => {
    return {
        type: actionTypes.LOAD_IDE
    };
}