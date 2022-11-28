import Constants from './Constants';
import RNFetchBlob from 'rn-fetch-blob'
import AnnouncementTypes from '../redux/AnnouncementRedux';
const { config, fs, android } = RNFetchBlob
let DownloadDir = fs.dirs.DownloadDir

import fetch from '../helpers/FetchWithTimeout';
const create = () => {

    const getAnnouncementsCall = (body) => fetch(body.almsPlusApiUrl + Constants.AnnouncementUrl + "my", {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "take": body.take,
            "skip": body.skip,
            "searchedWord": body.searchedWord,
            "state": body.state
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
        if (error.hasOwnProperty("error")) { //api call completed (success or fail)
            return error
        } else { //api call uncompleted (connection problems.. etc.)
            return { 'error': true, 'code': 600, 'text': 'connection error' }
        }
    })

    /* -------------------------------- */

    const getAnnouncementDetail = (body) => {
        const url = body.almsPlusApiUrl + Constants.AnnouncementDetail + body.announcementId
        console.log('getAnnouncementDetail url : ', url)
        return fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + body.accessToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (response.ok) {
                console.log('getAnnouncementDetail response.ok');
                return response.json()
            } else {
                console.log('getAnnouncementDetail response.nok')
                throw { 'error': true, 'code': response.status, 'text': response.statusText }
            }
        }).then(function (json) {
            console.log('getAnnouncementDetail result: ', json);
            return json
        }).catch(error => {
            console.log("getAnnouncementDetail error: ", error);
            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        });
    }

    /* ---------------------------- */

    const downloadAnnouncementAttachment = async (body) => {
        let dirs = RNFetchBlob.fs.dirs

        let options = {
            fileCache: true,
            //path: DownloadDir + "/alms/announcements/" + body.announcementId + body.fileName,
            path: dirs.DocumentDir + '/' + body.announcementId + body.fileName

        }
        try {
            return config(options)
                .fetch('GET', body.path)
                .progress((received, total) => {

                }).then((res) => {
                    console.log('file path:', res.path());
                    return res.path();
                })
        }
        catch (err) {
            console.log("Error", err);
            return { 'error': true, 'code': 0, 'text': '' };
        }
    }

    /* ------------------------ */

    const newAnnouncement = (body) => {
        var url = body.almsPlusApiUrl + "/api/announcement"
        console.log("newAnnouncement url : ",url)
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + body.accessToken,
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
            return json
        }).catch(error => {
            console.log("newAnnouncement error: ", error);
            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        });
    }


    /* ----------------- */

    const searchAnnouncementReceiver = (body) => fetch(body.almsPlusApiUrl + Constants.SearchAnnouncementReceiver, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: body.data
    }).then(function (response) {
        if (response.ok) {
            console.log('searchAnnouncementReceiver response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('searchAnnouncementReceiver result: ', json);
        return json
    }).catch(error => {
        console.log("searchAnnouncementReceiver error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });


    /* -------------------------- */

    const announcementChangeState = (body) => fetch(body.almsPlusApiUrl + Constants.AnnouncementChangeState, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "state": body.state,
            "announcementId": body.announcementId,
        })
    }).then(function (response) {
        if (response.ok) {
            console.log('announcementChangeState response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('announcementChangeState result: ', json);
        return json
    }).catch(error => {
        console.log("announcementChangeState error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });


    return {
        getAnnouncementsCall,
        getAnnouncementDetail,
        downloadAnnouncementAttachment,
        newAnnouncement,
        searchAnnouncementReceiver,
        announcementChangeState
    }
}
export default {
    create
}


