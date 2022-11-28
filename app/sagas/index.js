import { takeLatest, all } from 'redux-saga/effects';

import OrganizationApi from '../services/OrganizationApi';
import LoginApi from '../services/LoginApi';
import AnnouncementApi from '../services/AnnouncementApi';
import CourseApi from '../services/CourseApi';
import MenuApi from '../services/MenuApi';
import MainApi from '../services/MainApi'
import ScheduleApi from '../services/ScheduleApi';
import MessagesApi from '../services/MessagesApi';
import AddActivityApi from '../services/AddActivityApi';
import SettingsApi from '../services/SettingsApi';
import ActivityInteractApi from '../services/ActivityInteractApi';

/* ------------- Types ------------- */
import { OrganizationTypes } from '../redux/OrganizationRedux';
import { LoginTypes } from '../redux/LoginRedux';
import { AnnouncementTypes } from '../redux/AnnouncementRedux';
import { CoursesTypes } from '../redux/CoursesRedux'
import { CourseDetailTypes } from '../redux/CourseDetailRedux';
import { MenuTypes } from '../redux/MenuRedux';
import { MainTypes } from '../redux/MainRedux';
import { SettingsTypes } from '../redux/SettingsRedux';
import { ScheduleTypes } from '../redux/ScheduleRedux';
import { MessagesType } from '../redux/MessagesRedux';
import { AddActivityTypes } from '../redux/AddActivityRedux';
import { ActivityInteractTypes } from '../redux/ActivityInteractRedux';

/* ------------- Sagas ------------- */
import { getOrganizations } from './OrganizationSagas';
import { getAccessToken, getUserIdentity, refreshToken } from './LoginSagas';
import { getListAnnouncement, getDeletedListAnnouncement, getInBoxListAnnouncement, getAnnouncementDetail, downloadAnnouncementAttachment, newAnnouncement, searchAnnouncementReceiver, getSentAnnouncement, announcementChangeState } from './AnnouncementSagas';
import { getEnrolledCoursesList, getEnrollmentProgress, getEnrolledLessonsList } from './CoursesSagas';
import { getCourseAnnouncement, getIncomingActivities, getCourseWeeks, getWeeksActivities, getActivityList, fileDownload, getActivityDetail,getTopCompletedActivity,assignmentSendAnswer } from './CourseDetailSagas';
import { getMenu } from './MenuSagas';
import { getLanguageResources } from './MainSagas';
import { getMyDailyCalender, getCalendarDatas } from './ScheduleSagas';
import { getMessagesGroup, sendMessage, getMessageDetail, deleteMessage, getMyClassMates, search,getMessagesPersonel,getPersons ,getGroups,getMessageOrigin} from './MessagesSagas';
import { getTagsUnit, getTagsCredits, getConditionalActivities, getClassInformation, uploadFile, addActivityType } from './AddActivitySagas';
import { getFileSettings } from './SettingsSagas';
import { saveVideoTracking, activityViewComletionCriteria, saveUnsavedVideoTrackingData,getVideoDetail,connectToAlmsRequest } from './ActivityInteractSagas';


/* ------------- API's ------------- */
const organizationApi = OrganizationApi.create();
const loginApi = LoginApi.create();
const announcementApi = AnnouncementApi.create();
const coursesApi = CourseApi.create();
const menuApi = MenuApi.create();
const mainApi = MainApi.create();
const scheduleApi = ScheduleApi.create();
const messagesApi = MessagesApi.create();
const addActivityApi = AddActivityApi.create();
const settingsApi = SettingsApi.create();
const activityInteractApi = ActivityInteractApi.create();

