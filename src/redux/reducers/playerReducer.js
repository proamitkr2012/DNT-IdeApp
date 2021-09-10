import * as actionTypes from '../actions/actionTypes'

const INITIAL_STATE = {
    playerState: {
        topicType:'',
        urlPath:'',
        index: 0,
        childIndex:0,
        height:680
    }
};

const playerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.SAVE_PLAYER_STATE:
            return action.playerState == undefined ? state : action.playerState; //return only new state           
        case actionTypes.LOAD_PLAYER:
        default:
            return state;
    }
}

export default playerReducer;