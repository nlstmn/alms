
import moment from 'moment';

export const formatDefault = () => {
    return 'YYYY-MM-DD'
}

export const formatDateType1 = () => { /* 10 Eyl 2019 || Sep 10 2019 */
    if (moment.locale() === 'tr') {
        return 'DD MMM YYYY';
    } else {
        return 'MMM D YYYY'
    }
}

export const formatDateType2 = () => { /* Pazar, 10 Eyl 2019 || Sun, Sep 10 2019 */
    if (moment.locale() === 'tr') {
        return 'ddd, DD MMM YYYY ' + formatOnlyHour();
    } else {
        return 'ddd, MMM D YYYY ' + formatOnlyHour()
    }
}
export const formatDateType3 = () => { /* 15 Aralık || Dec 15 */
    if (moment.locale() === 'tr') {
        return 'DD MMMM';
    } else {
        return 'MMMM DD'
    }
}

export const formatDateType4 = () => { /* 10 Eyl 2019 ||  Sep 10 2019 */
    if (moment.locale() === 'tr') {
        return 'DD MMM YYYY ' + formatOnlyHour();
    } else {
        return 'MMM D YYYY ' + formatOnlyHour()
    }
}

export const formatOnlyHour = () => { /* 17:00 || 05:00 PM */
    if (moment.locale() === 'tr') {
        return 'HH:mm';
    } else {
        return 'h:mm a'
    }
}

export const formatDoubleHour = () => {
    if (moment.locale() === 'tr') {
        return 'HH:mm-HH:mm';
    } else {
        return 'h:mm a-h:mm a'
    }
}

export const calendarTimeToString=(time)=>{
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}