import { call, put } from 'redux-saga/effects';
import MessagesTypes from '../redux/MessagesRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';
import Constants from '../services/Constants';
import LoaderTypes from '../redux/LoaderRedux';

export function* getMessagesGroup(api, action) {
    console.log("getMessagesGroup remote: ", action.body.remote);
    if (action.body.remote) {
        try {
            if (action.body.loader) {
                yield put(LoaderTypes.setMainLoader(true))
            }
            const response = yield call(api.getMessagesGroup, action.body);
            yield put(LoaderTypes.setMainLoader(false))
            if (response.hasOwnProperty('error')) {
                yield put(MessagesTypes.getMessagesGroupsFailure(response))
            } else {
                yield put(MessagesTypes.getMessagesGroupsSuccess(response))

                //save data for offline mode
                const localMessageGroup = yield AsyncStorage.getItem(LocalStorageConstants.MessageGroups);
                if (localMessageGroup !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.MessageGroups, JSON.stringify(response))
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('messageId', JSON.parse(localMessageGroup), response);
                        AsyncStorage.setItem(LocalStorageConstants.MessageGroups, JSON.stringify(finalResponse));
                    }
                } else {
                    AsyncStorage.setItem(LocalStorageConstants.MessageGroups, JSON.stringify(response))
                }
            }
        } catch (error) {
            console.log("getMessagesGroup remote error: ", error);
            yield put(MessagesTypes.getMessagesGroupsFailure(error))
            yield put(LoaderTypes.setMainLoader(false))
        }
    } else {
        try {
            var localMessageData = yield AsyncStorage.getItem(LocalStorageConstants.MessageGroups);
            if (localMessageData === null) {
                localMessageData = [];
                yield put(MessagesTypes.getMessagesGroupsSuccess(localMessageData))
            } else {
                var localPaginatedMessageData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localMessageData).length)
                        localPaginatedMessageData.push(JSON.parse(localMessageData)[i])
                }
                yield put(MessagesTypes.getMessagesGroupsSuccess(localPaginatedMessageData))
            }
        } catch (error) {
            console.log("getMessagesGroup local error: ", error);
            yield put(MessagesTypes.getMessagesGroupsFailure(error))
        }
    }
}

export function* getMessageDetail(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getMessageDetail, action.body);
            if (response.hasOwnProperty('error')) {
                yield put(MessagesTypes.getMessageDetailFailure(response))
            } else {
                yield put(MessagesTypes.getMessageDetailSuccess(response))

                //save local db
                const localMessageDetail = yield AsyncStorage.getItem(LocalStorageConstants.MessageDetail + action.body.messageId);
                if (localMessageDetail !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.MessageDetail + action.body.messageId, JSON.stringify(response))
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('messageId', JSON.parse(localMessageDetail), response);
                        AsyncStorage.setItem(LocalStorageConstants.MessageDetail + action.body.messageId, JSON.stringify(finalResponse));
                    }
                } else {
                    AsyncStorage.setItem(LocalStorageConstants.MessageDetail + action.body.messageId, JSON.stringify(response))
                }
            }
        } catch (error) {
            yield put(MessagesTypes.getMessageDetailFailure(error))
        }
    } else {
        try {
            var localMessageData = yield AsyncStorage.getItem(LocalStorageConstants.MessageDetail + action.body.messageId);
            if (localMessageData === null) {
                localMessageData = [];
                yield put(MessagesTypes.getMessageDetailSuccess(localMessageData))
            } else {
                var localPaginatedMessageData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localMessageData).length)
                        localPaginatedMessageData.push(JSON.parse(localMessageData)[i])
                }
                yield put(MessagesTypes.getMessageDetailSuccess(localPaginatedMessageData))
            }
        } catch (error) {
            console.log("getMessageDetail local error: ", error);
            yield put(MessagesTypes.getMessageDetailFailure(error))
        }
    }

}

export function* sendMessage(api, action) {
    try {
        const response = yield call(api.sendMessage, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.sendMessageFailure(response))
        } else {
            yield put(MessagesTypes.sendMessageSuccess(response))
        }
    } catch (error) {
        yield put(MessagesTypes.sendMessageFailure(response))
    }
}


export function* deleteMessage(api, action) {
    try {
        const response = yield call(api.deleteMessage, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.deleteMessageFailure(response))
        } else {
            yield put(MessagesTypes.deleteMessageSuccess(response))
        }
    } catch (error) {
        yield put(MessagesTypes.deleteMessageFailure(response))

    }
}


export function* getMyClassMates(api, action) {
    try {
        const response = yield call(api.getMyClassMates, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.getMyClassMatesFailure(response))
        } else {
            yield put(MessagesTypes.getMyClassMatesSuccess(response))
        }
    } catch (error) {
        yield put(MessagesTypes.getMyClassMatesFailure(response))
    }
}

export function* search(api, action) {
    try {
        const response = yield call(api.search, action.body);
        console.log("search sagas respon: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.searchFailure(response))
        } else {
            yield put(MessagesTypes.searchSuccess(response))
        }
    } catch (error) {
        console.log("errpr: ", error);
        yield put(MessagesTypes.searchFailure(error))

    }
}

export function* getMessagesPersonel(api, action) {
    try {
        if (action.body.loader) {
            yield put(LoaderTypes.setMainLoader(true))
        }
        const response = yield call(api.getMessagesGroup, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.getMessagesPersonelFailure(response))
        } else {
            yield put(MessagesTypes.getMessagesPersonelSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(MessagesTypes.getMessagesPersonelFailure(error))
    }
}

export function* getPersons(api, action) {
    try {
        if (action.body.loader) {
            yield put(LoaderTypes.setMainLoader(true))
        }
        const response = yield call(api.getPersons, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.getPersonsFailure(response))
        } else {
            yield put(MessagesTypes.getPersonsSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(MessagesTypes.getPersonsFailure(error))
    }
}

export function* getGroups(api, action) {
    try {
        if (action.body.loader) {
            yield put(LoaderTypes.setMainLoader(true))
        }
        const response = yield call(api.getGroups, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.getGroupsFailure(response))
        } else {
            yield put(MessagesTypes.getGroupsSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(MessagesTypes.getGroupsFailure(error))
    }
}

export function* getMessageOrigin(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.getMessageOrigin, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            yield put(MessagesTypes.getMessageOriginFailure(response))
        } else {
            yield put(MessagesTypes.getMessageOriginSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(MessagesTypes.getMessageOriginFailure(error))
    }
}