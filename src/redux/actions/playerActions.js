import * as actionTypes from './actionTypes';
import CryptoJS from 'crypto-js';

export const key = 'pide';
export const savePlayerState = (playerState) => {
    //must be in session storage
    if (playerState.playerState.topicType !== undefined) {
        let encState = JSON.stringify(playerState.playerState);
        //base64
        let wordArray = CryptoJS.enc.Utf8.parse(encState);
        let data = CryptoJS.enc.Base64.stringify(wordArray);

        //encryption
        //let data = CryptoJS.AES.encrypt(encState, key)
        sessionStorage.setItem('dnt_ps', data);
    }
    return {
        type: actionTypes.SAVE_PLAYER_STATE,
        playerState //ES6 style to skip the key if value is same
    };
}

export const loadPlayer = () => {
    return {
        type: actionTypes.LOAD_PLAYER
    };
}