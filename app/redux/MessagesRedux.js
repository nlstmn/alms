import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    clearMessageDetail: ['body'],
    clearSearch: ['body'],
    clearMessageGroups: ['body'],
    clearClassMates: [],
    newMessageStatus: ['value'],

    getMessagesGroupsRequest: ['body'],
    getMessagesGroupsSuccess: ['data'],
    getMessagesGroupsFailure: ['error'],

    getMessagesPersonelRequest: ['body'],
    getMessagesPersonelSuccess: ['data'],
    getMessagesPersonelFailure: ['error'],

    sendMessageRequest: ['body'],
    sendMessageSuccess: ['data'],
    sendMessageFailure: ['error'],

    getMessageDetailRequest: ['body'],
    getMessageDetailSuccess: ['data'],
    getMessageDetailFailure: ['error'],

    deleteMessageRequest: ['body'],
    deleteMessageSuccess: ['data'],
    deleteMessageFailure: ['error'],

    getMyClassMatesRequest: ['body'],
    getMyClassMatesSuccess: ['data'],
    getMyClassMatesFailure: ['error'],

    getPersonsRequest: ['body'],
    getPersonsSuccess: ['data'],
    getPersonsFailure: ['error'],

    getGroupsRequest: ['body'],
    getGroupsSuccess: ['data'],
    getGroupsFailure: ['error'],

    searchRequest: ['body'],
    searchSuccess: ['data'],
    searchFailure: ['error'],

    getMessageOriginRequest: ['body'],
    getMessageOriginSuccess: ['data'],
    getMessageOriginFailure: ['error'],


})
export const MessagesType = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    messagesGroups: [],
    messagesOnlyGroups: [],
    messagesGroupsFetching: true,
    messagesGroupsErrorMessage: '',
    messagesGroupsError: false,
    messagesGroupType: null,

    messagesPersonel: [],
    messagesOnlyPersonel: [],
    messagesPersonelErrorMessage: '',
    messagesPersonelError: false,
    messagesPersonelType: null,

    sendMessageData: null,
    sendMessageSending: false,
    sendMessageErrorMessage: '',
    sendMessageError: false,

    getMessageDetailData: null,
    getMessageDetailFetching: false,
    getMessageDetailErrorMessage: '',
    getMessageDetailError: false,

    deleteMessageResult: null,
    deleteMessageTrying: false,
    deleteMessageErrorMessage: '',
    deleteMessageError: false,

    myClassMatesData: [],
    myClassMatesFetching: false,
    myClassMatesErrorMessage: '',
    myClassMatesError: false,

    personsData: [],
    personsErrorMessage: '',
    personsError: false,

    groupsData: [],
    groupsErrorMessage: '',
    groupsError: false,

    messageOrigin: null,
    messageOriginPerson: null,
    messageOriginErrorMessage: '',
    messageOriginPersonErrorMessage: '',
    messageOriginError: false,
    messageRecipientType: null,

    searchData: [],
    searchProcessing: false,
    searchErrorMessage: '',
    searchError: false,

    isNewMessage: false,
})

/* ------------- Reducers ------------- */
export const getMessagesGroupsRequest = (state, action) => {
    console.log("getMessagesGroupsRequest: ", action.body);
    return state.merge({ messagesGroupsFetching: true, messagesGroupsErrorMessage: '', messagesGroupsError: false, messagesGroupType: action.body.type })
}

export const getMessagesGroupsSuccess = (state, action) => {
    console.log("getMessagesGroupsSuccess : ", action.data);
    if (state.messagesGroupType === 1) {
        return state.merge({ messagesGroupsFetching: false, messagesGroupsErrorMessage: '', messagesGroupsError: false, messagesGroups: action.data.conversations })
    } else {
        return state.merge({ messagesGroupsFetching: false, messagesGroupsErrorMessage: '', messagesGroupsError: false, messagesOnlyGroups: action.data.conversations })
    }
}

export const getMessagesGroupsFailure = (state, action) => {
    console.log("getMessagesGroupsFailure : ", action.error);
    return state.merge({ messagesGroupsFetching: false, messagesGroupsErrorMessage: action.error, messagesGroupsError: true })
}

export const getMessagesPersonelRequest = (state, action) => {
    console.log("getMessagesPersonelRequest: ", action.body);
    return state.merge({ messagesPersonelErrorMessage: '', messagesPersonelError: false, messagesPersonelType: action.body.type })
}

export const getMessagesPersonelSuccess = (state, action) => {
    console.log("getMessagesPersonelSuccess : ", action.data);
    if (state.messagesPersonelType === 1) {
        return state.merge({ messagesPersonel: action.data.conversations, messagesPersonelErrorMessage: '', messagesPersonelError: false, })
    } else {
        return state.merge({ messagesOnlyPersonel: action.data.conversations, messagesPersonelErrorMessage: '', messagesPersonelError: false, })
    }

}

