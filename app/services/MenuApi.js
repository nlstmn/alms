import Constants from './Constants';
// import fetch from '../helpers/FetchWithTimeout';
const create = () => {
    const getMenu = (data) => fetch(data.almsPlusApiUrl + Constants.Menu, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + data.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('getMenu result: ', json);
        return json
    }).catch(error => {
        console.log("getMenu error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    return {
        getMenu,
    }
}

export default {
    create
}