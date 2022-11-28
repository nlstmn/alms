import Constants from './Constants';
// import fetch from '../helpers/FetchWithTimeout';


const create = () => {

    const getRequestToken = (userName, password, organization) => {
        const url = organization.almsPlusAuthUrl + Constants.AuthUrl
        console.log("getRequestToken url: ",url)
        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'client_id=api&'
                + 'grant_type=password&'
                + 'username=' + userName + '&' + 'password=' + password + '&'
                + 'address=' + organization.apiAddress + '&'
                + 'port=' + Constants.ApiPort,
            // body: JSON.stringify({
            //     "client_id": 'api',
            //     "grant_type": 'password',
            //     "username": userName,
            //     "password": password,
            //     "address": organization.apiAddress,
            //     "port": Constants.ApiPort
            // })
        }).then(response => response.json()).then(json => {
            console.log("api resp:", json);
            return json
        })
    }

    /* grant_type=refresh_token */
    const refreshToken = (body) => fetch(body.almsPlusAuthUrl + Constants.AuthUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'client_id=api&'
            + 'grant_type=refresh_token&'
            + 'username=' + body.userName + '&' + 'password=' + body.password + '&'
            + 'address=' + body.apiAddress + '&'
            + 'port=' + Constants.ApiPort + '&'
            + 'refresh_token=' + body.refreshToken,
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            return { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        return json;
    }).catch(err => {
        return Constants.ConnectionError
    })

    const getUserIdentity = (token, organization) => fetch(organization.almsPlusApiUrl + Constants.UserIdentity, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw { 'error': response.status, 'error_text': response.statusText }
        }
    }).then(function (json) {
        console.log("getUserIdentity result", json)
        return json
    }).catch(error => {
        return error
    });

    return {
        getRequestToken,
        getUserIdentity,
        refreshToken
    }
}

export default {
    create
}