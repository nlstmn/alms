
import { showMessage, hideMessage } from "react-native-flash-message";
import { strings } from "../locales/i18n";
import { warningMessageData } from "./FlashMessageData";


export function addAnnouncementValidation(announcement,selectedReceiver) {
    if (announcement.title.length === 0) {
        showMessage(warningMessageData({ message: strings('r_new_announcement_title_validation_text') }))
        return false
    }
    if (announcement.content.length === 0) {
        showMessage(warningMessageData({ message: strings('r_new_announcement_content_validation_text') }))
        return false
    }
    if (selectedReceiver.length === 0) {
        showMessage(warningMessageData({ message: strings('r_new_announcement_recipient_validation_text') }))
        return false
    }

    if (announcement.isShowDateRange && (announcement.endDate == null || announcement.startDate == null)) {
        showMessage(warningMessageData({ message: strings('r_new_announcement_date_validation_text') }))
        return false
    }

    return true
}