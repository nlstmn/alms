import { call, put } from 'redux-saga/effects';
import LoginTypes from '../redux/LoginRedux';
import LoaderTypes from '../redux/LoaderRedux';
import { strings } from '../locales/i18n';

export function* getAccessToken(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.getRequestToken, action.userName, action.password, action.organization)
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('access_token')) {
            yield put(LoginTypes.getAccessTokenSuccess(response));
        } else {
            yield put(LoginTypes.getAccessTokenFailure(strings('r_login_error_message')))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(LoginTypes.getAccessTokenFailure(error.message))
    }
}

export function* refreshToken(api, action) {
    try {
        const response = yield call(api.refreshToken, action.body)
        console.log("refresh token saga: ", response);
        if (response.hasOwnProperty('access_token')) {
            yield put(LoginTypes.refreshTokenSuccess(response));
        } else {
            yield put(LoginTypes.refreshTokenFailure(strings('r_login_error_message')))
        }
    } catch (error) {
        console.log("refresh token saga error: ", error);
        yield put(LoginTypes.getAccessTokenFailure(error.message))
    }
}

export function* getUserIdentity(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.getUserIdentity, action.token, action.organization)
        yield put(LoaderTypes.setMainLoader(false))
        yield put(LoginTypes.getUserIdentitySuccess(response))
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(LoginTypes.getUserIdentityFailure(error))
    }
}