import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setLanguageResources: ['data'],
    setSelectedOrganization: ['data'],
    setAuthData: ['data'],
    setUserIdentity: ['data'],

    getLanguageResourceRequest: ['data'],
    getLanguageResourceSuccess: ['data'],
    getLanguageResourceFailure: ['error'],

    clearRedux: [],

    setLoaderVisibility: ['value'],
});

export const MainTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    languageResource: [],
    languageResourceFetching: false,
    languageResourceErrorMessage: '',
    languageResourceError: false,

    selectedOrganization: null,
    organizationIsReady: false,
    authData: null,
    authDataIsReady: false,
    userIdentity: null,
    userIdenetityIsReady: false,

    loaderVisibility: false,


});

/* ------------- Reducers ------------- */
export const setLanguageResources = (state, action) => {
    return state.merge({ languageResource: action.data })
}

export const setSelectedOrganization = (state, action) => {
    return state.merge({ selectedOrganization: action.data, organizationIsReady: true })
}

export const setAuthData = (state, action) => {
    return state.merge({ authData: action.data, authDataIsReady: true })
}

export const setUserIdentity = (state, action) => {
    console.log("main redux user identity saved: ", action.data);
    return state.merge({ userIdentity: action.data, userIdenetityIsReady: true })
}

/* ---- */
export const getLanguageResourceRequest = (state, action) => {
    return state.merge({ languageResourceFetching: true, languageResourceError: false, languageResourceErrorMessage: '' })
}

export const getLanguageResourceSuccess = (state, action) => {
    console.log("getLanguageResourceSuccess : ",action.data)
    return state.merge({ languageResourceFetching: false, languageResourceError: false, languageResourceErrorMessage: '', languageResource: action.data })
}

export const getLanguageResourceFailure = (state, action) => {
    return state.merge({ languageResourceFetching: false, languageResourceError: true, languageResourceErrorMessage: action.error })
}

export const setLoaderVisibility = (state, action) => {
    return state.merge({ loaderVisibility: action.value })
}




export const clearRedux = (state, action) => {
    return state;
}

/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_LANGUAGE_RESOURCES]: setLanguageResources,
    [Types.SET_SELECTED_ORGANIZATION]: setSelectedOrganization,
    [Types.SET_AUTH_DATA]: setAuthData,
    [Types.SET_USER_IDENTITY]: setUserIdentity,

    [Types.GET_LANGUAGE_RESOURCE_REQUEST]: getLanguageResourceRequest,
    [Types.GET_LANGUAGE_RESOURCE_SUCCESS]: getLanguageResourceSuccess,
    [Types.GET_LANGUAGE_RESOURCE_FAILURE]: getLanguageResourceFailure,

    [Types.CLEAR_REDUX]: clearRedux,

    [Types.SET_LOADER_VISIBILITY]: setLoaderVisibility,

})