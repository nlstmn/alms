import { call, put } from 'redux-saga/effects';
import MainTypes from '../redux/MainRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';


export function* getLanguageResources(api, action) {
    if (action.data.remote) {
        try {
            const response = yield call(api.getLanguageResources, action.data);
            if (response.hasOwnProperty('error')) {
                yield put(MainTypes.getLanguageResourceFailure(response));
            } else {
                yield put(MainTypes.getLanguageResourceSuccess(response));
                AsyncStorage.setItem(LocalStorageConstants.LanguageResources, JSON.stringify(response));
            }
        } catch (error) {
            console.log("getLanguageResources sagas error ", error);
            yield put(MainTypes.getLanguageResourceFailure(error));
        }
    }
    else {
        try {
            var localLanguageResource = yield AsyncStorage.getItem(LocalStorageConstants.LanguageResources);
            console.log("Local Language resources:", JSON.parse(localLanguageResource));
            if (localLanguageResource === null) {
                localLanguageResource = [];
            }
            yield put(MainTypes.getLanguageResourceSuccess(JSON.parse(localLanguageResource)));

        } catch (error) {
            yield put(MainTypes.getLanguageResourceFailure(error));
        }

    }
}