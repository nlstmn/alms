import Constants from './Constants';

import fetch from '../helpers/FetchWithTimeout';

const create = () => {

    const getFileSettings = (body) => fetch(body.almsPlusApiUrl + Constants.FileSettings, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(function (response) {
        if (response.ok) {
            console.log('getFileSettings response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('getFileSettings result: ', json);
        return json
    }).catch(error => {
        console.log("getFileSettings error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });

    return {
        getFileSettings
    }
}

export default {
    create
}