export const getMessagesPersonelFailure = (state, action) => {
    console.log("getMessagesPersonelFailure : ", action.error);
    return state.merge({ messagesPersonelErrorMessage: action.error, messagesPersonelError: true })
}

/* --- */
export const sendMessageRequest = (state, action) => {
    console.log("sendMessageRequest: ", action.body)
    return state.merge({ sendMessageSending: true, sendMessageErrorMessage: '', sendMessageError: false })
}

export const sendMessageSuccess = (state, action) => {
    console.log("sendMessageSuccess: ", action.data);
    return state.merge({ sendMessageSending: false, sendMessageErrorMessage: '', sendMessageError: false, sendMessageData: action.data })
}

export const sendMessageFailure = (state, action) => {
    console.log("sendMessageFailure : ", action.error);
    return state.merge({ sendMessageSending: false, sendMessageErrorMessage: action.error, sendMessageError: true })
}

/* --- */
export const getMessageDetailRequest = (state, action) => {
    console.log("getMessageDetailRequest : ", action.body)
    return state.merge({ getMessageDetailFetching: true, getMessageDetailErrorMessage: '', getMessageDetailError: false })
}

export const getMessageDetailSuccess = (state, action) => {
    console.log("getMessageDetailSuccess: ", action.data.messages);
    return state.merge({ getMessageDetailData: action.data.messages, getMessageDetailFetching: false, getMessageDetailErrorMessage: '', getMessageDetailError: false })
}

export const getMessageDetailFailure = (state, action) => {
    console.log("getMessageDetailFailure: ", action.error);
    return state.merge({ getMessageDetailFetching: false, getMessageDetailErrorMessage: action.error, getMessageDetailError: true })
}

/* --- */
export const deleteMessageRequest = (state, action) => {
    return state.merge({ deleteMessageTrying: true, deleteMessageErrorMessage: '', deleteMessageError: false })
}

export const deleteMessageSuccess = (state, action) => {
    return state.merge({ deleteMessageTrying: false, deleteMessageErrorMessage: '', deleteMessageError: false, deleteMessageResult: action.data })
}

export const deleteMessageFailure = (state, action) => {
    return state.merge({ deleteMessageTrying: false, deleteMessageErrorMessage: action.error, deleteMessageError: true })
}

/* --- */
export const getMyClassMatesRequest = (state, action) => {
    console.log("getMyClassMatesRequest  :", action.body);
    return state.merge({ myClassMatesFetching: true, myClassMatesErrorMessage: '', myClassMatesError: false })
}

export const getMyClassMatesSuccess = (state, action) => {
    console.log("getMyClassMatesSuccess  :", action.data);
    return state.merge({ myClassMatesFetching: false, myClassMatesErrorMessage: '', myClassMatesError: false, myClassMatesData: [...state.myClassMatesData, ...action.data] })
}

export const getMyClassMatesFailure = (state, action) => {
    console.log("getMyClassMatesFailure  :", action.error);
    return state.merge({ myClassMatesFetching: false, myClassMatesErrorMessage: action.data, myClassMatesError: true })
}

/* --- */
export const getPersonsRequest = (state, action) => {
    console.log("getPersonsRequest  :", action.body);
    return state.merge({ personsErrorMessage: '', personsError: false })
}

export const getPersonsSuccess = (state, action) => {
    console.log("getPersonsSuccess  :", action.data);
    return state.merge({ personsData: action.data.contacts, personsErrorMessage: '', personsError: false })
}

export const getPersonsFailure = (state, action) => {
    console.log("getPersonsFailure  :", action.error);
    return state.merge({ personsErrorMessage: action.error, personsError: true })
}


/* --- */
export const getGroupsRequest = (state, action) => {
    console.log("getGroupsRequest  :", action.body);
    return state.merge({ groupsErrorMessage: '', groupsError: false })
}

export const getGroupsSuccess = (state, action) => {
    console.log("getGroupsSuccess  :", action.data);
    return state.merge({ groupsData: action.data.groups, groupsErrorMessage: '', groupsError: false })
}

export const getGroupsFailure = (state, action) => {
    console.log("getGroupsFailure  :", action.error);
    return state.merge({ groupsErrorMessage: action.error, groupsError: true })
}

/* --- */
export const getMessageOriginRequest = (state, action) => {
    console.log("getMessageOriginRequest  :", action.body);
    return state.merge({ messageOriginErrorMessage: '', messageOriginPersonErrorMessage: '', messageOriginError: false, messageRecipientType: action.body.recipientType })
}

export const getMessageOriginSuccess = (state, action) => {
    console.log("getMessageOriginSuccess  :", action.data);
    if (state.messageRecipientType === "Class") {
        return state.merge({ messageOrigin: { originMessageId: action.data }, messageOriginErrorMessage: '', messageOriginError: false })
    } else if (state.messageRecipientType === "User") {
        return state.merge({ messageOriginPerson: { originMessageId: action.data }, messageOriginPersonErrorMessage: '', messageOriginError: false })
    } else {
        return state.merge({})
    }

}

