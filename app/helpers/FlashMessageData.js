import { strings } from "../locales/i18n"


export const successMessageData = ({ title = strings('r_alert_success_text'), message }) => {
    return {
        message: title,
        description: message,
        type: "success",
        backgroundColor: "#43b581",
        color: "#ffffff",

    }
}

export const errorMessageData = ({ title = strings('r_alert_error_text'), message }) => {
    return {
        message: title,
        description: message,
        type: "danger",
        backgroundColor: "#f86f62",
        color: "#ffffff",

    }
}

export const warningMessageData = ({ title = strings('r_alert_warning_text'), message }) => {
    return {
        message: title,
        description: message,
        type: "info",
        backgroundColor: "#ffc108",
        color: "#ffffff"
    }
}