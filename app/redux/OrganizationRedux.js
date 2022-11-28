import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    getOrganizationRequest: null,
    getOrganizationSuccess: ['data'],
    getOrganizationFailure: ['error'],
})

export const OrganizationTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    organizationsData: [],
    fetching: true,
    errorMessage: '',
    error: false,
})

/* ------------- Reducers ------------- */
export const getOrganizationRequest = (state, action) => {
    return state.merge({ fetching: true, error: false, errorMessage: '' })
}

export const getOrganizationSuccess = (state, action) => {
    console.log("getOrganizationSuccess",action.data)
    return state.merge({ fetching: false, error: false, errorMessage: '', organizationsData: action.data })
}

export const getOrganizationFailure = (state, action) => {
    return state.merge({ fetching: false, error: true, errorMessage: action.error })
}


/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_ORGANIZATION_REQUEST]: getOrganizationRequest,
    [Types.GET_ORGANIZATION_SUCCESS]: getOrganizationSuccess,
    [Types.GET_ORGANIZATION_FAILURE]: getOrganizationFailure,
})
