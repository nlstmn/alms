import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    clearAddActivityData:[],

    getTagsUnitRequest: ['body'],
    getTagsUnitSuccess: ['data'],
    getTagsUnitFailure: ['error'],

    getTagsCreditsRequest: ['body'],
    getTagsCreditsSuccess: ['data'],
    getTagsCreditsFailure: ['error'],

    conditionalActivitiesRequest: ['body'],
    conditionalActivitiesSuccess: ['data'],
    conditionalActivitiesFailure: ['error'],

    getClassInformationRequest: ['body'],
    getClassInformationSuccess: ['data'],
    getClassInformationFailure: ['error'],

    uploadFileRequest: ['body'],
    uploadFileSuccess: ['data'],
    uploadFileFailure: ['error'],

    addActivityTypeRequest: ['body'],
    addActivityTypeSuccess: ['data'],
    addActivityTypeFailure: ['error'],

})


export const AddActivityTypes = Types
export default Creators


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    tagsUnits: [],
    tagsUnitsFetching: false,
    tagsUnitsErrorMessage: '',
    tagsUnitsError: false,

    tagsCredits: [],
    tagsCreditsFetching: false,
    tagsCreditsErrorMessage: '',
    tagsCreditsError: false,

    conditionalActivities: [],
    conditionalActivitiesFetching: false,
    conditionalActivitiesErrorMessage: '',
    conditionalActivitiesError: false,

    classInformation: null,
    classInformationFetching: false,
    classInformationErrorMessage: '',
    classInformationError: false,

    uploadFile: false,
    uploadFileProcessing: false,
    uploadFileErrorMessage: '',
    uploadFileError: false,

    addActivityData: false,
    addActivityProcessing: false,
    addActivityErrorMessage: '',
    addActivityError: false,

})

/* ------------  */
export const getTagsUnitRequest = (state, action) => {
    console.log("getTagsUnitRequest body:", action.body);
    return state.merge({ tagsUnits: [], tagsUnitsFetching: true, tagsUnitsErrorMessage: '', tagsUnitsError: false })
}

export const getTagsUnitSuccess = (state, action) => {
    console.log("getTagsUnitSuccess data: ", action.data)
    return state.merge({ tagsUnits: action.data, tagsUnitsFetching: false, tagsUnitsErrorMessage: '', tagsUnitsError: false })
}

export const getTagsUnitFailure = (state, action) => {
    console.log("getTagsUnitFailure data: ", action.error)
    return state.merge({ tagsUnits: [], tagsUnitsFetching: false, tagsUnitsErrorMessage: action.error, tagsUnitsError: true })
}

/* ------------- */
export const getTagsCreditsRequest = (state, action) => {
    console.log("getTagsCreditsRequest body: ", action.body);
    return state.merge({ tagsCredits: [], tagsCreditsFetching: true, tagsCreditsErrorMessage: '', tagsCreditsError: false })
}

export const getTagsCreditsSuccess = (state, action) => {
    console.log("getTagsCreditsSuccess : ", action.data);
    return state.merge({ tagsCredits: action.data, tagsCreditsFetching: false, tagsCreditsErrorMessage: '', tagsCreditsError: false })
}

export const getTagsCreditsFailure = (state, action) => {
    console.log("getTagsCreditsFailure  ", action.error);
    return state.merge({ tagsCredits: [], tagsCreditsFetching: false, tagsCreditsErrorMessage: action.error, tagsCreditsError: true })
}

/* ----------------- */
export const conditionalActivitiesRequest = (state, action) => {
    return state.merge({ conditionalActivities: [], conditionalActivitiesFetching: true, conditionalActivitiesErrorMessage: '', conditionalActivitiesError: false })
}

export const conditionalActivitiesSuccess = (state, action) => {
    return state.merge({ conditionalActivities: action.data, conditionalActivitiesFetching: false, conditionalActivitiesErrorMessage: '', conditionalActivitiesError: false })
}

export const conditionalActivitiesFailure = (state, action) => {
    console.log("conditionalActivitiesFailure : ", action.error);
    return state.merge({ conditionalActivities: [], conditionalActivitiesFetching: false, conditionalActivitiesErrorMessage: action.error, conditionalActivitiesError: true })
}

