import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setAnnouncementDetail: [],
    setAllAnnouncement: [],
    setInboxAnnouncement: [],
    setDeletedAnnouncement: [],
    setSentAnnouncement: [],
    clearAnnouncementReceiver: [],


    getAnnouncementRequest: ['body'],
    getAnnouncementSuccess: ['data', 'type'],
    getAnnouncementFailure: ['error'],

    getAnnouncementInboxRequest: ['body'],
    getAnnouncementInboxSuccess: ['data'],
    getAnnouncementInboxFailure: ['error'],

    getAnnouncementSentRequest: ['body'],
    getAnnouncementSentSuccess: ['data'],
    getAnnouncementSentFailure: ['error'],

    getAnnouncementDeletedRequest: ['body'],
    getAnnouncementDeletedSuccess: ['data'],
    getAnnouncementDeletedFailure: ['error'],

    getAnnouncementDetailRequest: ['body'],
    getAnnouncementDetailSuccess: ['data'],
    getAnnouncementDetailFailure: ['error'],

    downloadAnnouncementAttachmentRequest: ['body'],
    downloadAnnouncementAttachmentSuccess: ['data'],
    downloadAnnouncementAttachmentFailure: ['error'],
    setDownloadingPercent: ['percent'],

    addAnnouncementRequest: ['body'],
    addAnnouncementSuccess: ['data'],
    addAnnouncementFailure: ['error'],

    announcementChangeStateRequest: ['body'],
    announcementChangeStateSuccess: ['data'],
    announcementChangeStateFailure: ['error'],

    searchAnnouncementReceiverRequest: ['body'],
    searchAnnouncementReceiverSuccess: ['data'],
    searchAnnouncementReceiverFailure: ['error'],

})

export const AnnouncementTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    announcementsData: [],
    unreadAnnouncementData: [],
    otherAnnouncementData: [],
    searchAnnouncementData: [],
    announcementType: null,
    fetching: true,
    errorMessage: '',
    error: false,

    announcementDetail: [],
    announcementDetailFetching: true,
    announcementDetailErrorMessage: '',
    announcementDetailError: false,

    announcementsInboxData: [],
    announcementsInboxFetching: true,
    announcementsInboxErrorMessage: '',
    announcementsInboxError: false,

    announcementsDeletedData: [],
    announcementsDeletedFetching: true,
    announcementsDeletedErrorMessage: '',
    announcementsDeletedError: false,

    announcementsSentData: [],
    announcementsSentFetching: true,
    announcementsSentErrorMessage: '',
    announcementsSentError: false,

    downloadAnnouncementAttachmentData: [],
    downloadAnnouncementAttachmentFetching: false,
    downloadAnnouncementAttachmentErrorMessage: '',
    downloadAnnouncementAttachmentError: false,
    downloadingPercent: 0,

    addAnnouncementResponseData: [],
    addAnnouncementSending: false,
    addAnnouncementErrorMessage: '',
    addAnnouncementError: false,

    announcementChangeStateData: false,
    announcementChangeStateProcessing: false,
    announcementChangeStateErrorMessage: '',
    announcementChangeStateError: false,

    searchAnnouncementReceiverData: [],
    searchAnnouncementReceiverFetching: false,
    searchAnnouncementReceiverErrorMessage: '',
    searchAnnouncementReceiverError: false,


})

/* ------------- Reducers ------------- */
export const getAnnouncementRequest = (state, action) => {
    console.log('getAnnouncementRequest: ', action.body);
    return state.merge({ fetching: true, error: false, errorMessage: '', announcementType: action.body.type })
}

export const getAnnouncementSuccess = (state, action) => {
    console.log('getAnnouncementSuccess : ', action)
    console.log('state.announcementType : ',state.announcementType)
    if (state.announcementType == 1) {
        return state.merge({ fetching: false, error: false, errorMessage: '', unreadAnnouncementData: action.data })
    } else if (state.announcementType == 2) {
        return state.merge({ fetching: false, error: false, errorMessage: '', otherAnnouncementData: action.data })
    } else if (state.announcementType == 3) {
        return state.merge({ fetching: false, error: false, errorMessage: '', searchAnnouncementData: action.data })
    } else {
        return state.merge({ fetching: false, error: false, errorMessage: '', announcementsData: action.data })
    }

}

