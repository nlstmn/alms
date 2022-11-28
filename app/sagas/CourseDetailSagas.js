import { call, put ,select} from 'redux-saga/effects';
import CourseDetailTypes from '../redux/CourseDetailRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';
import Constants from '../services/Constants';
import LoaderTypes from '../redux/LoaderRedux';
import { showMessage, hideMessage } from "react-native-flash-message";
import { errorMessageData, successMessageData } from '../helpers/FlashMessageData';
import { strings } from '../locales/i18n';

export const getMainRedux = (state) => state.main

export function* getCourseAnnouncement(api, action) {
    if (action.body.remote) {
        try {
            if (action.body.loader) {
                yield put(LoaderTypes.setMainLoader(true))
            }
            const response = yield call(api.getCourseAnnouncements, action.body);
            yield put(LoaderTypes.setMainLoader(false))
            if (response.hasOwnProperty("error")) {
                yield put(CourseDetailTypes.getCourseAnnouncementFailure(response))
            } else {
                yield put(CourseDetailTypes.getCourseAnnouncementSuccess(response))

                //save data for offline mode
                const localCourseAnnouncement = yield AsyncStorage.getItem(action.body.classId + LocalStorageConstants.CourseAnnouncementList);
                if (localCourseAnnouncement !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(action.body.classId + LocalStorageConstants.CourseAnnouncementList, JSON.stringify(response))
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('announcementId', JSON.parse(localCourseAnnouncement), response);

                        AsyncStorage.setItem(action.body.classId + LocalStorageConstants.CourseAnnouncementList, JSON.stringify(finalResponse))
                    }

                } else {
                    AsyncStorage.setItem(action.body.classId + LocalStorageConstants.CourseAnnouncementList, JSON.stringify(response))
                }
            }

        } catch (error) {
            yield put(CourseDetailTypes.getCourseAnnouncementFailure(error))
        }
    } else {
        try {
            var localCourseAnnouncement = yield AsyncStorage.getItem(action.body.classId + LocalStorageConstants.CourseAnnouncementList);
            if (localCourseAnnouncement == null) {
                localCourseAnnouncement = [];
                yield put(CourseDetailTypes.getCourseAnnouncementSuccess(localCourseAnnouncement))
            } else {
                var localPaginatedCourseAnnouncements = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localCourseAnnouncement).length)
                        localPaginatedCourseAnnouncements.push(JSON.parse(localCourseAnnouncement)[i])
                }
                yield put(CourseDetailTypes.getCourseAnnouncementSuccess(localPaginatedCourseAnnouncements))
            }

        } catch (error) {
            yield put(CourseDetailTypes.getCourseAnnouncementFailure(error))
        }
    }

}

export function* getIncomingActivities(api, action) {
    try {
        const response = yield call(api.getIncomingActivities, action.take, action.skip, action.classId, action.apiEndPoint, action.accessToken);
        if (response.hasOwnProperty("error")) {
            yield put(CourseDetailTypes.getIncomingActivitiesFailure(response))
        } else {
            yield put(CourseDetailTypes.getIncomingActivitiesSuccess(response))
        }
    } catch (error) {
        yield put(CourseDetailTypes.getIncomingActivitiesFailure(response))
    }
}

