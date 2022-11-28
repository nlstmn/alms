import { call, put } from 'redux-saga/effects';
import AnnouncementTypes from '../redux/AnnouncementRedux';

import LocalStorageConstants from '../local/LocalStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from '../services/Constants';
import LoaderTypes from '../redux/LoaderRedux';


export function* getListAnnouncement(api, action) {
    if (action.body.remote) {
        try {
            if(action.body.loader){
                yield put(LoaderTypes.setMainLoader(true))
            }
            const response = yield call(api.getAnnouncementsCall, action.body);
            yield put(LoaderTypes.setMainLoader(false))
            console.log("getListAnnouncement :", response);
            if (response.hasOwnProperty("error")) {
                yield put(AnnouncementTypes.getAnnouncementFailure('Error occured, ', response.error))
            } else {
                yield put(AnnouncementTypes.getAnnouncementSuccess(response))
                //save data for offline mode
                const localAnnouncementDatas = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncemetAllList)
                if (localAnnouncementDatas !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncemetAllList, JSON.stringify(response));

                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('announcementId', JSON.parse(localAnnouncementDatas), response);
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncemetAllList, JSON.stringify(finalResponse))

                    }

                } else {
                    AsyncStorage.setItem(LocalStorageConstants.AnnouncemetAllList, JSON.stringify(response));
                }
            }
        } catch (error) {
            yield put(LoaderTypes.setMainLoader(false))
            yield put(AnnouncementTypes.getAnnouncementFailure('Error occured, ', error))
        }
    }
    else {
        try {
            var localAnnouncementData = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncemetAllList);
            if (localAnnouncementData === null) {
                localAnnouncementData = [];
                yield put(AnnouncementTypes.getAnnouncementSuccess(localAnnouncementData));
            } else {
                var localPaginatedAnnouncementData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localAnnouncementData).length)
                        localPaginatedAnnouncementData.push(JSON.parse(localAnnouncementData)[i])
                }
                yield put(AnnouncementTypes.getAnnouncementSuccess(localPaginatedAnnouncementData));
            }

        } catch (error) {
            console.log("getListAnnouncement error: ", error);
            yield put(AnnouncementTypes.getAnnouncementFailure(error));
        }
    }
}


export function* getInBoxListAnnouncement(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getAnnouncementsCall, action.body);
            console.log("api ann rsponse: ", response);
            if (response.hasOwnProperty("error")) {
                yield put(AnnouncementTypes.getAnnouncementInboxFailure('Error occured, ', response.error))
            } else {
                yield put(AnnouncementTypes.getAnnouncementInboxSuccess(response));

                //save data for offline mode
                const localInboxAnnouncement = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementInboxList);
                if (localInboxAnnouncement !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncementInboxList, JSON.stringify(response));
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('announcementId', JSON.parse(localInboxAnnouncement), response);
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncementInboxList, JSON.stringify(finalResponse))
                    }

                } else {
                    AsyncStorage.setItem(LocalStorageConstants.AnnouncementInboxList, JSON.stringify(response));
                }
            }
        } catch (error) {
            console.log("getInBoxListAnnouncement error: ", error);
            yield put(AnnouncementTypes.getAnnouncementInboxFailure('Error occured, ', error))
        }
    } else {
        try {
            var localAnnouncementData = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementInboxList);
            if (localAnnouncementData == null) {
                localAnnouncementData = [];
                yield put(AnnouncementTypes.getAnnouncementInboxSuccess(localAnnouncementData));
            } else {
                var localPaginatedInboxAnnouncementData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localAnnouncementData).length)
                        localPaginatedInboxAnnouncementData.push(JSON.parse(localAnnouncementData)[i])
                }
                yield put(AnnouncementTypes.getAnnouncementInboxSuccess(localPaginatedInboxAnnouncementData));
            }

        } catch (error) {
            console.log("getInBoxListAnnouncement error: ", error);
            yield put(AnnouncementTypes.getAnnouncementInboxFailure(error));
        }
    }
}

