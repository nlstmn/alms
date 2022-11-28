import { call, put } from 'redux-saga/effects';
import CoursesType from '../redux/CoursesRedux';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../local/LocalStorageConstants';
import Constants from '../services/Constants';
import LoaderTypes from '../redux/LoaderRedux';


export function* getEnrolledCoursesList(api, action) { //or teacher courses
    if (action.body.remote) {
        try {
            let response;
            if(action.body.loader){
                yield put(LoaderTypes.setMainLoader(true))
            }
            
            if (action.body.userIdentity.userType === Constants.UserTypes.Instructor) {
                response = yield call(api.getTeacherCourses, action.body);
            } else {
                response = yield call(api.getEnrolledCourses, action.body);
            }
            yield put(LoaderTypes.setMainLoader(false))
            if (response.hasOwnProperty("error")) {
                yield put(CoursesType.getCoursesFailure(response))
            } else {
                yield put(CoursesType.getCoursesSuccess(response))
                const localCourseList = yield AsyncStorage.getItem(LocalStorageConstants.CourseList)
                if (localCourseList !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.CourseList, JSON.stringify(response));
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('courseId', JSON.parse(localCourseList), response);
                        AsyncStorage.setItem(LocalStorageConstants.CourseList, JSON.stringify(finalResponse));
                    }

                } else {
                    AsyncStorage.setItem(LocalStorageConstants.CourseList, JSON.stringify(response));
                }
            }

        } catch (error) {
            console.log("error occured:", error);
            yield put(LoaderTypes.setMainLoader(false))
            yield put(CoursesType.getCoursesFailure(error))
        }
    } else {
        try {
            var localCourseData = yield AsyncStorage.getItem(LocalStorageConstants.CourseList);
            if (localCourseData == null) {
                localCourseData = [];
                yield put(CoursesType.getCoursesSuccess(localCourseData));
            } else {
                var localPaginatedCoursesList = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localCourseData).length)
                        localPaginatedCoursesList.push(JSON.parse(localCourseData)[i])
                }
                yield put(CoursesType.getCoursesSuccess(localPaginatedCoursesList));
            }
        } catch (error) {
            console.log("error: ", error);
            yield put(CoursesType.getCoursesFailure(error))
        }
    }
}


export function* getEnrolledLessonsList(api, action) { //or teacher courses
    if (action.body.remote) {
        try {
            let response;
            yield put(LoaderTypes.setMainLoader(true))
            if (action.body.userIdentity.userType === Constants.UserTypes.Instructor) {
                response = yield call(api.getTeacherCourses, action.body);
            } else {
                response = yield call(api.getEnrolledCourses, action.body);
            }
            yield put(LoaderTypes.setMainLoader(false))
            console.log("getEnrolledLessonsList: ", response);
            if (response.hasOwnProperty("error")) {
                yield put(CoursesType.getLessonsFailure(response))
            } else {
                yield put(CoursesType.getLessonsSuccess(response))
                const localCourseList = yield AsyncStorage.getItem(LocalStorageConstants.LessonsList)
                if (localCourseList !== null) {
                    if (action.body.skip === 0) {
                        AsyncStorage.setItem(LocalStorageConstants.LessonsList, JSON.stringify(response));
                    } else {
                        let concatAndDeDuplicateObjects = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
                        const finalResponse = concatAndDeDuplicateObjects('courseId', JSON.parse(localCourseList), response);
                        AsyncStorage.setItem(LocalStorageConstants.LessonsList, JSON.stringify(finalResponse));
                    }

                } else {
                    AsyncStorage.setItem(LocalStorageConstants.LessonsList, JSON.stringify(response));
                }
            }

        } catch (error) {
            console.log("error occured:", error);
            yield put(CoursesType.getLessonsFailure(error))
            yield put(LoaderTypes.setMainLoader(false))
        }
    } else {
        try {
            var localCourseData = yield AsyncStorage.getItem(LocalStorageConstants.LessonsList);
            if (localCourseData == null) {
                localCourseData = [];
                yield put(CoursesType.getLessonsSuccess(localCourseData));
            } else {
                var localPaginatedCoursesList = [];
                for (let i = action.body.skip; i < action.body.skip + Constants.ApiResponseQuantity; i++) {
                    if (i < JSON.parse(localCourseData).length)
                        localPaginatedCoursesList.push(JSON.parse(localCourseData)[i])
                }
                yield put(CoursesType.getLessonsSuccess(localPaginatedCoursesList));
            }
        } catch (error) {
            console.log("error: ", error);
            yield put(CoursesType.getLessonsFailure(error))
        }
    }
}


export function* getEnrollmentProgress(api, action) {
    if (action.body.remote) {
        try {
            const response = yield call(api.enrollmentProgress, action.body);
            if (response.hasOwnProperty('error')) {
                yield put(CoursesType.getEnrollmentProgressFailure(response))
            } else {
                AsyncStorage.setItem(LocalStorageConstants.EnrollmentData, JSON.stringify(response));
                yield put(CoursesType.getEnrollmentProgressSuccess(response))
            }

        } catch (error) {
            yield put(CoursesType.getEnrollmentProgressFailure(error))
        }
    } else {
        var localEnrollmentData = yield AsyncStorage.getItem(LocalStorageConstants.EnrollmentData);
        console.log("getEnrollmentProgress", localEnrollmentData);
        if (localEnrollmentData === null) {
            localEnrollmentData = []
        }
        yield put(CoursesType.getEnrollmentProgressSuccess(JSON.parse(localEnrollmentData)))
    }

}