import Constants from './Constants';
import fetch from '../helpers/FetchWithTimeout';

const create = () => {
    const getMyDailyCalender = (body) => {
        var url = body.almsPlusApiUrl + Constants.Schedule
        console.log("getMyDailyCalender url: ", url)
        return fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "startDate": body.startDate,
                "endDate": body.endDate,
                "contextType": body.contextType,
                "filter": {
                    "activityType": 0,
                    "completed": 0,
                    "grade": 0,
                    "isDatePassed": 0,
                    "dueDate": 0
                },
                "take": body.take,
                "skip": body.skip
            })
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response.statusText }
            }
        }).then(function (json) {
            console.log('getMyDailyCalender api result: ', json);
            return json
        }).catch(error => {
            console.log('getMyDailyCalender api errır: ', error);

            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }


    const getCalendarDatas = (body) => {
        const url = body.almsPlusApiUrl + Constants.Schedule
        console.log("getCalendarDatas: ", url)
        return fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "startDate": body.startDate,
                "endDate": body.endDate,
                "contextType": body.contextType,
                "filter": {
                    "activityType": 0,
                    "completed": 0,
                    "grade": 0,
                    "isDatePassed": 0,
                    "dueDate": 0
                },
                "take": body.take,
                "skip": body.skip
            })
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response.statusText }
            }
        }).then(function (json) {
            return json
        }).catch(error => {
            console.log('getCalendarDatas api errır: ', error);

            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }
    return {
        getMyDailyCalender,
        getCalendarDatas
    }
}

export default {
    create
}