import { call, put } from 'redux-saga/effects';
import OrganizationActions from '../redux/OrganizationRedux';
import MainActions from '../redux/MainRedux';
import { strings } from '../locales/i18n';

export function* getOrganizations(api, action) {
    try {
        yield put(MainActions.setLoaderVisibility(true))
        const response = yield call(api.getOrganizations)
        yield put(MainActions.setLoaderVisibility(false))
        if (response.success) {
            yield put(OrganizationActions.getOrganizationSuccess(response.data))
        } else {
            yield put(OrganizationActions.getOrganizationFailure(strings('r_default_error_message')))
        }

    } catch (error) {
        yield put(MainActions.setLoaderVisibility(false))
        yield put(OrganizationActions.getOrganizationFailure(strings('r_connection_error') + " " + error.message))
    }
}