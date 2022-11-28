import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setCourse: ['data'],
    setActivityList: [],
    setCourseAnnouncementList: [],
    clearActivityDetail: [],

    // getCourseAnnouncementRequest: ['take', 'skip', 'contextType', 'courseId', 'apiEndPoint', 'accessToken'],
    getCourseAnnouncementRequest: ['body'],
    getCourseAnnouncementSuccess: ['data'],
    getCourseAnnouncementFailure: ['error'],

    getIncomingActivitiesRequest: ['take', 'skip', 'classId', 'apiEndPoint', 'accessToken'],
    getIncomingActivitiesSuccess: ['data'],
    getIncomingActivitiesFailure: ['error'],

    getCourseWeeksRequest: ['body'],
    getCourseWeeksSuccess: ['data'],
    getCourseWeeksFailure: ['error'],

    getWeeksActivitiesRequest: ['body'],
    getWeeksActivitiesSuccess: ['data'],
    getWeeksActivitiesFailure: ['error'],

    getActivityListRequest: ['body'],
    getActivityListSuccess: ['data'],
    getActivityListFailure: ['error'],

    fileDownloadRequest: ['body'],
    fileDownloadSuccess: ['data'],
    fileDownloadFailure: ['error'],

    activityDetailRequest: ['body'],
    activityDetailSuccess: ['data'],
    activityDetailFailure: ['error'],

    topCompletedActivityRequest: ['body'],
    topCompletedActivitySuccess: ['data'],
    topCompletedActivityFailure: ['error'],

    sendAssignmentAnswerRequest: ['body'],
    sendAssignmentAnswerSuccess: ['data'],
    sendAssignmentAnswerFailure: ['error'],

})

export const CourseDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    course: '',

    courseAnnouncementData: [],
    courseAllAnnouncementData: [],
    couseAnnouncementsfetching: true,
    couseAnnouncementsErrorMessage: '',
    couseAnnouncementsError: false,
    fetchingType: null,

    incomingActivities: [],
    iaFetching: true,
    isErrorMessage: '',
    iaError: false,

    courseWeeks: [],
    courseWeeksFetching: true,
    courseWeeksErrorMessage: '',
    courseWeeksError: false,

    weeksActivities: [],
    weeksActivitiesFetching: true,
    weeksActivitiesErrorMessage: '',
    weeksActivitiesError: false,

    activityList: [],
    activityListFetching: true,
    activityListErrorMessage: '',
    activityListError: false,
    getSingleActivity: false,
    singleActivityData: [],

    fileDownloadPath: null,
    fileDownloadFetching: true,
    fileDownloadErrorMessage: '',
    fileDownloadError: false,

    activityDetail: [],
    activityDetailFetching: false,
    activityDetailErrorMessage: '',
    activityDetailError: false,

    topCompletedActivityData: null,
    topCompletedActivityFetching: false,
    topCompletedActivityErrorMessage: '',
    topCompletedActivityError: false,

    sendAssignmentAnswerData: null,
    sendAssignmentAnswerError: false,
    sendAssignmentAnswerErrorMessage: ''

})

/* ------------- Reducers ------------- */
export const getCourseAnnouncementRequest = (state, action) => {
    console.log("getCourseAnnouncementRequest : ", action.body);
    return state.merge({ couseAnnouncementsfetching: true, couseAnnouncementsError: false, couseAnnouncementsErrorMessage: '', fetchingType: action.body.type })
}
export const getCourseAnnouncementSuccess = (state, action) => {
    console.log("getCourseAnnouncementSuccess : ", action.data);
    if (state.fetchingType === 2) {
        return state.merge({ couseAnnouncementsfetching: false, couseAnnouncementsError: false, couseAnnouncementsErrorMessage: '', courseAllAnnouncementData: action.data })
    } else {
        return state.merge({ couseAnnouncementsfetching: false, couseAnnouncementsError: false, couseAnnouncementsErrorMessage: '', courseAnnouncementData: action.data })
    }
}
export const getCourseAnnouncementFailure = (state, action) => {
    console.log("getCourseAnnouncementFailure : ", action.error);
    return state.merge({ couseAnnouncementsfetching: false, couseAnnouncementsError: true, couseAnnouncementsErrorMessage: action.error })
}


/*  ---  */
export const getIncomingActivitiesRequest = (state, action) => {
    return state.merge({ iaFetching: true, iaError: false, isErrorMessage: '' })
}
export const getIncomingActivitiesSuccess = (state, action) => {
    return state.merge({ iaFetching: false, iaError: false, isErrorMessage: '', incomingActivities: action.data })
}
export const getIncomingActivitiesFailure = (state, action) => {
    return state.merge({ iaFetching: false, iaError: true, isErrorMessage: action.error })
}