export function* getCourseWeeks(api, action) {
    if (action.body.remote) {
        try {
            // yield put(LoaderTypes.setMainLoader(true))
            const response = yield call(api.getCourseWeeks, action.body);
            // yield put(LoaderTypes.setMainLoader(false))
            console.log("course weeks r: ", response);
            response.termWeeks.sort(function (a, b) { // data sorted
                if (a.startDate > b.startDate) return -1;
                if (a.startDate < b.startDate) return 1;
                return 0;
            })

            if (response.hasOwnProperty('error')) {
                yield put(CourseDetailTypes.getCourseWeeksFailure(response))
            } else {
                yield put(CourseDetailTypes.getCourseWeeksSuccess(response))
                AsyncStorage.setItem(action.body.classId + LocalStorageConstants.CourseWeekList, JSON.stringify(response));
            }
        } catch (error) {
            // yield put(LoaderTypes.setMainLoader(false))
            yield put(CourseDetailTypes.getCourseWeeksFailure(error))
        }
    } else {
        try {
            var localCourseWeeks = yield AsyncStorage.getItem(action.body.classId + LocalStorageConstants.CourseWeekList);

            if (localCourseWeeks == null) {
                localCourseWeeks = [];
                yield put(CourseDetailTypes.getCourseWeeksSuccess(localCourseWeeks))
            } else {
                yield put(CourseDetailTypes.getCourseWeeksSuccess(JSON.parse(localCourseWeeks)))

            }
        } catch (error) {
            yield put(CourseDetailTypes.getCourseWeeksFailure(error))
        }
    }

}
// deprecated
export function* getWeeksActivities(api, action) {
    try {
        const response = yield call(api.getWeeksActivities, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(CourseDetailTypes.getWeeksActivitiesFailure(response))
        } else {
            yield put(CourseDetailTypes.getWeeksActivitiesSuccess(response))
        }
    } catch (error) {
        yield put(CourseDetailTypes.getWeeksActivitiesFailure(error))
    }
}
//aktivite listeleri offline mode için classId+courseId+termweekId olarak kaydediliyor.
export function* getActivityList(api, action) {
    if (action.body.remote) {
        try {
            yield put(LoaderTypes.setMainLoader(true))
            const response = yield call(api.getActivityList, action.body);
            yield put(LoaderTypes.setMainLoader(false))
            if (response.hasOwnProperty('error')) {
                yield put(CourseDetailTypes.getActivityListFailure(response))
            } else {
                yield put(CourseDetailTypes.getActivityListSuccess(response))
                // //save data for offline mode
                // const localActivityList = yield AsyncStorage.getItem(action.body.classId + action.body.courseId + action.body.termWeekId);
                // if (localActivityList !== null) {
                //     if (action.body.skip === 0) {
                //         AsyncStorage.setItem(action.body.classId + action.body.courseId + action.body.termWeekId, JSON.stringify(response))
                //     } else {
                //         let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                //         const finalResponse = concatAndDeDuplicateObjects('activityId', JSON.parse(localActivityList), response);

                //         AsyncStorage.setItem(action.body.classId + action.body.courseId + action.body.termWeekId, JSON.stringify(finalResponse))
                //     }
                // } else {
                //     AsyncStorage.setItem(action.body.classId + action.body.courseId + action.body.termWeekId, JSON.stringify(response))
                // }

            }
        } catch (error) {
            console.log("error > ", error)
            yield put(LoaderTypes.setMainLoader(false))
            yield put(CourseDetailTypes.getActivityListFailure(error))
        }
    } else {
        try {
            var localActivityList = yield AsyncStorage.getItem(action.body.classId + action.body.courseId + action.body.termWeekId);
            if (localActivityList == null) {
                localActivityList = [];
                yield put(CourseDetailTypes.getActivityListSuccess(localActivityList))
            } else {
                var localPaginatedActivityList = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localActivityList).length)
                        localPaginatedActivityList.push(JSON.parse(localActivityList)[i])
                }
                yield put(CourseDetailTypes.getActivityListSuccess(localPaginatedActivityList))
            }
        } catch (error) {
            console.log("error: ", error);
            yield put(CourseDetailTypes.getActivityListFailure(error))
        }
    }
}

export function* fileDownload(api, action) {
    try {
        const response = yield call(api.fileDownload, action.body);
        if (response.hasOwnProperty('error')) {
            yield put(CourseDetailTypes.fileDownloadFailure(response))
        } else {
            yield put(CourseDetailTypes.fileDownloadSuccess(response))
        }
    } catch (error) {
        yield put(CourseDetailTypes.fileDownloadFailure(error))
    }
}

export function* getActivityDetail(api, action) {
    try {
        const response = yield call(api.getActivityDetail, action.body);
        console.log("getActivityDetail sagas: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(CourseDetailTypes.activityDetailFailure(response))
        } else {
            yield put(CourseDetailTypes.activityDetailSuccess(response))
        }
    } catch (error) {
        yield put(CourseDetailTypes.activityDetailFailure(error))
    }
}


export function* getTopCompletedActivity(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.getTopCompletedActivity, action.body);
        yield put(LoaderTypes.setMainLoader(false))
        console.log("getTopCompletedActivity response: ", response);
        if (response.hasOwnProperty('error')) {
            yield put(CourseDetailTypes.topCompletedActivityFailure(response))
        } else {
            yield put(CourseDetailTypes.topCompletedActivitySuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(CourseDetailTypes.topCompletedActivityFailure(error))
    }
}


export function* assignmentSendAnswer(api, action) {
    try {
        yield put(LoaderTypes.setMainLoader(true))
        const response = yield call(api.assignmentSendAnswer, action.body);
        let mainRedux = yield select(getMainRedux)
        console.log("assignmentSendAnswer saga response:  ", response)
        yield put(LoaderTypes.setMainLoader(false))
        if (response.hasOwnProperty('error')) {
            var errorString = JSON.parse(response.text).generalError[0]
            showMessage(errorMessageData({ message: mainRedux.languageResource[errorString] || strings('r_api_assignment_dead_line_passed') }))
            yield put(CourseDetailTypes.sendAssignmentAnswerFailure(response))
        } else {
            showMessage(successMessageData({ message: "Başarılı şekilde gönderildi." }))
            yield put(CourseDetailTypes.sendAssignmentAnswerSuccess(response))
        }
    } catch (error) {
        yield put(LoaderTypes.setMainLoader(false))
        yield put(CourseDetailTypes.sendAssignmentAnswerFailure(error))
    }
}
