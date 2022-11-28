import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    getMyDailyCalenderRequest: ['body'],
    getMyDailyCalenderSuccess: ['data'],
    getMyDailyCalenderFailure: ['error'],

    getCalendarDataRequest: ['body'],
    getCalendarDataSuccess: ['data'],
    getCalendarDataFailure: ['error'],
});

export const ScheduleTypes = Types
export default Creators


/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    dailyCalender: null,
    dailyCalenderFetching: true,
    dailyCalenderErrorMessage: '',
    dailyCalenderError: false,

    calendarData: [],
    calendarDataFetching: true,
    calendarDataErrorMessage: '',
    calendarDataError: false,
});


/* ------------- Reducers ------------- */
export const getMyDailyCalenderRequest = (state, action) => {
    console.log("getMyDailyCalenderRequest:",action.body)
    return state.merge({ dailyCalenderFetching: true, dailyCalenderError: false, dailyCalenderErrorMessage: '' })
}

export const getMyDailyCalenderSuccess = (state, action) => {
    console.log("getMyDailyCalenderSuccess ", action.data)
    return state.merge({ dailyCalenderFetching: false, dailyCalenderError: false, dailyCalenderErrorMessage: '', dailyCalender: action.data })
}

export const getMyDailyCalenderFailure = (state, action) => {
    return state.merge({ dailyCalenderFetching: false, dailyCalenderError: true, dailyCalenderErrorMessage: action.error })
}


export const getCalendarDataRequest = (state, action) => {
    console.log("getCalendarDataRequest: ",action.body)
    return state.merge({ calendarDataFetching: true, calendarDataError: false, calendarDataErrorMessage: '' })
}

export const getCalendarDataSuccess = (state, action) => {
    console.log("getCalendarDataSuccess: ", action.data);
    return state.merge({ calendarDataFetching: false, calendarDataError: false, calendarDataErrorMessage: '', calendarData: action.data })
}

export const getCalendarDataFailure = (state, action) => {
    console.log("getCalendarDataFailure: ",action.error)
    return state.merge({ calendarDataFetching: false, calendarDataError: true, calendarDataErrorMessage: action.error })
}


/* ------------- Connection Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_MY_DAILY_CALENDER_REQUEST]: getMyDailyCalenderRequest,
    [Types.GET_MY_DAILY_CALENDER_SUCCESS]: getMyDailyCalenderSuccess,
    [Types.GET_MY_DAILY_CALENDER_FAILURE]: getMyDailyCalenderFailure,

    [Types.GET_CALENDAR_DATA_REQUEST]: getCalendarDataRequest,
    [Types.GET_CALENDAR_DATA_SUCCESS]: getCalendarDataSuccess,
    [Types.GET_CALENDAR_DATA_FAILURE]: getCalendarDataFailure,
})