/*  ---  */
export const getCourseWeeksRequest = (state, action) => {
    console.log("getCourseWeeksRequest: ", action.body);
    return state.merge({ courseWeeksFetching: true, courseWeeksError: false, courseWeeksErrorMessage: '' })
}
export const getCourseWeeksSuccess = (state, action) => {
    console.log("getCourseWeeksSuccess : ", action.data.termWeeks)
    return state.merge({ courseWeeksFetching: false, courseWeeksError: false, courseWeeksErrorMessage: '', courseWeeks: action.data.termWeeks })
}
export const getCourseWeeksFailure = (state, action) => {
    return state.merge({ courseWeeksFetching: false, courseWeeksError: true, courseWeeksErrorMessage: action.error })
}


/*  ---  */
export const getWeeksActivitiesRequest = (state, action) => {
    return state.merge({ weeksActivitiesFetching: true, weeksActivitiesError: false, weeksActivitiesErrorMessage: '' })
}
export const getWeeksActivitiesSuccess = (state, action) => {
    return state.merge({ weeksActivitiesFetching: false, weeksActivitiesError: false, weeksActivitiesErrorMessage: '', weeksActivities: action.data })
}
export const getWeeksActivitiesFailure = (state, action) => {
    return state.merge({ weeksActivitiesFetching: false, weeksActivitiesError: true, weeksActivitiesErrorMessage: action.error })
}


/*  ---  */
export const getActivityListRequest = (state, action) => {
    console.log("getActivityListRequest ", action.body)
    return state.merge({ activityListFetching: true, activityListError: false, activityListErrorMessage: '', getSingleActivity: action.body.single })
}
export const getActivityListSuccess = (state, action) => {
    if (state.getSingleActivity) {
        console.log("getActivityListSuccess single: ", action.data)
        return state.merge({ activityListFetching: false, activityListError: false, activityListErrorMessage: '', singleActivityData: action.data })
    } else {
        console.log("getActivityListSuccess : ", action.data)
        return state.merge({ activityListFetching: false, activityListError: false, activityListErrorMessage: '', activityList: action.data })
    }

}
export const getActivityListFailure = (state, action) => {
    console.log("getActivityListFailure error: ", action.error)
    return state.merge({ activityListFetching: false, activityListError: true, activityListErrorMessage: action.error })
}

/* ---- */
export const fileDownloadRequest = (state, action) => {
    return state.merge({ fileDownloadFetching: true, fileDownloadError: false, fileDownloadErrorMessage: '' })
}
export const fileDownloadSuccess = (state, action) => {
    console.log("fileDownloadSuccess response:", action.data);
    return state.merge({ fileDownloadFetching: false, fileDownloadError: false, fileDownloadErrorMessage: '', fileDownloadPath: action.data })
}

export const fileDownloadFailure = (state, action) => {
    return state.merge({ fileDownloadFetching: false, fileDownloadError: true, fileDownloadErrorMessage: action.error })
}


/* -------- */

export const activityDetailRequest = (state, action) => {
    return state.merge({ activityDetailFetching: true, activityDetailErrorMessage: '', activityDetailError: false })
}
export const activityDetailSuccess = (state, action) => {
    return state.merge({ activityDetail: action.data, activityDetailFetching: false, activityDetailErrorMessage: '', activityDetailError: false })
}

export const activityDetailFailure = (state, action) => {
    return state.merge({ activityDetailFetching: false, activityDetailErrorMessage: action.error, activityDetailError: true })
}

/* get Top Completed ACtivity */
export const topCompletedActivityRequest = (state, action) => {
    console.log("topCompletedActivityRequest:", action.body);
    return state.merge({ topCompletedActivityFetching: true, topCompletedActivityErrorMessage: '', topCompletedActivityError: false })
}
export const topCompletedActivitySuccess = (state, action) => {
    console.log("topCompletedActivitySuccess:", action.data);
    return state.merge({ topCompletedActivityData: action.data, topCompletedActivityFetching: false, topCompletedActivityErrorMessage: '', topCompletedActivityError: false })
}

export const topCompletedActivityFailure = (state, action) => {
    console.log("topCompletedActivityFailure:", action.error);
    return state.merge({ topCompletedActivityFetching: false, topCompletedActivityErrorMessage: action.error, topCompletedActivityError: true })
}