//all api request actions
export default function* root() {
    yield all([
        takeLatest(OrganizationTypes.GET_ORGANIZATION_REQUEST, getOrganizations, organizationApi),

        takeLatest(LoginTypes.GET_ACCESS_TOKEN_REQUEST, getAccessToken, loginApi),
        takeLatest(LoginTypes.GET_USER_IDENTITY_REQUEST, getUserIdentity, loginApi),
        takeLatest(LoginTypes.REFRESH_TOKEN_REQUEST, refreshToken, loginApi),

        takeLatest(AnnouncementTypes.GET_ANNOUNCEMENT_REQUEST, getListAnnouncement, announcementApi),
        takeLatest(AnnouncementTypes.GET_ANNOUNCEMENT_INBOX_REQUEST, getInBoxListAnnouncement, announcementApi),
        takeLatest(AnnouncementTypes.GET_ANNOUNCEMENT_DELETED_REQUEST, getDeletedListAnnouncement, announcementApi),
        takeLatest(AnnouncementTypes.GET_ANNOUNCEMENT_DETAIL_REQUEST, getAnnouncementDetail, announcementApi),
        takeLatest(AnnouncementTypes.GET_ANNOUNCEMENT_SENT_REQUEST, getSentAnnouncement, announcementApi),
        takeLatest(AnnouncementTypes.DOWNLOAD_ANNOUNCEMENT_ATTACHMENT_REQUEST, downloadAnnouncementAttachment, announcementApi),
        takeLatest(AnnouncementTypes.ADD_ANNOUNCEMENT_REQUEST, newAnnouncement, announcementApi),
        takeLatest(AnnouncementTypes.SEARCH_ANNOUNCEMENT_RECEIVER_REQUEST, searchAnnouncementReceiver, announcementApi),
        takeLatest(AnnouncementTypes.ANNOUNCEMENT_CHANGE_STATE_REQUEST, announcementChangeState, announcementApi),

        takeLatest(CoursesTypes.GET_COURSES_REQUEST, getEnrolledCoursesList, coursesApi),
        takeLatest(CoursesTypes.GET_LESSONS_REQUEST, getEnrolledLessonsList, coursesApi),
        takeLatest(CoursesTypes.GET_ENROLLMENT_PROGRESS_REQUEST, getEnrollmentProgress, coursesApi),

        takeLatest(CourseDetailTypes.GET_COURSE_ANNOUNCEMENT_REQUEST, getCourseAnnouncement, coursesApi),
        takeLatest(CourseDetailTypes.GET_INCOMING_ACTIVITIES_REQUEST, getIncomingActivities, coursesApi),
        takeLatest(CourseDetailTypes.GET_COURSE_WEEKS_REQUEST, getCourseWeeks, coursesApi),
        takeLatest(CourseDetailTypes.GET_WEEKS_ACTIVITIES_REQUEST, getWeeksActivities, coursesApi),
        takeLatest(CourseDetailTypes.GET_ACTIVITY_LIST_REQUEST, getActivityList, coursesApi),
        takeLatest(CourseDetailTypes.FILE_DOWNLOAD_REQUEST, fileDownload, coursesApi),
        takeLatest(CourseDetailTypes.ACTIVITY_DETAIL_REQUEST, getActivityDetail, coursesApi),
        takeLatest(CourseDetailTypes.TOP_COMPLETED_ACTIVITY_REQUEST,getTopCompletedActivity,coursesApi),
        takeLatest(CourseDetailTypes.SEND_ASSIGNMENT_ANSWER_REQUEST,assignmentSendAnswer,coursesApi),

        takeLatest(MenuTypes.GET_MENU_REQUEST, getMenu, menuApi),
        takeLatest(MainTypes.GET_LANGUAGE_RESOURCE_REQUEST, getLanguageResources, mainApi),

        takeLatest(ScheduleTypes.GET_MY_DAILY_CALENDER_REQUEST, getMyDailyCalender, scheduleApi),
        takeLatest(ScheduleTypes.GET_CALENDAR_DATA_REQUEST, getCalendarDatas, scheduleApi),

        takeLatest(MessagesType.GET_MESSAGES_GROUPS_REQUEST, getMessagesGroup, messagesApi),
        takeLatest(MessagesType.SEND_MESSAGE_REQUEST, sendMessage, messagesApi),
        takeLatest(MessagesType.GET_MESSAGE_DETAIL_REQUEST, getMessageDetail, messagesApi),
        takeLatest(MessagesType.DELETE_MESSAGE_REQUEST, deleteMessage, messagesApi),
        takeLatest(MessagesType.GET_MY_CLASS_MATES_REQUEST, getMyClassMates, messagesApi),
        takeLatest(MessagesType.SEARCH_REQUEST, search, messagesApi),
        takeLatest(MessagesType.GET_MESSAGES_PERSONEL_REQUEST, getMessagesPersonel, messagesApi),
        takeLatest(MessagesType.GET_PERSONS_REQUEST, getPersons, messagesApi),
        takeLatest(MessagesType.GET_GROUPS_REQUEST, getGroups, messagesApi),
        takeLatest(MessagesType.GET_MESSAGE_ORIGIN_REQUEST, getMessageOrigin, messagesApi),


        takeLatest(AddActivityTypes.GET_TAGS_UNIT_REQUEST, getTagsUnit, addActivityApi),
        takeLatest(AddActivityTypes.GET_TAGS_CREDITS_REQUEST, getTagsCredits, addActivityApi),
        takeLatest(AddActivityTypes.CONDITIONAL_ACTIVITIES_REQUEST, getConditionalActivities, addActivityApi),
        takeLatest(AddActivityTypes.GET_CLASS_INFORMATION_REQUEST, getClassInformation, addActivityApi),
        takeLatest(AddActivityTypes.UPLOAD_FILE_REQUEST, uploadFile, addActivityApi),
        takeLatest(AddActivityTypes.ADD_ACTIVITY_TYPE_REQUEST, addActivityType, addActivityApi),


        takeLatest(SettingsTypes.GET_FILE_SETTINGS_REQUEST, getFileSettings, settingsApi),

        takeLatest(ActivityInteractTypes.SAVE_VIDEO_TRACKING_REQUEST, saveVideoTracking, activityInteractApi),
        takeLatest(ActivityInteractTypes.ACTIVITY_COMPLETION_VIEW_CRITERIA_REQUEST, activityViewComletionCriteria, activityInteractApi),
        takeLatest(ActivityInteractTypes.SAVE_UNSAVED_VIDEO_TRACKING_DATA, saveUnsavedVideoTrackingData, activityInteractApi),
        takeLatest(ActivityInteractTypes.GET_VIDEO_DETAIL_REQUEST, getVideoDetail, activityInteractApi),
        takeLatest(ActivityInteractTypes.CONNECT_TO_ALMS_REQUEST, connectToAlmsRequest, activityInteractApi),

    ])
}
