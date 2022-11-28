import { call, put } from 'redux-saga/effects';
import ActivityInteractTypes from '../redux/ActivityInteractRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';
import LoaderTypes from "../redux/LoaderRedux";
import { showMessage, hideMessage } from "react-native-flash-message";
import { errorMessageData } from '../helpers/FlashMessageData';
import { strings } from '../locales/i18n';

export function* saveVideoTracking(api, action) {

    try {
        const response = yield call(api.saveVideoTracking, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(ActivityInteractTypes.saveVideoTrackingFailure(response))
        } else {
            yield put(ActivityInteractTypes.saveVideoTrackingSuccess(response))
        }
    } catch (error) {
        yield put(ActivityInteractTypes.saveVideoTrackingFailure(error))
    }
}

export function* activityViewComletionCriteria(api, action) {
    try {
        const response = yield call(api.setActivityComletionCriteria, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(ActivityInteractTypes.activityCompletionViewCriteriaFailure(response))
        } else {
            yield put(ActivityInteractTypes.activityCompletionViewCriteriaSuccess(response))
        }
    } catch (error) {
        yield put(ActivityInteractTypes.activityCompletionViewCriteriaFailure(error))
    }
}

export function* saveUnsavedVideoTrackingData(api, action) {
    try {
        var datas = yield AsyncStorage.getItem(LocalStorageConstants.UnSavedVideoTrackingData)
        var failedUpdateData = null;
        if (datas !== null) {
            var JSONdata = JSON.parse(datas)
            for (var i = 0; i < JSONdata.length; i++) {
                var response = yield call(api.saveVideoTracking, JSONdata[i]);
                console.log("saveUnsavedVideoTrackingData response: ", response)
                if (response.hasOwnProperty('error')) {
                    yield put(ActivityInteractTypes.saveUnsavedVideoTrackingDataFailure(JSONdata[i]))
                    failedUpdateData.push(JSONdata[i])
                } else {
                    yield put(ActivityInteractTypes.saveUnsavedVideoTrackingDataSuccess(JSONdata[i]))
                }
            }
            if (failedUpdateData !== null)
                yield AsyncStorage.setItem(LocalStorageConstants.UnSavedVideoTrackingData, JSON.stringify(failedUpdateData))
            else
                yield AsyncStorage.removeItem(LocalStorageConstants.UnSavedVideoTrackingData)
        }
    } catch (error) {
        console.log("saveUnsavedVideoTrackingData error: ", error);
    }

}

export function* getVideoDetail(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.getFileDetail, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            showMessage(errorMessageData({ message: strings('r_default_error_message') }))
            yield put(ActivityInteractTypes.getVideoDetailFailure(response))
        } else {
            yield put(ActivityInteractTypes.getVideoDetailSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(ActivityInteractTypes.getVideoDetailFailure(error))
    }
}

export function* connectToAlmsRequest(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.connectToAlmsRequest, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            showMessage(errorMessageData({ message: strings('r_default_error_message') }))
            yield put(ActivityInteractTypes.connectToAlmsFailure(response))
        } else {
            yield put(ActivityInteractTypes.connectToAlmsSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(ActivityInteractTypes.connectToAlmsFailure(error))
    }
}