export function* getDeletedListAnnouncement(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getAnnouncementsCall, action.body);
            if (response.hasOwnProperty("error")) {
                yield put(AnnouncementTypes.getAnnouncementDeletedFailure('Error occured, ', response.error))
            } else {
                yield put(AnnouncementTypes.getAnnouncementDeletedSuccess(response));
                //save data for offline mode
                var localDeletedAnnouncementDatas = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementDeletedList);
                if (localDeletedAnnouncementDatas !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncementDeletedList, JSON.stringify(response));
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('announcementId', JSON.parse(localDeletedAnnouncementDatas), response);
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncementDeletedList, JSON.stringify(finalResponse))
                    }

                } else {
                    AsyncStorage.setItem(LocalStorageConstants.AnnouncementDeletedList, JSON.stringify(response));
                }
            }
        } catch (error) {
            console.log("getDeletedListAnnouncement errır: ", error);
            yield put(AnnouncementTypes.getAnnouncementDeletedFailure('Error occured, ', error))
        }
    } else {
        try {
            var localAnnouncementData = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementDeletedList);
            if (localAnnouncementData == null) {
                localAnnouncementData = [];
                yield put(AnnouncementTypes.getAnnouncementDeletedSuccess(localAnnouncementData));
            } else {

                var localPaginatedAnnouncementData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localAnnouncementData).length)
                        localPaginatedAnnouncementData.push(JSON.parse(localAnnouncementData)[i])
                }
                yield put(AnnouncementTypes.getAnnouncementDeletedSuccess(localPaginatedAnnouncementData));
            }

        } catch (error) {
            console.log("getDeletedListAnnouncement error: ", error);
            yield put(AnnouncementTypes.getAnnouncementDeletedFailure(error));
        }
    }

}
/* ------------------- */
export function* getSentAnnouncement(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getAnnouncementsCall, action.body);
            console.log("getSentAnnouncement:  ", response);
            if (response.hasOwnProperty("error")) {
                yield put(AnnouncementTypes.getAnnouncementSentFailure(response))
            } else {
                yield put(AnnouncementTypes.getAnnouncementSentSuccess(response));

                //save data for offline mode
                const localSentAnnouncement = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementSentList);
                if (localSentAnnouncement !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncementSentList, JSON.stringify(response));
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('announcementId', JSON.parse(localSentAnnouncement), response);
                        AsyncStorage.setItem(LocalStorageConstants.AnnouncementSentList, JSON.stringify(finalResponse))
                    }

                } else {
                    AsyncStorage.setItem(LocalStorageConstants.AnnouncementSentList, JSON.stringify(response));
                }
            }
        } catch (error) {
            console.log("getInBoxListAnnouncement error: ", error);
            yield put(AnnouncementTypes.getAnnouncementSentFailure('Error occured, ', error))
        }
    } else {
        try {
            var localAnnouncementData = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementSentList);
            if (localAnnouncementData == null) {
                localAnnouncementData = [];
                yield put(AnnouncementTypes.getAnnouncementSentSuccess(localAnnouncementData));
            } else {
                var localPaginatedSentAnnouncementData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localAnnouncementData).length)
                        localPaginatedSentAnnouncementData.push(JSON.parse(localAnnouncementData)[i])
                }
                yield put(AnnouncementTypes.getAnnouncementSentSuccess(localPaginatedSentAnnouncementData));
            }

        } catch (error) {
            console.log("getInBoxListAnnouncement error: ", error);
            yield put(AnnouncementTypes.getAnnouncementSentFailure(error));
        }
    }

}

/* ------------------- */


export function* getAnnouncementDetail(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getAnnouncementDetail, action.body);
            if (response.hasOwnProperty('error')) {
                yield put(AnnouncementTypes.getAnnouncementDetailFailure(response))
            } else {
                yield put(AnnouncementTypes.getAnnouncementDetailSuccess(response))
                //save data for offline mode
                AsyncStorage.setItem(LocalStorageConstants.AnnouncementDetail + action.body.announcementId, JSON.stringify(response));
            }
        } catch (error) {
            yield put(AnnouncementTypes.getAnnouncementDetailFailure(error))
        }
    } else {
        try {
            var localAnnoucementDetail = yield AsyncStorage.getItem(LocalStorageConstants.AnnouncementDetail + action.body.announcementId);
            if (localAnnoucementDetail == null) {

                yield put(AnnouncementTypes.getAnnouncementDetailFailure({ 'error': true, 'code': 700, 'text': 'offline_mode_fail' }))
            } else {
                yield put(AnnouncementTypes.getAnnouncementDetailSuccess(JSON.parse(localAnnoucementDetail)));
            }
        } catch (error) {
            yield put(AnnouncementTypes.getAnnouncementDetailFailure(error))
        }
    }
}

export function* downloadAnnouncementAttachment(api, action) {
    try {
        console.log("downloadAnnouncementAttachment trying");
        const response = yield call(api.downloadAnnouncementAttachment, action.body);
        console.log("downloadAnnouncementAttachment response:", response);
        if (response.hasOwnProperty('error')) {
            yield put(AnnouncementTypes.downloadAnnouncementAttachmentFailure(response))
        } else {
            yield put(AnnouncementTypes.downloadAnnouncementAttachmentSuccess(response))
        }
    } catch (error) {
        yield put(AnnouncementTypes.downloadAnnouncementAttachmentFailure(error))
    }
}

export function* newAnnouncement(api, action) {
    try {
        const response = yield call(api.newAnnouncement, action.body);
        console.log("newAnnouncement saga response: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(AnnouncementTypes.addAnnouncementFailure(response))
        } else {
            yield put(AnnouncementTypes.addAnnouncementSuccess(response))
        }
    } catch (error) {
        yield put(AnnouncementTypes.addAnnouncementFailure(error))
    }
}

export function* searchAnnouncementReceiver(api, action) {
    try {
        const response = yield call(api.searchAnnouncementReceiver, action.body);
        console.log("searchAnnouncementReceiver response: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(AnnouncementTypes.searchAnnouncementReceiverFailure(response))
        } else {
            yield put(AnnouncementTypes.searchAnnouncementReceiverSuccess(response))
        }
    } catch (error) {
        yield put(AnnouncementTypes.searchAnnouncementReceiverFailure(error))
    }
}

export function* announcementChangeState(api, action) {
    try {
        const response = yield call(api.announcementChangeState, action.body);
        console.log("announcementChangeState response: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(AnnouncementTypes.announcementChangeStateFailure(response))
        } else {
            yield put(AnnouncementTypes.announcementChangeStateSuccess(response))
        }
    } catch (error) {
        yield put(AnnouncementTypes.announcementChangeStateFailure(error))
    }
}

