import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    getFileSettingsRequest: ['body'],
    getFileSettingsSuccess: ['data'],
    getFileSettingsFailure: ['error'],
});

export const SettingsTypes = Types
export default Creators


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    fileSettings: [],
    fileSettingsFetching: false,
    fileSettingsErrorMessage: '',
    fileSettingsError: false,
});


/* ------------- Reducers ------------- */
/* ------------ */
export const getFileSettingsRequest = (state, action) => {
    console.log("getFileSettingsRequest : ", action.body)
    return state.merge({ fileSettingsFetching: true, fileSettingsErrorMessage: '', fileSettingsError: false })
}

export const getFileSettingsSuccess = (state, action) => {
    console.log('getFileSettingsSuccess: ', action.data)
    return state.merge({ fileSettings: action.data, fileSettingsFetching: false, fileSettingsErrorMessage: '', fileSettingsError: false })
}

export const getFileSettingsFailure = (state, action) => {
    console.log('getFileSettingsFailure: ', action.error);
    return state.merge({ fileSettingsFetching: false, fileSettingsErrorMessage: action.error, fileSettingsError: true })
}

/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_FILE_SETTINGS_REQUEST]: getFileSettingsRequest,
    [Types.GET_FILE_SETTINGS_SUCCESS]: getFileSettingsSuccess,
    [Types.GET_FILE_SETTINGS_FAILURE]: getFileSettingsFailure,
})