export const getAnnouncementFailure = (state, action) => {
    console.log('getAnnouncementFailure : ', action)
    return state.merge({ fetching: false, error: true, errorMessage: action.error })
}

/*  ---- */
export const getAnnouncementInboxRequest = (state, action) => {
    return state.merge({ announcementsInboxFetching: true, announcementsInboxError: false, announcementsInboxErrorMessage: '' })
}

export const getAnnouncementInboxSuccess = (state, action) => {
    return state.merge({ announcementsInboxFetching: false, announcementsInboxError: false, announcementsInboxErrorMessage: '', announcementsInboxData: [...state.announcementsInboxData, ...action.data] })
}

export const getAnnouncementInboxFailure = (state, action) => {
    return state.merge({ announcementsInboxFetching: false, announcementsInboxError: true, announcementsInboxErrorMessage: action.error })
}


/*  ---- */
export const getAnnouncementSentRequest = (state, action) => {
    return state.merge({ announcementsSentFetching: true, announcementsSentErrorMessage: '', announcementsSentError: false })
}

export const getAnnouncementSentSuccess = (state, action) => {
    return state.merge({ announcementsSentFetching: false, announcementsSentErrorMessage: '', announcementsSentError: false, announcementsSentData: [...state.announcementsSentData, ...action.data] })
}

export const getAnnouncementSentFailure = (state, action) => {
    return state.merge({ announcementsSentFetching: false, announcementsSentErrorMessage: action.error, announcementsSentError: true })
}


/*  ---- */

export const getAnnouncementDeletedRequest = (state, action) => {
    return state.merge({ announcementsDeletedFetching: true, announcementsDeletedError: false, announcementsDeletedErrorMessage: '' })
}

export const getAnnouncementDeletedSuccess = (state, action) => {
    return state.merge({ announcementsDeletedFetching: false, announcementsDeletedError: false, announcementsDeletedErrorMessage: '', announcementsDeletedData: [...state.announcementsDeletedData, ...action.data] })

}

export const getAnnouncementDeletedFailure = (state, action) => {
    return state.merge({ announcementsDeletedFetching: false, announcementsDeletedError: true, announcementsDeletedErrorMessage: action.error })
}

/* -- */
export const getAnnouncementDetailRequest = (state, action) => {
    console.log('getAnnouncementDetailRequest ', action.body)
    return state.merge({ announcementDetailFetching: true, announcementDetailError: false, announcementDetailErrorMessage: '' })
}

export const getAnnouncementDetailSuccess = (state, action) => {
    console.log('getAnnouncementDetailSuccess ', action.data)
    return state.merge({ announcementDetailFetching: false, announcementDetailError: false, announcementDetailErrorMessage: '', announcementDetail: action.data })
}

export const getAnnouncementDetailFailure = (state, action) => {
    console.log('getAnnouncementDetailFailure ', action.error)
    return state.merge({ announcementDetailFetching: false, announcementDetailError: true, announcementDetailErrorMessage: action.error })
}

/* --- */
export const addAnnouncementRequest = (state, action) => {
    console.log("addAnnouncementRequest : ",action.body)
    return state.merge({ addAnnouncementSending: true, addAnnouncementErrorMessage: '', addAnnouncementError: false })
}

export const addAnnouncementSuccess = (state, action) => {
    console.log("addAnnouncementSuccess : ", action.data)
    return state.merge({ addAnnouncementResponseData: action.data, addAnnouncementSending: false, addAnnouncementErrorMessage: '', addAnnouncementError: false })
}

export const addAnnouncementFailure = (state, action) => {
    console.log("addAnnouncementFailure : ",action.error)
    return state.merge({ addAnnouncementSending: false, addAnnouncementErrorMessage: action.error, addAnnouncementError: true })
}


