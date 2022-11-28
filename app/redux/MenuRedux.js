import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';



/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    getMenuRequest: ['body'],
    getMenuSuccess: ['data'],
    getMenuFailure: ['error'],

    setMenu: [],
})

export const MenuTypes = Types
export default Creators


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    menu: [],
    fetching: false,
    errorMessage: '',
    error: false,
})


/* ------------- Reducers ------------- */
export const getMenuRequest = (state, action) => {
    console.log("getMenuRequest ", action.body)
    return state.merge({ fetching: true, error: false, errorMessage: '' })
}

export const getMenuSuccess = (state, action) => {
    console.log("getMenuSuccess:",action.data)
    return state.merge({ fetching: false, error: false, errorMessage: '', menu: action.data })
}

export const getMenuFailure = (state, action) => {
    console.log("getMenuFailure: ",action.error)
    return state.merge({ fetching: false, error: true, errorMessage: action.error })
}

export const setMenu = (state, action) => {
    return state.merge({ menu: [], fetching: false, errorMessage: '', error: false })
}


/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_MENU_REQUEST]: getMenuRequest,
    [Types.GET_MENU_SUCCESS]: getMenuSuccess,
    [Types.GET_MENU_FAILURE]: getMenuFailure,

    [Types.SET_MENU]: setMenu,
})