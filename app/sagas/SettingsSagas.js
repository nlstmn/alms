import { call, put } from 'redux-saga/effects';
import SettingsTypes from '../redux/SettingsRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';


export function* getFileSettings(api, action) {
    try {
        const response = yield call(api.getFileSettings, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(SettingsTypes.getFileSettingsFailure(response));
        }else{
            yield put(SettingsTypes.getFileSettingsSuccess(response));
        }
    } catch (error) {
        yield put(SettingsTypes.getFileSettingsFailure(error));
    }
} 