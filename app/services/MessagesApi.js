import Constants from './Constants';
import fetch from '../helpers/FetchWithTimeout';

const create = () => {

    /* --------------------------- */
    const getMessagesGroup = (body) => {
        const apiUrl = body.almsPlusApiUrl
            + "/api/message/conversation?take=" + body.take
            + "&skip=" + body.skip
            + "&isGroup=" + body.isGroup
        console.log('getMessagesGroup apiUrl : ', apiUrl)
        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response.statusText }
            }
        }).then(function (json) {
            return json
        }).catch(error => {

            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }

    /* --------------------------- */

    const sendMessage = (body) => fetch(body.almsPlusApiUrl + '/api/message', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body.data
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('sendMessage api result: ', json);
        return json
    }).catch(error => {
        console.log('sendMessage api errır: ', error);

        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    /* --------------------------- */

    const getMessageDetail = (body) => fetch(body.almsPlusApiUrl
        + '/api/message/'
        + body.messageId
        + "?take=" + body.take
        + "&skip=" + body.skip, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        return json
    }).catch(error => {
        console.log('getMessageDetail api errır: ', error);

        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    /* --------------------------- */

    const deleteMessage = (body) => fetch(body.almsPlusApiUrl + Constants.MessageDelete, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "messageId": body.messageId,
        })
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('deleteMessage api result: ', json);
        return json
    }).catch(error => {
        console.log('deleteMessage api errır: ', error);

        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    /* --------------------------- */

    const getMyClassMates = (body) => fetch(body.almsPlusApiUrl + Constants.MyClassMates, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "courseId": body.courseId,
            "skip": body.skip,
            "take": body.take
        })
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('getMyClassMates api result: ', json);
        return json
    }).catch(error => {
        console.log('getMyClassMates api errır: ', error);

        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })


    /* ---------------------------- */


    const search = (body) => fetch(body.almsPlusApiUrl + Constants.Search, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "take": body.take,
            "skip": body.skip,
            "searchKey": body.searchKey,
            "getTypes": body.getTypes,
        })
    }).then(function (response) {
        if (response.ok) {
            console.log('search response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('search result: ', json);
        return json
    }).catch(error => {
        console.log("search error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });

    const getPersons = (body) => fetch(body.almsPlusApiUrl
        + '/api/message/contact'
        + "?take=" + body.take
        + "&skip=" + body.skip, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        return json
    }).catch(error => {
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    const getGroups = (body) => fetch(body.almsPlusApiUrl
        + '/api/message/group'
        + "?take=" + body.take
        + "&skip=" + body.skip, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        return json
    }).catch(error => {
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    const getMessageOrigin = (body) => fetch(body.almsPlusApiUrl
        + '/api/message/origin/'
        +  body.recipientId
        + "?recipientType="+body.recipientType, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        return json
    }).catch(error => {
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })

    return {
        getMessagesGroup,
        sendMessage,
        getMessageDetail,
        deleteMessage,
        getMyClassMates,
        search,
        getPersons,
        getGroups,
        getMessageOrigin
    }
}

export default {
    create
}