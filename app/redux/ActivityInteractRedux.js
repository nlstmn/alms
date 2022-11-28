import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';



/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    saveVideoTrackingRequest: ['body'],
    saveVideoTrackingSuccess: ['data'],
    saveVideoTrackingFailure: ['error'],

    saveUnsavedVideoTrackingData: [],
    saveUnsavedVideoTrackingDataSuccess: ['data'],
    saveUnsavedVideoTrackingDataFailure: ['data'],

    activityCompletionViewCriteriaRequest: ['body'],
    activityCompletionViewCriteriaSuccess: ['data'],
    activityCompletionViewCriteriaFailure: ['error'],

    getVideoDetailRequest: ['body'],
    getVideoDetailSuccess: ['data'],
    getVideoDetailFailure: ['error'],

    connectToAlmsRequest: ['body'],
    connectToAlmsSuccess: ['data'],
    connectToAlmsFailure: ['error'],
})

export const ActivityInteractTypes = Types
export default Creators


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({

    saveVideoTrackingData: [],
    saveVideoTrackingProcess: false,
    saveVideoTrackingErrorMessage: '',
    saveVideoTrackingError: false,

    unsavedVideoTrackingSuccess: false,
    unsavedVideoTrackingData: null,
    unsavedVideoTrackingFailure: false,

    viewCompletionCriteriaData: [],
    viewCompletionCriteriaFetching: false,
    viewCompletionCriteriaErrorMessage: '',
    viewCompletionCriteriaError: false,

    videoDetailResponse: null,
    videoDetailError: false,
    videoDetailErrorMessage: '',

    connectToAlmsUrl: null,
    connectToAlmsError: false,
    connectoToAlmsErrorMessage: ''

})


/* ------------- Reducers ------------- */
export const saveVideoTrackingRequest = (state, action) => {
    console.log("saveVideoTrackingRequest : ", action.body);
    return state.merge({ saveVideoTrackingProcess: true, saveVideoTrackingErrorMessage: '', saveVideoTrackingError: false })
}

export const saveVideoTrackingSuccess = (state, action) => {
    console.log("saveVideoTrackingSuccess", action.data);
    return state.merge({ saveVideoTrackingData: action.data, saveVideoTrackingProcess: false, saveVideoTrackingErrorMessage: '', saveVideoTrackingError: false })
}

export const saveVideoTrackingFailure = (state, action) => {
    console.log("saveVideoTrackingFailure", action.error);
    return state.merge({ saveVideoTrackingProcess: false, saveVideoTrackingErrorMessage: action.error, saveVideoTrackingError: true })
}


export const activityCompletionViewCriteriaRequest = (state, action) => {
    console.log("activityCompletionViewCriteriaRequest ", action.body)
    return state.merge({ viewCompletionCriteriaFetching: true, viewCompletionCriteriaErrorMessage: '', viewCompletionCriteriaError: false })
}

export const activityCompletionViewCriteriaSuccess = (state, action) => {
    console.log("activityCompletionViewCriteriaSuccess : ", action.data);
    return state.merge({ viewCompletionCriteriaData: action.data, viewCompletionCriteriaFetching: false, viewCompletionCriteriaErrorMessage: '', viewCompletionCriteriaError: false })
}

export const activityCompletionViewCriteriaFailure = (state, action) => {
    console.log("activityCompletionViewCriteriaFailure : ", action.error);
    return state.merge({ viewCompletionCriteriaFetching: false, viewCompletionCriteriaErrorMessage: action.error, viewCompletionCriteriaError: true })
}

/* -------unsaved video tracking data------------ */
export const saveUnsavedVideoTrackingData = (state, action) => {
    return state.merge({})
}
export const saveUnsavedVideoTrackingDataSuccess = (state, action) => {
    console.log("saveUnsavedVideoTrackingDataSuccess : ", action.data)
    return state.merge({ unsavedVideoTrackingSuccess: true, unsavedVideoTrackingData: action.data, unsavedVideoTrackingFailure: false })
}
export const saveUnsavedVideoTrackingDataFailure = (state, action) => {
    console.log("saveUnsavedVideoTrackingDataFailure : ", action.error)
    return state.merge({ unsavedVideoTrackingSuccess: false, unsavedVideoTrackingFailure: true })
}

export const getVideoDetailRequest = (state, action) => {
    return state.merge({ videoDetailError: false, videoDetailErrorMessage: '' })
}
export const getVideoDetailSuccess = (state, action) => {
    console.log("getVideoDetailSuccess : ", action.data)
    return state.merge({ videoDetailResponse: action.data, videoDetailError: false, videoDetailErrorMessage: '' })
}
export const getVideoDetailFailure = (state, action) => {
    console.log("getVideoDetailFailure : ", action.error)
    return state.merge({ videoDetailError: true, videoDetailErrorMessage: action.error })
}
// -----
export const connectToAlmsRequest = (state, action) => {
    console.log("connectToAlmsRequest: ", action.body)
    return state.merge({ connectToAlmsError: false, connectoToAlmsErrorMessage: '' })
}
export const connectToAlmsSuccess = (state, action) => {
    console.log("connectToAlmsSuccess : ", action.data)
    return state.merge({ connectToAlmsUrl: action.data, connectToAlmsError: false, connectoToAlmsErrorMessage: '' })
}
export const connectToAlmsFailure = (state, action) => {
    console.log("connectToAlmsFailure : ", action.error)
    return state.merge({ connectToAlmsError: true, connectoToAlmsErrorMessage: action.error })
}

/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.SAVE_VIDEO_TRACKING_REQUEST]: saveVideoTrackingRequest,
    [Types.SAVE_VIDEO_TRACKING_SUCCESS]: saveVideoTrackingSuccess,
    [Types.SAVE_VIDEO_TRACKING_FAILURE]: saveVideoTrackingFailure,

    [Types.ACTIVITY_COMPLETION_VIEW_CRITERIA_REQUEST]: activityCompletionViewCriteriaRequest,
    [Types.ACTIVITY_COMPLETION_VIEW_CRITERIA_SUCCESS]: activityCompletionViewCriteriaSuccess,
    [Types.ACTIVITY_COMPLETION_VIEW_CRITERIA_FAILURE]: activityCompletionViewCriteriaFailure,

    [Types.SAVE_UNSAVED_VIDEO_TRACKING_DATA]: saveUnsavedVideoTrackingData,
    [Types.SAVE_UNSAVED_VIDEO_TRACKING_DATA_SUCCESS]: saveUnsavedVideoTrackingDataSuccess,
    [Types.SAVE_UNSAVED_VIDEO_TRACKING_DATA_FAILURE]: saveUnsavedVideoTrackingDataFailure,

    [Types.GET_VIDEO_DETAIL_REQUEST]: getVideoDetailRequest,
    [Types.GET_VIDEO_DETAIL_SUCCESS]: getVideoDetailSuccess,
    [Types.GET_VIDEO_DETAIL_FAILURE]: getVideoDetailFailure,

    [Types.CONNECT_TO_ALMS_REQUEST]: connectToAlmsRequest,
    [Types.CONNECT_TO_ALMS_SUCCESS]: connectToAlmsSuccess,
    [Types.CONNECT_TO_ALMS_FAILURE]: connectToAlmsFailure,

})