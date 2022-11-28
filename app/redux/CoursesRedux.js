import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';



/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setCoursesList: [],

    getCoursesRequest: ['body'],
    getCoursesSuccess: ['data'],
    getCoursesFailure: ['error'],

    getLessonsRequest: ['body'],
    getLessonsSuccess: ['data'],
    getLessonsFailure: ['error'],


    getEnrollmentProgressRequest: ['body'],
    getEnrollmentProgressSuccess: ['data'],
    getEnrollmentProgressFailure: ['error'],

    setEnrollmentProgressData: ['data']
})

export const CoursesTypes = Types
export default Creators


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    enrolledCoursesData: null,
    fetching: true,
    errorMessage: '',
    error: false,


    enrollmentProgressData: [],
    enrollmentProgressFetching: false,
    enrollmentProgressErrorMessage: '',
    enrollmentProgressError: false,

    lessonsData: null,
    lessonsFetching: false,
    lessonsErrorMessage: '',
    lessonsError: false,

})


/* ------------- Reducers ------------- */
export const getCoursesRequest = (state, action) => {
    console.log("getCoursesRequest : ", action.body)
    return state.merge({ fetching: true, error: false, errorMessage: '' })
}

export const getCoursesSuccess = (state, action) => {
    console.log("getCoursesSuccess : ",action.data)
    return state.merge({ fetching: false, error: false, errorMessage: '', enrolledCoursesData: action.data })
}

export const getCoursesFailure = (state, action) => {
    return state.merge({ fetching: false, error: true, errorMessage: action.error })
}


/* ------------------ */
export const getEnrollmentProgressRequest = (state, action) => {
    console.log("getEnrollmentProgressRequest", action.body)
    return state.merge({ enrollmentProgressFetching: true, enrollmentProgressErrorMessage: '', enrollmentProgressError: false })
}
export const getEnrollmentProgressSuccess = (state, action) => {
    console.log("getEnrollmentProgressSuccess", action.data)
    return state.merge({ enrollmentProgressData: action.data, enrollmentProgressFetching: false, enrollmentProgressErrorMessage: '', enrollmentProgressError: false })
}

export const getEnrollmentProgressFailure = (state, action) => {
    console.log("getEnrollmentProgressFailure", action.error)
    return state.merge({ enrollmentProgressFetching: false, enrollmentProgressErrorMessage: action.error, enrollmentProgressError: true })
}

export const setEnrollmentProgressData = (state, action) => {
    console.log("setEnrollmentProgressData", action.data)
    return state.merge({ enrollmentProgressData: [...state.enrollmentProgressData, action.data] })
}

/* ------------ */

export const getLessonsRequest = (state, action) => {
    console.log("getLessonsRequest:", action.body)
    return state.merge({ lessonsFetching: true, lessonsErrorMessage: '', lessonsError: false })
}
export const getLessonsSuccess = (state, action) => {
    console.log("getLessonsSuccess", action.data)
    return state.merge({ lessonsData: action.data, lessonsFetching: false, lessonsErrorMessage: '', lessonsError: false })
}

export const getLessonsFailure = (state, action) => {
    console.log("getLessonsFailure", action.error)
    return state.merge({ lessonsFetching: false, lessonsErrorMessage: action.error, lessonsError: true })
}


export const setCoursesList = (state, action) => {
    return state.merge({ enrolledCoursesData: [], fetching: true, errorMessage: '', error: false, })
}
/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_COURSES_REQUEST]: getCoursesRequest,
    [Types.GET_COURSES_SUCCESS]: getCoursesSuccess,
    [Types.GET_COURSES_FAILURE]: getCoursesFailure,

    [Types.GET_ENROLLMENT_PROGRESS_REQUEST]: getEnrollmentProgressRequest,
    [Types.GET_ENROLLMENT_PROGRESS_SUCCESS]: getEnrollmentProgressSuccess,
    [Types.GET_ENROLLMENT_PROGRESS_FAILURE]: getEnrollmentProgressFailure,

    [Types.GET_LESSONS_REQUEST]: getLessonsRequest,
    [Types.GET_LESSONS_SUCCESS]: getLessonsSuccess,
    [Types.GET_LESSONS_FAILURE]: getLessonsFailure,

    [Types.SET_ENROLLMENT_PROGRESS_DATA]: setEnrollmentProgressData,


    [Types.SET_COURSES_LIST]: setCoursesList,
})