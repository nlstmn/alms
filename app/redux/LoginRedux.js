import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    getAccessTokenRequest: ['userName', 'password', 'organization'],
    getAccessTokenSuccess: ['data'],
    getAccessTokenFailure: ['error'],

    refreshTokenRequest: ['body'],
    refreshTokenSuccess: ['data'],
    refreshTokenFailure: ['error'],

    getUserIdentityRequest: ['token', 'organization'],
    getUserIdentitySuccess: ['data'],
    getUserIdentityFailure: ['error'],

})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    tokenData: null,
    fetching: false,
    success: false,
    errorMessage: '',
    error: false,

    userIdentity: null,
    userIdentityFetching: false,
    userIdentityError: false,
    userIdentityErrorMessage: '',

    refreshTokenData: null,
    refreshTokenError: false,
    refreshTokenErrorMessage: null

})


/* ------------- Reducers ------------- */
export const getAccessTokenRequest = (state, action) => {
    console.log("getAccessTokenRequest:", action)
    return state.merge({ fetching: true, success: false, error: false, errorMessage: 'asdasd' })
}

export const getAccessTokenSuccess = (state, action) => {
    console.log("getAccessTokenSuccess", action.data)
    return state.merge({ success: true, fetching: false, error: false, errorMessage: 'asdasd12', tokenData: action.data })
}

export const getAccessTokenFailure = (state, action) => {
    console.log("getAccessTokenFailurex", action.error)
    return state.merge({ success: false, fetching: false, error: true, errorMessage: action.error })
}

export const getUserIdentityRequest = (state, action) => {
    console.log("getUserIdentityRequest")
    return state.merge({ userIdentityFetching: true, userIdentityError: false, userIdentityErrorMessage: '' })
}

export const getUserIdentitySuccess = (state, action) => {
    console.log("getUserIdentitySuccess : ", action.data);
    return state.merge({ userIdentityFetching: false, userIdentityError: false, userIdentityErrorMessage: '', userIdentity: action.data })
}

export const getUserIdentityFailure = (state, action) => {
    console.log("getUserIdentityFailure : ", action.error);
    return state.merge({ userIdentityFetching: false, userIdentityError: true, userIdentityErrorMessage: action.error })
}
/* refresh token */
export const refreshTokenRequest = (state, action) => {
    console.log("refreshTokenRequest: ", action.body)
    return state.merge({ refreshTokenData: null, refreshTokenError: false, refreshTokenErrorMessage: null })
}
export const refreshTokenSuccess = (state, action) => {
    console.log("refreshTokenSuccess: ", action.data)
    return state.merge({ refreshTokenData: action.data, refreshTokenError: false, refreshTokenErrorMessage: null })
}
export const refreshTokenFailure = (state, action) => {
    console.log("refreshTokenFailure: ", action.error)
    return state.merge({ refreshTokenError: true, refreshTokenErrorMessage: action.error })
}


/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_ACCESS_TOKEN_REQUEST]: getAccessTokenRequest,
    [Types.GET_ACCESS_TOKEN_SUCCESS]: getAccessTokenSuccess,
    [Types.GET_ACCESS_TOKEN_FAILURE]: getAccessTokenFailure,

    [Types.GET_USER_IDENTITY_REQUEST]: getUserIdentityRequest,
    [Types.GET_USER_IDENTITY_SUCCESS]: getUserIdentitySuccess,
    [Types.GET_USER_IDENTITY_FAILURE]: getUserIdentityFailure,

    [Types.REFRESH_TOKEN_REQUEST]: refreshTokenRequest,
    [Types.REFRESH_TOKEN_SUCCESS]: refreshTokenSuccess,
    [Types.REFRESH_TOKEN_FAILURE]: refreshTokenFailure
})
