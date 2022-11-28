import { call, put } from 'redux-saga/effects';
import AddActivityTypes from '../redux/AddActivityRedux';
import LoaderTypes from '../redux/LoaderRedux';


export function* getTagsUnit(api, action) {
    try {
        const response = yield call(api.getTags, action.body);
        console.log("getTagsUnit response: ", response);
        if (response.hasOwnProperty("error")) {
            yield put(AddActivityTypes.getTagsUnitFailure(response))
        } else {
            yield put(AddActivityTypes.getTagsUnitSuccess(response))
        }
    } catch (error) {
        yield put(AddActivityTypes.getTagsUnitFailure(error))
    }
}

export function* getTagsCredits(api, action) {
    try {
        const response = yield call(api.getTags, action.body);
        console.log("getTagsCredits response: ", response);
        if (response.hasOwnProperty("error")) {
            yield put(AddActivityTypes.getTagsCreditsFailure(response))
        } else {
            yield put(AddActivityTypes.getTagsCreditsSuccess(response))
        }
    } catch (error) {
        yield put(AddActivityTypes.getTagsCreditsFailure(error))

    }
}

export function* getConditionalActivities(api, action) {
    try {
        const response = yield call(api.conditionalactivities, action.body);
        if (response.hasOwnProperty("error")) {
            yield put(AddActivityTypes.conditionalActivitiesFailure(response))
        } else {
            yield put(AddActivityTypes.conditionalActivitiesSuccess(response))
        }
    } catch (error) {
        yield put(AddActivityTypes.conditionalActivitiesFailure(response))
    }
}

export function* getClassInformation(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.getClassInformation, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            yield put(AddActivityTypes.getClassInformationFailure(response))
        } else {
            yield put(AddActivityTypes.getClassInformationSuccess(response))
        }
    } catch (error) {
        yield put(AddActivityTypes.getClassInformationFailure(error))
    }
}

export function* uploadFile(api, action) {
    try {
        const response = yield call(api.uploadFile, action.body);
        console.log("upload file sagas response: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(AddActivityTypes.uploadFileFailure(response))
        } else {
            yield put(AddActivityTypes.uploadFileSuccess(response))
        }
    } catch (error) {
        yield put(AddActivityTypes.uploadFileFailure(error))
    }
}

export function* addActivityType(api,action){
    try{
        const response = yield call(api.addActivityType, action.body);
        console.log("addActivityType sagas response: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(AddActivityTypes.addActivityTypeFailure(response))
        } else {
            yield put(AddActivityTypes.addActivityTypeSuccess(response))
        }
    }catch(error){
        yield put(AddActivityTypes.addActivityTypeFailure(error))

    }
}