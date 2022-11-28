import { call, put } from 'redux-saga/effects';
import ScheduleTypes from '../redux/ScheduleRedux';
import LoaderTypes from '../redux/LoaderRedux';
import LocalStorageConstants from '../local/LocalStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from '../services/Constants';


export function* getMyDailyCalender(api, action) {
    if (action.body.remote) {
        try {
            if(action.body.loader){
                yield put(LoaderTypes.setMainLoader(true));
            }
            
            const response = yield call(api.getMyDailyCalender, action.body);
            yield put(LoaderTypes.setMainLoader(false));
            if (response.hasOwnProperty('error')) {
                yield put(ScheduleTypes.getMyDailyCalenderFailure(response));
            } else {
                let newResponse = [];
                for (let i = 0; i < response.length; i++) {
                    if (response[i].activityId !== null) {
                        newResponse.push(response[i])
                    }
                }
                yield put(ScheduleTypes.getMyDailyCalenderSuccess(newResponse));
                AsyncStorage.setItem(LocalStorageConstants.DailyCalenderList, JSON.stringify(newResponse));
            }
        } catch (error) {
            yield put(LoaderTypes.setMainLoader(false));
            yield put(ScheduleTypes.getMyDailyCalenderFailure(error));
        }
    } else {
        try {
            var localDailyCalender = yield AsyncStorage.getItem(LocalStorageConstants.DailyCalenderList);
            if (localDailyCalender == null) {
                localDailyCalender = [];
                yield put(ScheduleTypes.getMyDailyCalenderSuccess(localDailyCalender));
            } else {
                yield put(ScheduleTypes.getMyDailyCalenderSuccess(JSON.parse(localDailyCalender)));
            }
        } catch (error) {
            yield put(ScheduleTypes.getMyDailyCalenderFailure(error))
        }
    }
}
export function* getCalendarDatas(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.getCalendarDatas, action.body);
            if (response.hasOwnProperty('error')) {
                yield put(ScheduleTypes.getCalendarDataFailure(response));
            } else {
                yield put(ScheduleTypes.getCalendarDataSuccess(response));

                 //save local db
                 const localCalenderData = yield AsyncStorage.getItem(LocalStorageConstants.CalenderData);
                 if (localCalenderData !== null) {
                     if (action.body.skip === 0) {
                         AsyncStorage.setItem(LocalStorageConstants.CalenderData, JSON.stringify(response))
                     } else {
                         let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                         const finalResponse = concatAndDeDuplicateObjects('activityId', JSON.parse(localCalenderData), response);
                         AsyncStorage.setItem(LocalStorageConstants.CalenderData, JSON.stringify(finalResponse));
                     }
                 } else {
                     AsyncStorage.setItem(LocalStorageConstants.CalenderData, JSON.stringify(response))
                 }
            }
        } catch (error) {
            yield put(ScheduleTypes.getCalendarDataFailure(response));
        }
    } else {
        try {
            var localCalenderData = yield AsyncStorage.getItem(LocalStorageConstants.CalenderData);
            if (localCalenderData === null) {
                localCalenderData = [];
                yield put(ScheduleTypes.getCalendarDataSuccess(localCalenderData))
            } else {
                var localPaginatedData = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.CalendarApiResponseQuantity; i++) {
                    if (i < JSON.parse(localCalenderData).length)
                    localPaginatedData.push(JSON.parse(localCalenderData)[i])
                }
                yield put(ScheduleTypes.getCalendarDataSuccess(localPaginatedData))
            }
        } catch (error) {
            console.log("getCalendarDataFailure local error: ", error);
            yield put(ScheduleTypes.getCalendarDataFailure(error))
        }
    }
}