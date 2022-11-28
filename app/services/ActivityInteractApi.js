import Constants from './Constants';
import fetch from '../helpers/FetchWithTimeout';

const create = () => {

    const saveVideoTracking = (body) => fetch(body.almsPlusApiUrl + Constants.VideoSaveTracking, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "classId": body.classId,
            "activityId": body.activityId,
            "trackingData": body.trackingData,
        })
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            console.log("saveVideoTracking api result: ", response.json());
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        return json
    }).catch(error => {
        console.log('saveVideoTracking api errır: ', error);

        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    const setActivityComletionCriteria = (body) => {
        const url = body.almsPlusApiUrl + "/api/enrollment/addaction"
        console.log("setActivityComletionCriteria url:", url)
        return fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body.data
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response }
            }
        }).then(function (json) {
            return json
        }).catch(error => {
            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }

    const getFileDetail = (body) => {
        const url = body.almsPlusApiUrl + "/api/file/content/" + body.fileId
        console.log("getFileDetail url:", url)
        return fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response }
            }
        }).then(function (json) {
            return json
        }).catch(error => {
            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }

    const connectToAlmsRequest = (body) => {
        const url = body.almsPlusApiUrl + "/api/account/connectToAlms"
        console.log("connectToAlmsRequest url:", url)
        return fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body.data
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response }
            }
        }).then(function (json) {
            return json
        }).catch(error => {
            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }

    return {
        saveVideoTracking,
        setActivityComletionCriteria,
        getFileDetail,
        connectToAlmsRequest
    }
}

export default {
    create
}