export const getMessageOriginFailure = (state, action) => {
    console.log("getMessageOriginFailure  :", action.error);
    if (state.messageRecipientType === "Class") {
        return state.merge({ messageOriginErrorMessage: action.error, messageOriginError: true })
    }else if (state.messageRecipientType === "User") {
        return state.merge({ messageOriginPersonErrorMessage: action.error, messageOriginError: true })
    } else {
        return state.merge({})
    }

}

/* --------------- */

export const searchRequest = (state, action) => {
    return state.merge({ searchProcessing: true, searchErrorMessage: '', searchError: false })
}
export const searchSuccess = (state, action) => {
    return state.merge({ searchData: action.data, searchProcessing: false, searchErrorMessage: '', searchError: false })
}
export const searchFailure = (state, action) => {
    return state.merge({ searchProcessing: false, searchErrorMessage: action.error, searchError: true })
}


export const clearMessageDetail = (state, action) => {
    return state.merge({ getMessageDetailData: null, getMessageDetailFetching: false, getMessageDetailErrorMessage: '', getMessageDetailError: false })
}

export const clearSearch = (state, action) => {
    return state.merge({ searchData: [], searchProcessing: false, searchErrorMessage: '', searchError: false })
}

export const clearMessageGroups = (state, action) => {
    return state.merge({ messagesGroups: [], messagesGroupsFetching: false, messagesGroupsErrorMessage: '', messagesGroupsError: false })
}

export const clearClassMates = (state, action) => {
    return state.merge({ myClassMatesData: [], myClassMatesFetching: false, myClassMatesErrorMessage: '', myClassMatesError: false })
}
export const newMessageStatus = (state, action) => {
    console.log("newMessageStatus: ", action.value)
    return state.merge({ isNewMessage: action.value })
}

/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_MESSAGES_GROUPS_REQUEST]: getMessagesGroupsRequest,
    [Types.GET_MESSAGES_GROUPS_SUCCESS]: getMessagesGroupsSuccess,
    [Types.GET_MESSAGES_GROUPS_FAILURE]: getMessagesGroupsFailure,

    [Types.GET_MESSAGES_PERSONEL_REQUEST]: getMessagesPersonelRequest,
    [Types.GET_MESSAGES_PERSONEL_SUCCESS]: getMessagesPersonelSuccess,
    [Types.GET_MESSAGES_PERSONEL_FAILURE]: getMessagesPersonelFailure,

    [Types.SEND_MESSAGE_REQUEST]: sendMessageRequest,
    [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
    [Types.SEND_MESSAGE_FAILURE]: sendMessageFailure,

    [Types.GET_MESSAGE_DETAIL_REQUEST]: getMessageDetailRequest,
    [Types.GET_MESSAGE_DETAIL_SUCCESS]: getMessageDetailSuccess,
    [Types.GET_MESSAGE_DETAIL_FAILURE]: getMessageDetailFailure,

    [Types.DELETE_MESSAGE_REQUEST]: deleteMessageRequest,
    [Types.DELETE_MESSAGE_SUCCESS]: deleteMessageSuccess,
    [Types.DELETE_MESSAGE_FAILURE]: deleteMessageFailure,

    [Types.GET_MY_CLASS_MATES_REQUEST]: getMyClassMatesRequest,
    [Types.GET_MY_CLASS_MATES_SUCCESS]: getMyClassMatesSuccess,
    [Types.GET_MY_CLASS_MATES_FAILURE]: getMyClassMatesFailure,

    [Types.GET_PERSONS_REQUEST]: getPersonsRequest,
    [Types.GET_PERSONS_SUCCESS]: getPersonsSuccess,
    [Types.GET_PERSONS_FAILURE]: getPersonsFailure,

    [Types.GET_GROUPS_REQUEST]: getGroupsRequest,
    [Types.GET_GROUPS_SUCCESS]: getGroupsSuccess,
    [Types.GET_GROUPS_FAILURE]: getGroupsFailure,

    [Types.GET_MESSAGE_ORIGIN_REQUEST]: getMessageOriginRequest,
    [Types.GET_MESSAGE_ORIGIN_SUCCESS]: getMessageOriginSuccess,
    [Types.GET_MESSAGE_ORIGIN_FAILURE]: getMessageOriginFailure,

    [Types.SEARCH_REQUEST]: searchRequest,
    [Types.SEARCH_SUCCESS]: searchSuccess,
    [Types.SEARCH_FAILURE]: searchFailure,

    [Types.CLEAR_MESSAGE_DETAIL]: clearMessageDetail,
    [Types.CLEAR_SEARCH]: clearSearch,
    [Types.CLEAR_MESSAGE_GROUPS]: clearMessageGroups,
    [Types.CLEAR_CLASS_MATES]: clearClassMates,
    [Types.NEW_MESSAGE_STATUS]: newMessageStatus
})