/* --------- */
export const announcementChangeStateRequest = (state, action) => {
    console.log("announcementChangeStateRequest", action.body);
    return state.merge({ announcementChangeStateProcessing: true, announcementChangeStateErrorMessage: '', announcementChangeStateError: false })
}

export const announcementChangeStateSuccess = (state, action) => {
    console.log("announcementChangeStateSuccess", action.data);
    return state.merge({ announcementChangeStateData: action.data, announcementChangeStateProcessing: false, announcementChangeStateErrorMessage: '', announcementChangeStateError: false })
}

export const announcementChangeStateFailure = (state, action) => {
    console.log("announcementChangeStateFailure", action.error);
    return state.merge({ announcementChangeStateProcessing: false, announcementChangeStateErrorMessage: action.error, announcementChangeStateError: true })
}

/* --- */
export const downloadAnnouncementAttachmentRequest = (state, action) => {
    console.log("downloadAnnouncementAttachmentRequest", action.body);
    return state.merge({
        downloadAnnouncementAttachmentFetching: true,
        downloadAnnouncementAttachmentErrorMessage: '',
        downloadAnnouncementAttachmentError: false,
    })
}

export const downloadAnnouncementAttachmentSuccess = (state, action) => {
    console.log("downloadAnnouncementAttachmentSuccess", action.data);
    return state.merge({
        downloadAnnouncementAttachmentData: action.data,
        downloadAnnouncementAttachmentFetching: false,
        downloadAnnouncementAttachmentErrorMessage: '',
        downloadAnnouncementAttachmentError: false,
    })
}

export const downloadAnnouncementAttachmentFailure = (state, action) => {
    console.log("downloadAnnouncementAttachmentFailure", action.error);
    return state.merge({
        downloadAnnouncementAttachmentFetching: false,
        downloadAnnouncementAttachmentErrorMessage: action.error,
        downloadAnnouncementAttachmentError: true,
    })
}

export const setDownloadingPercent = (state, action) => {
    console.log("setDownloadingPercent : ", action.percent);
    return state.merge({ downloadingPercent: action.percent })
}


/* ------------------ */

export const searchAnnouncementReceiverRequest = (state, action) => {
    console.log("searchAnnouncementReceiverRequest : ",action.body)
    return state.merge({ searchAnnouncementReceiverFetching: true, searchAnnouncementReceiverErrorMessage: '', searchAnnouncementReceiverError: false })
}

export const searchAnnouncementReceiverSuccess = (state, action) => {
    console.log("searchAnnouncementReceiverSuccess : ",action.data)
    return state.merge({ searchAnnouncementReceiverFetching: false, searchAnnouncementReceiverErrorMessage: '', searchAnnouncementReceiverError: false, searchAnnouncementReceiverData: action.data })
}

export const searchAnnouncementReceiverFailure = (state, action) => {
    console.log("searchAnnouncementReceiverFailure : ",action.error)
    return state.merge({ searchAnnouncementReceiverFetching: false, searchAnnouncementReceiverErrorMessage: action.error, searchAnnouncementReceiverError: true })
}


/* ----------------- */

export const setAnnouncementDetail = (state, action) => {
    return state.merge({ announcementDetail: [], announcementDetailFetching: true, announcementDetailErrorMessage: '', announcementDetailError: false })
}
export const setAllAnnouncement = (state, action) => {
    return state.merge({ announcementsData: [], fetching: true, errorMessage: '', error: false })
}
export const setInboxAnnouncement = (state, action) => {
    return state.merge({ announcementsInboxData: [], announcementsInboxFetching: true, announcementsInboxErrorMessage: '', announcementsInboxError: false, })
}
export const setDeletedAnnouncement = (state, action) => {
    return state.merge({ announcementsDeletedData: [], announcementsDeletedFetching: true, announcementsDeletedErrorMessage: '', announcementsDeletedError: false, })
}
export const setSentAnnouncement = (state, action) => {
    return state.merge({ announcementsSentData: [], announcementsSentFetching: true, announcementsSentErrorMessage: '', announcementsSentError: false })
}
export const clearAnnouncementReceiver = (state, action) => {
    return state.merge({ searchAnnouncementReceiverFetching: true, searchAnnouncementReceiverErrorMessage: '', searchAnnouncementReceiverError: false, searchAnnouncementReceiverData: [] })
}

