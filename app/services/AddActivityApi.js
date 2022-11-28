import Constants from './Constants';
import fetch from '../helpers/FetchWithTimeout';
const create = () => {

    const getTags = (body) => fetch(body.almsPlusApiUrl + Constants.GetTags, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + body.accessToken,
        },
        body: JSON.stringify({
            "type": body.type,
            "searchedText": body.searchedText,
            "take": body.take,
            "skip": body.skip
        })
    }).then(function (response) {
        if (response.ok) {
            console.log('getTags response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('getTags result: ', json);
        return json
    }).catch(error => {
        console.log("getTags error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });


    /* ------------------------------ */

    const conditionalactivities = (body) => fetch(body.almsPlusApiUrl + Constants.GetConditionalActivities, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + body.accessToken,
        },
        body: JSON.stringify({
            "courseId": body.courseId,
            "classId": body.classId,
        })
    }).then(function (response) {
        if (response.ok) {
            console.log('conditionalactivities response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('conditionalactivities result: ', json);
        return json
    }).catch(error => {
        console.log("conditionalactivities error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });

    /* ---------------- */
    const getClassInformation = (body) => fetch(body.almsPlusApiUrl + Constants.GetClassInformation, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + body.accessToken,
        },
        body: body.data
    }).then(function (response) {
        if (response.ok) {
            console.log('getClassInformation response.ok');
            return response.json()
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('getClassInformation result: ', json);
        return json
    }).catch(error => {
        console.log("getClassInformation error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });

    /* -------------------- */
    /* Duyuru ekleme ve aktivity card image ekleme gibi, tüm hepsinde bu api kullanılabilir. */
    const uploadFile = (body) => fetch(body.almsPlusApiUrl + Constants.UploadFile, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + body.accessToken,
        },
        body: body.formData
    }).then(function (response) {
        if (response.ok) {
            console.log('uploadFile response.ok');
            return true
        } else {
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('uploadFile result: ', json);
        return json
    }).catch(error => {
        console.log("uploadFile error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });



    const addActivityType = (body) => fetch(body.almsPlusApiUrl + body.apiEndPoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + body.accessToken,
        },
        body: JSON.stringify(body.data)
    }).then(function (response) {
        if (response.ok) {
            console.log('addActivityType response.ok');
            return response.json()
        } else {
            console.log(" addActivityType response: ",response);
            throw { 'error': true, 'code': response.status, 'text': response.statusText }
        }
    }).then(function (json) {
        console.log('addActivityType result: ', json);
        return json
    }).catch(error => {
        console.log("addActivityType error: ", error);
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    });


    return {
        getTags,
        conditionalactivities,
        getClassInformation,
        uploadFile,
        addActivityType
    }


}
export default {
    create
}