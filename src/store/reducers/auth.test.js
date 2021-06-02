import reducer from './auth';
import * as actionTypes from '../actions/actionsTypes';

describe('auth reducer', () => {
    it('should return initial stage', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath : '/'
        })
    })

    it('should store token and user id upon login', () => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath : '/'
        },
        {
            type : actionTypes.AUTH_SUCCESS,
            idToken : 'token-value',
            userId : 'userId-value'
        })).toEqual({
            token: 'token-value',
            userId: 'userId-value',
            error: null,
            loading: false,
            authRedirectPath : '/'
        })
    })
})