/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_ANNOUNCEMENT_DETAIL]: setAnnouncementDetail,
    [Types.SET_ALL_ANNOUNCEMENT]: setAllAnnouncement,
    [Types.SET_INBOX_ANNOUNCEMENT]: setInboxAnnouncement,
    [Types.SET_DELETED_ANNOUNCEMENT]: setDeletedAnnouncement,
    [Types.SET_SENT_ANNOUNCEMENT]: setSentAnnouncement,
    [Types.CLEAR_ANNOUNCEMENT_RECEIVER]: clearAnnouncementReceiver,

    [Types.GET_ANNOUNCEMENT_REQUEST]: getAnnouncementRequest,
    [Types.GET_ANNOUNCEMENT_SUCCESS]: getAnnouncementSuccess,
    [Types.GET_ANNOUNCEMENT_FAILURE]: getAnnouncementFailure,

    [Types.GET_ANNOUNCEMENT_INBOX_REQUEST]: getAnnouncementInboxRequest,
    [Types.GET_ANNOUNCEMENT_INBOX_SUCCESS]: getAnnouncementInboxSuccess,
    [Types.GET_ANNOUNCEMENT_INBOX_FAILURE]: getAnnouncementInboxFailure,

    [Types.GET_ANNOUNCEMENT_DELETED_REQUEST]: getAnnouncementDeletedRequest,
    [Types.GET_ANNOUNCEMENT_DELETED_SUCCESS]: getAnnouncementDeletedSuccess,
    [Types.GET_ANNOUNCEMENT_DELETED_FAILURE]: getAnnouncementDeletedFailure,

    [Types.GET_ANNOUNCEMENT_SENT_REQUEST]: getAnnouncementSentRequest,
    [Types.GET_ANNOUNCEMENT_SENT_SUCCESS]: getAnnouncementSentSuccess,
    [Types.GET_ANNOUNCEMENT_SENT_FAILURE]: getAnnouncementSentFailure,

    [Types.GET_ANNOUNCEMENT_DETAIL_REQUEST]: getAnnouncementDetailRequest,
    [Types.GET_ANNOUNCEMENT_DETAIL_SUCCESS]: getAnnouncementDetailSuccess,
    [Types.GET_ANNOUNCEMENT_DETAIL_FAILURE]: getAnnouncementDetailFailure,

    [Types.DOWNLOAD_ANNOUNCEMENT_ATTACHMENT_REQUEST]: downloadAnnouncementAttachmentRequest,
    [Types.DOWNLOAD_ANNOUNCEMENT_ATTACHMENT_SUCCESS]: downloadAnnouncementAttachmentSuccess,
    [Types.DOWNLOAD_ANNOUNCEMENT_ATTACHMENT_FAILURE]: downloadAnnouncementAttachmentFailure,
    [Types.SET_DOWNLOADING_PERCENT]: setDownloadingPercent,

    [Types.SEARCH_ANNOUNCEMENT_RECEIVER_REQUEST]: searchAnnouncementReceiverRequest,
    [Types.SEARCH_ANNOUNCEMENT_RECEIVER_SUCCESS]: searchAnnouncementReceiverSuccess,
    [Types.SEARCH_ANNOUNCEMENT_RECEIVER_FAILURE]: searchAnnouncementReceiverFailure,

    [Types.ADD_ANNOUNCEMENT_REQUEST]: addAnnouncementRequest,
    [Types.ADD_ANNOUNCEMENT_SUCCESS]: addAnnouncementSuccess,
    [Types.ADD_ANNOUNCEMENT_FAILURE]: addAnnouncementFailure,

    [Types.ANNOUNCEMENT_CHANGE_STATE_REQUEST]: announcementChangeStateRequest,
    [Types.ANNOUNCEMENT_CHANGE_STATE_SUCCESS]: announcementChangeStateSuccess,
    [Types.ANNOUNCEMENT_CHANGE_STATE_FAILURE]: announcementChangeStateFailure,

})
