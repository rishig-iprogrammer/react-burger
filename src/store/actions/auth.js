import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type : actionTypes.AUTH_START
    }
}

export const authSuccess = authData => {
    return {
        type : actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCCUy2yjm6FHd-SFSkTmqTn4boS5_TpB9E';
        if(!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCCUy2yjm6FHd-SFSkTmqTn4boS5_TpB9E'
        }
        const authData = {
            email : email,
            password : password,
            returnSecureToken : true
        }
        axios.post(url, authData)
        .then(response => {
            console.log(response);
            dispatch(authSuccess(response.data))
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err))
        })
    }
}