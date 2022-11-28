import Constants from './Constants';
import fetch from '../helpers/FetchWithTimeout';
import RNFetchBlob from 'rn-fetch-blob'
const { config, fs, android } = RNFetchBlob
let DownloadDir = fs.dirs.DownloadDir

const create = () => {
    const getEnrolledCourses = (body) => {
        const url = body.almsPlusApiUrl + Constants.EnrolledCourses
        console.log("getEnrolledCourses url ", url)
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + body.accessToken,
            },
            body: JSON.stringify({
                activeStatus: body.activeStatus,
                courseDateFilter: body.courseDateFilter,
                isNotifications: body.isNotifications,
                take: body.take,
                skip: body.skip,
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
        });
    }

    //get course announcements
    const getCourseAnnouncements = (body) => {
        var url = body.almsPlusApiUrl + Constants.CourseAnnouncement
        console.log("getCourseAnnouncements ", url)
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
            if (error.hasOwnProperty("error")) { //api call completed (success or fail)
                return error
            } else { //api call uncompleted (connection problems.. etc.)
                return { 'error': true, 'code': 600, 'text': 'connection error' }
            }
        })
    }

    //get incoming activities
    const getIncomingActivities = (take, skip, classId, apiEndPoint, accessToken) => fetch(apiEndPoint + Constants.IncomingActivities, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "take": take,
            "skip": skip,
            "classId": classId
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


    //get course weeks
    const getCourseWeeks = (body) => fetch(body.almsPlusApiUrl + "/api/activity/contentpagemenu", {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "classId": body.classId
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
        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }

    })

    const getWeeksActivities = (data) => {
        fetch(data.apiEndPoint + Constants.CourseWeeksActivities, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + data.accessToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "termWeekId": data.termWeekId,
                "weekZero": data.weekZero,
                "classId": data.classId,
                "courseId": data.courseId,
                "notWeekly": data.notWeekly,
                "take": data.take,
                "skip": data.skip
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
            if (error.hasOwnProperty("error")) return error
            else return { 'error': true, 'code': 600, 'text': 'connection error' }
        })
    }

    const getActivityList = (body) => {
        const url = body.almsPlusApiUrl + "/api/activity/activitylist"
        console.log("getActivityList url:", url)
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

    const getActivityDetail = (body) => fetch(body.almsPlusApiUrl + Constants.CourseActivityList, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "getActivityType": body.getActivityType,
            "classId": body.classId,
            "courseId": body.courseId,
            "activityId": body.activityId,
            "termWeekId": body.termWeekId,
            "take": body.take,
            "skip": body.skip
        })
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

    /* File download api */

    const fileDownload = (body) => {
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true, //uses the device's native download manager.
                notification: true,
                mediaScannable: true,
                // mime: 'text/plain',
                title: "Notification Title", // Title of download notification.
                path: DownloadDir + "/" + body.activity.file.fileId + body.activity.file.extension, // this is the path where your download file will be in
                description: 'Downloading file.'
            }
        }
        return config(options)
            .fetch('GET', body.activity.file.filePath)
            .progress((received, total) => {
                console.log('progress', received / total)
            })
            .then((res) => {
                console.log("Success");
                console.log('file path:', res.path());
                let response = { 'path': res.path() }

                return response
            })
            .catch((err) => {
                console.log("Error", err);
                return { 'error': true, 'code': 600, 'text': 'connection error' }
            })
    }

    const getTeacherCourses = (body) => fetch(body.almsPlusApiUrl + Constants.TeacherCourses, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "take": body.take,
            "skip": body.skip,
            "status": body.activeStatus
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
        console.log('getTeacherCourses api errır: ', error);

        if (error.hasOwnProperty("error")) return error
        else return { 'error': true, 'code': 600, 'text': 'connection error' }
    })


    const enrollmentProgress = (body) => fetch(body.almsPlusApiUrl + Constants.EnrollmentProgress, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + body.accessToken,
            Accept: 'application/json',
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
    });

    const getTopCompletedActivity = (body) => {
        var fetchUrl = body.almsPlusApiUrl + Constants.TopCompletedActivity
        return fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + body.accessToken
            },
            body: JSON.stringify(body.data)
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                return { 'error': true, 'code': response.status, 'text': response.statusText }
            }
        }).then(function (json) {
            return json;
        }).catch(err => {
            console.log("eror: ", err);
            return Constants.ConnectionError
        })
    }

    const assignmentSendAnswer = (body) => {
        var fetchUrl = body.almsPlusApiUrl + Constants.AssignmentSendAnswer
        console.log("assignmentSendAnswer url : ", fetchUrl)
        return fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + body.accessToken
            },
            body: body.data
        }).then(function (response) {
            if (response.ok) {
                // return response.json()
                return { 'success': true, 'data': [] }
            } else {
                return response.text().then(text => { throw { 'error': true, 'code': response.status, 'text': text } })
            }
        }).catch(err => {
            return err
        })
    }

    return {
        getEnrolledCourses,
        getCourseAnnouncements,
        getIncomingActivities,
        getCourseWeeks,
        getWeeksActivities,
        getActivityList,
        getActivityDetail,
        fileDownload,
        getTeacherCourses,
        enrollmentProgress,
        getTopCompletedActivity,
        assignmentSendAnswer
    }
}
export default {
    create
}