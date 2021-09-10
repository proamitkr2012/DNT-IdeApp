import * as actionTypes from '../actions/actionTypes'

const INITIAL_STATE = {
    ideState: {
        language: 'javascript',
        isEdit: false,
        code: '',
        height:280,
        codeNode: ''
    }
};

const articleReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.SAVE_IDE_STATE:
            return action.ideState == undefined ? state : action.ideState; //return only new state
            //return [
            //    ...state, //old
            //    action.ideState //new
            //]
        case actionTypes.LOAD_IDE:
        default:
            return state;
    }
}

export default articleReducer;