/* --------------- */
export const getClassInformationRequest = (state, action) => {
    console.log("getClassInformationRequest data: ", action.body);
    return state.merge({ classInformation: null, classInformationFetching: true, classInformationErrorMessage: '', classInformationError: false })
}
export const getClassInformationSuccess = (state, action) => {
    console.log("getClassInformationSuccess : ", action.data);
    return state.merge({ classInformation: action.data, classInformationFetching: false, classInformationErrorMessage: '', classInformationError: false })
}
export const getClassInformationFailure = (state, action) => {
    console.log("getClassInformationFailure : ", action.error);
    return state.merge({ classInformation: null, classInformationFetching: false, classInformationErrorMessage: action.error, classInformationError: true })
}

/* --------------- */
export const uploadFileRequest = (state, action) => {
    console.log("uploadFileRequest data: ", action.body);
    return state.merge({ uploadFile: false, uploadFileProcessing: true, uploadFileErrorMessage: '', uploadFileError: false })
}
export const uploadFileSuccess = (state, action) => {
    console.log("uploadFileSuccess : ", action.data);
    return state.merge({ uploadFile: action.data, uploadFileProcessing: false, uploadFileErrorMessage: '', uploadFileError: false })
}
export const uploadFileFailure = (state, action) => {
    console.log("uploadFileFailure : ", action.error);
    return state.merge({ uploadFile: false, uploadFileProcessing: false, uploadFileErrorMessage: action.error, uploadFileError: true })
}


export const addActivityTypeRequest = (state, action) => {
    return state.merge({ addActivityData: false, addActivityProcessing: true, addActivityErrorMessage: '', addActivityError: false })
}

export const addActivityTypeSuccess = (state, action) => {
    console.log("addActivityTypeSuccess : ",action.data);
    return state.merge({ addActivityData: action.data, addActivityProcessing: false, addActivityErrorMessage: '', addActivityError: false })
}

export const addActivityTypeFailure = (state, action) => {
    console.log("addActivityTypeFailure : ",action.error);
    return state.merge({addActivityProcessing: false, addActivityErrorMessage: action.error, addActivityError: true })
}

export const clearAddActivityData =(state,action)=>{
    return state.merge({ addActivityData: false, addActivityProcessing: false, addActivityErrorMessage: '', addActivityError: false })

}


/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_TAGS_UNIT_REQUEST]: getTagsUnitRequest,
    [Types.GET_TAGS_UNIT_SUCCESS]: getTagsUnitSuccess,
    [Types.GET_TAGS_UNIT_FAILURE]: getTagsUnitFailure,

    [Types.GET_TAGS_CREDITS_REQUEST]: getTagsCreditsRequest,
    [Types.GET_TAGS_CREDITS_SUCCESS]: getTagsCreditsSuccess,
    [Types.GET_TAGS_CREDITS_FAILURE]: getTagsCreditsFailure,

    [Types.CONDITIONAL_ACTIVITIES_REQUEST]: conditionalActivitiesRequest,
    [Types.CONDITIONAL_ACTIVITIES_SUCCESS]: conditionalActivitiesSuccess,
    [Types.CONDITIONAL_ACTIVITIES_FAILURE]: conditionalActivitiesFailure,

    [Types.GET_CLASS_INFORMATION_REQUEST]: getClassInformationRequest,
    [Types.GET_CLASS_INFORMATION_SUCCESS]: getClassInformationSuccess,
    [Types.GET_CLASS_INFORMATION_FAILURE]: getClassInformationFailure,

    [Types.UPLOAD_FILE_REQUEST]: uploadFileRequest,
    [Types.UPLOAD_FILE_SUCCESS]: uploadFileSuccess,
    [Types.UPLOAD_FILE_FAILURE]: uploadFileFailure,

    [Types.ADD_ACTIVITY_TYPE_REQUEST]: addActivityTypeRequest,
    [Types.ADD_ACTIVITY_TYPE_SUCCESS]: addActivityTypeSuccess,
    [Types.ADD_ACTIVITY_TYPE_FAILURE]: addActivityTypeFailure,

    [Types.CLEAR_ADD_ACTIVITY_DATA]:clearAddActivityData,
})
