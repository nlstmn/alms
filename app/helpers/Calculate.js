import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info'
import Constants from '../services/Constants';

import * as mime from 'react-native-mime-types';
import moment from 'moment';
import { strings } from '../locales/i18n';

//Calculating bytes to kb,mb,gb..
export function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


const isPortrait = (width, height) => {
    return height >= width
}
const isLandscape = (width, height) => {
    return width >= height
}

export function calculateLoginPageWidthPercent() {
    const { width, height } = Dimensions.get('screen');

    // console.log("calculateLoginPageWidthPercent: ", width)
    if (DeviceInfo.isTablet()) {
        // console.log("tablet active")
        return Math.min(width) * 0.5
    } else {
        if (isLandscape(width, height))
            return Math.min(width) * 0.5
        else
            return width
    }
}

export function createGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return 'm_' + (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

export function generateMimeTypes(extensions) {
    var extensionsArray = extensions.split(',')
    var mimeTypes = [];
    extensionsArray.forEach(function (extension) {
        if (mime.lookup(extension) !== false)
            mimeTypes.push(mime.lookup(extension))
    })
    console.log("generated mime types: ", mimeTypes);
    return mimeTypes;
}

const jsCoreDateCreator = (dateString) => {  /* debugger bug hacks */
    // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"  
    let dateParam = dateString.split(/[\s-:]/)
    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
    return new Date(...dateParam)
}


export function getDateText(date) {
    const currentDate = new Date()
    const mDate1 = new Date(date)
    const mDate = jsCoreDateCreator(date)

    const milliseconds = Math.abs(currentDate - mDate);

    const minutes = Math.floor(milliseconds / 1000 / 60)
    const hours = (milliseconds / 36e5).toFixed();
    const day = (milliseconds / (1000 * 3600 * 24)).toFixed()
    const week = (milliseconds / (1000 * 3600 * 24 * 7)).toFixed()
    const months = (currentDate.getMonth() + 12 * currentDate.getFullYear()) - (mDate.getMonth() + 12 * mDate.getFullYear())
    const year = currentDate.getFullYear() - mDate.getFullYear()
    if (minutes < 1) {
        return " " + strings('r_seconds_ago_text')
    } else if (minutes < 60) {
        return minutes + " " + strings('r_minutes_ago_text')
    } else if (hours < 24) {
        return hours + " " + strings('r_hours_ago_text')
    } else if (day < 7) {
        return day + " " + strings('r_days_ago_text')
    } else if (day < 30) {
        return week + " " + strings('r_weeks_ago_text')
    } else if (months < 12) {
        return months + " " + strings('r_months_ago_text')
    } else {
        return year + " " + strings('r_year_ago_text')
    }
}

export function getMessageDateText(date) {
    const currentDate = new Date()
    const mDate = jsCoreDateCreator(date)

    const milliseconds = Math.abs(currentDate - mDate);

    const minutes = Math.floor(milliseconds / 1000 / 60)
    const hours = (milliseconds / 36e5).toFixed();
    const day = (milliseconds / (1000 * 3600 * 24)).toFixed()
    const week = (milliseconds / (1000 * 3600 * 24 * 7)).toFixed()
    const months = (currentDate.getMonth() + 12 * currentDate.getFullYear()) - (mDate.getMonth() + 12 * mDate.getFullYear())
    const year = currentDate.getFullYear() - mDate.getFullYear()

    if (minutes < 1) {
        return moment(date).format("HH:mm")
    } else if (minutes < 60) {
        return moment(date).format("HH:mm")
    } else if (hours < 24) {
        return moment(date).format("HH:mm")
    } else {
        return moment(date).format(getMomentFormat())
    }
}
const getMomentFormat = () => {
    if (moment.locale() === 'tr') {
        return 'DD MMM YYYY HH:mm';
    } else {
        return 'MMM D YYYY hh:mm'
    }
}

export const listHtmlFormatter = (text) => {
    return text
        .replace("<ol>", "")
        .replace("</ol>", "")
        .replace("<il>", "")
        .replace("</il>", "")
}