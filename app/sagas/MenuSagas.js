import { call, put } from 'redux-saga/effects';
import MenuTypes from '../redux/MenuRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';


export function* getMenu(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getMenu, action.body);
            if (response.hasOwnProperty('error')) {
                yield put(MenuTypes.getMenuFailure(response));
            } else {
                yield put(MenuTypes.getMenuSuccess(response));
                AsyncStorage.setItem(LocalStorageConstants.MenuResources, JSON.stringify(response));
            }
        } catch (error) {
            yield put(MenuTypes.getMenuFailure(error));
        }
    } else {
        try {
            var localMenuResponse = yield AsyncStorage.getItem(LocalStorageConstants.MenuResources);
            if (localMenuResponse == null) {
                localMenuResponse = [];
            }
            yield put(MenuTypes.getMenuSuccess(JSON.parse(localMenuResponse)));
        } catch (error) {
            yield put(MenuTypes.getMenuFailure(error));
        }
    }

}