/* send assignment answer */
export const sendAssignmentAnswerRequest = (state, action) => {
    console.log("sendAssignmentAnswerRequest:", action.body);
    return state.merge({ sendAssignmentAnswerError: false, sendAssignmentAnswerErrorMessage: '' })
}
export const sendAssignmentAnswerSuccess = (state, action) => {
    console.log("sendAssignmentAnswerSuccess:", action.data);
    return state.merge({ sendAssignmentAnswerData: action.data, sendAssignmentAnswerError: false, sendAssignmentAnswerErrorMessage: '' })
}

export const sendAssignmentAnswerFailure = (state, action) => {
    console.log("sendAssignmentAnswerFailure:", action.error);
    return state.merge({ sendAssignmentAnswerData: action.error, sendAssignmentAnswerError: true, sendAssignmentAnswerErrorMessage: action.error })
}

export const setCourse = (state, action) => {
    console.log("set course: ", action.data);
    return state.merge({ course: action.data })
}
export const setActivityList = (state, action) => {
    return state.merge({ activityListFetching: true, activityListError: false, activityListErrorMessage: '', activityList: [] })
}

export const setCourseAnnouncementList = (state, action) => {
    return state.merge({ courseAnnouncementData: [], couseAnnouncementsfetching: true, couseAnnouncementsErrorMessage: '', couseAnnouncementsError: false })
}

export const clearActivityDetail = (state, action) => {
    return state.merge({ activityDetail: [], activityDetailFetching: false, activityDetailErrorMessage: '', activityDetailError: false })
}
/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {

    [Types.SET_COURSE]: setCourse,
    [Types.SET_ACTIVITY_LIST]: setActivityList,
    [Types.SET_COURSE_ANNOUNCEMENT_LIST]: setCourseAnnouncementList,
    [Types.CLEAR_ACTIVITY_DETAIL]: clearActivityDetail,

    [Types.GET_COURSE_ANNOUNCEMENT_REQUEST]: getCourseAnnouncementRequest,
    [Types.GET_COURSE_ANNOUNCEMENT_SUCCESS]: getCourseAnnouncementSuccess,
    [Types.GET_COURSE_ANNOUNCEMENT_FAILURE]: getCourseAnnouncementFailure,

    [Types.GET_INCOMING_ACTIVITIES_REQUEST]: getIncomingActivitiesRequest,
    [Types.GET_INCOMING_ACTIVITIES_SUCCESS]: getIncomingActivitiesSuccess,
    [Types.GET_INCOMING_ACTIVITIES_FAILURE]: getIncomingActivitiesFailure,

    [Types.GET_COURSE_WEEKS_REQUEST]: getCourseWeeksRequest,
    [Types.GET_COURSE_WEEKS_SUCCESS]: getCourseWeeksSuccess,
    [Types.GET_COURSE_WEEKS_FAILURE]: getCourseWeeksFailure,

    [Types.GET_WEEKS_ACTIVITIES_REQUEST]: getWeeksActivitiesRequest,
    [Types.GET_WEEKS_ACTIVITIES_SUCCESS]: getWeeksActivitiesSuccess,
    [Types.GET_WEEKS_ACTIVITIES_FAILURE]: getWeeksActivitiesFailure,

    [Types.GET_ACTIVITY_LIST_REQUEST]: getActivityListRequest,
    [Types.GET_ACTIVITY_LIST_SUCCESS]: getActivityListSuccess,
    [Types.GET_ACTIVITY_LIST_FAILURE]: getActivityListFailure,

    [Types.ACTIVITY_DETAIL_REQUEST]: activityDetailRequest,
    [Types.ACTIVITY_DETAIL_SUCCESS]: activityDetailSuccess,
    [Types.ACTIVITY_DETAIL_FAILURE]: activityDetailFailure,


    [Types.FILE_DOWNLOAD_REQUEST]: fileDownloadRequest,
    [Types.FILE_DOWNLOAD_SUCCESS]: fileDownloadSuccess,
    [Types.FILE_DOWNLOAD_FAILURE]: fileDownloadFailure,

    [Types.TOP_COMPLETED_ACTIVITY_REQUEST]: topCompletedActivityRequest,
    [Types.TOP_COMPLETED_ACTIVITY_SUCCESS]: topCompletedActivitySuccess,
    [Types.TOP_COMPLETED_ACTIVITY_FAILURE]: topCompletedActivityFailure,

    [Types.SEND_ASSIGNMENT_ANSWER_REQUEST]: sendAssignmentAnswerRequest,
    [Types.SEND_ASSIGNMENT_ANSWER_SUCCESS]: sendAssignmentAnswerSuccess,
    [Types.SEND_ASSIGNMENT_ANSWER_FAILURE]: sendAssignmentAnswerFailure,
})
