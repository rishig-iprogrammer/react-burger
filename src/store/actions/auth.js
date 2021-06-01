import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type : actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type : actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000);
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
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId)
            dispatch(authSuccess(response.data.idToken, response.data.localId))
            dispatch(checkAuthTimeout(response.data.expiresIn))
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err.response.data.error))
        })
    }
}

export const setAuthPathRedirect = path => {
    return {
        type: actionTypes.AUTH_REDIRECT_PATH,
        path: path
    }
}

export const checkAuthStatus = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            console.log('1');
            dispatch(logout());
        } else {
            console.log('2');
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()) {
                console.log('3');
                console.log(expirationDate.getTime() - new Date().getTime());
                dispatch(authSuccess(token, localStorage.getItem('userId')))
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000))
            } else {
                console.log('4');
                dispatch(logout())
            }
        }
    }
}