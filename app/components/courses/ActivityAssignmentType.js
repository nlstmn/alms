import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppTheme from "../../theme/AppTheme";
import Colors from "../../theme/Colors";
import ActivityAttachments from "../ActivityAttachments";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import TextView from "../TextView";
import Moment from 'moment';
import { strings } from "../../locales/i18n";
import { template } from "../../locales/StringTemplate";
import Constants from "../../services/Constants";
import styles from "../../theme/Style";
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';
import ActivityInteractActions from '../../redux/ActivityInteractRedux';
import CourseDetailActions from '../../redux/CourseDetailRedux';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
import Uploader from "../Uploader";
import { createGuid } from "../../helpers/Calculate";
import { isUserInstructor, isUserStudent } from "../../helpers/StateControls";
import { showMessage, hideMessage } from "react-native-flash-message";
import { warningMessageData } from "../../helpers/FlashMessageData";
import ActivityCardImage from "../ActivityCardImage";


function ActivityAssignmentType(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const activityInteract = useSelector(state => state.activityInteract)
    const courses = useSelector(state => state.courses)
    const courseDetail = useSelector(state => state.courseDetail)


    const [activity, setActivity] = useState(props.activity)
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedFileId, setSelectedFileId] = useState(null)
    const [uploaderVisibility, setUploaderVisibility] = useState(false)

    const initActivity = useRef(true)
    useEffect(() => {
        if (initActivity.current) {
            initActivity.current = false
            return
        }
        setActivity(props.activity)
        setSelectedFile(null)
        setSelectedFileId(null)
    }, [props.activity])


    const setAsCompleted = () => {
        const requestBody = {
            "almsPlusApiUrl": main.selectedOrganization.almsPlusApiUrl,
            "accessToken": main.authData.access_token,
            "data": JSON.stringify({
                "activityCompletionType": activity.completionType,
                "activityId": activity.activityId,
                "classId": courseDetail.course.classId
            })
        }
        dispatch(ActivityInteractActions.activityCompletionViewCriteriaRequest(requestBody))
    }

    const callAssignmentAnswerApi = () => {
        const enrollmentData = courses.enrollmentProgressData.find(data => data.activityId === activity.activityId)
        const requestBody = {
            "almsPlusApiUrl": main.selectedOrganization.almsPlusApiUrl,
            "accessToken": main.authData.access_token,
            "data": JSON.stringify({
                "EnrollmentId": enrollmentData.enrollmentId,
                "FileUploadKey": selectedFileId,
                "Answer": "",
                "ActivityId": activity.activityId,
                "ClassId": courseDetail.course.classId
            })
        }
        dispatch(CourseDetailActions.sendAssignmentAnswerRequest(requestBody))
    }

    const sendAssignmentAnswerFile = () => {
        if (selectedFile) {
            setUploaderVisibility(true)
        } else {
            showMessage(warningMessageData({ message: "Dosya seçmelisiniz." }))
        }
    }
    const openFilePicker = async () => {
        if (Moment(Moment()).isAfter(activity.taskDeadLine)) {
            return
        }
        try {
            const res = await DocumentPicker.pick({
                type: Platform.OS === "android" ? Constants.AndroidMimeTypes : Constants.IOSMimeTypes,
            });
            console.log("selected res: ", res);
            setSelectedFile(res)
            setSelectedFileId(createGuid())
        } catch (error) {
            console.log("error : ", error)
        }
    }

    const _renderDueDate = () => {
        if (activity.taskDeadLine !== null) {
            var curDate = Moment();
            var isAfter = Moment(curDate).isAfter(activity.taskDeadLine);
            if (isAfter) {
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TextView weight="bold" style={style.dueDateText}>
                            {main.languageResource.r_activity_due_date || strings('r_activity_due_date')}
                        </TextView>
                        <TextView weight="regular" style={style.dueDateData}>
                            {main.languageResource.r_activiy_due_outdate_day !== undefined
                                ? template(main.languageResource.r_activiy_due_outdate_day, { day: curDate.diff(activity.taskDeadLine, 'days') })
                                : curDate.diff(activity.taskDeadLine, 'days') !== 0
                                    ? template(strings('r_activiy_due_outdate_day'), { day: curDate.diff(activity.taskDeadLine, 'days') })
                                    : main.languageResource.r_activity_due_date_yesterday || strings('r_activity_due_date_yesterday')
                            }
                        </TextView>
                    </View>
                );
            } else {
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TextView weight="bold" style={{ fontSize: 12 }}>
                            {main.languageResource.r_activity_due_date || strings('r_activity_due_date')}
                        </TextView>
                        <TextView weight="regular" style={{ fontSize: 12, marginStart: 5 }}>
                            {Moment(activity.taskDeadLine).format('D MMMM, HH:mm')}
                        </TextView>
                    </View>
                );
            }
        }
        else
            return null;
    }

    const _renderCompletionIcon = () => {
        const enrollmentData = courses.enrollmentProgressData.find(data => data.activityId === activity.activityId)
        if (enrollmentData) {
            if (enrollmentData.status === Constants.ActivityCompletedStatus.Completed)
                return <View style={{ alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                    <Ionicons name="ios-checkmark" size={styles.marked_completed_activity_icon_size} color="white" />
                </View>
        } else return null;
    }

    const _renderCardHeader = () => {
        return (
            <View style={style.cardHeaderContainer}>
                <MaterialIcons name="assignment" size={25} color="black" />
                <View style={style.cardHeaderTextContainer}>
                    <TextView weight="bold" numberOfLines={2} style={style.cardHeaderText}>{activity.name}</TextView>
                    {_renderDueDate()}
                </View>
                {_renderCompletionIcon()}
            </View>
        )
    }

    const _renderCardContainer = () => {
        return (
            <View style={{ flexDirection: 'column' }}>
                <ActivityCardImage cardImgName={activity.cardImgName} activityType={activity.activityType} />
                {activity.description != null ?
                    <View style={{ padding: 10 }} >
                        <HTML source={{ html: activity.description }} baseFontStyle={AppTheme.activityHtmlDescriptionBaseStyle} />
                    </View>
                    : null}
            </View>
        )
    }
    
    const _renderStudentAnswers = () => {
        const enrollmentData = courses.enrollmentProgressData.find(data => data.activityId === activity.activityId)
        return isUserStudent(main.userIdentity) && (activity.completionType === Constants.ActivityCompletionTypes.View || activity.completionType === Constants.ActivityCompletionTypes.Upload || activity.completionType === Constants.ActivityCompletionTypes.Grade) && (
            <View style={{ padding: 10, marginStart: 10, marginEnd: 10 }} >
                <TextView weight="bold" style={{ color: "black", fontSize: 16, marginBottom: 10 }} >{main.languageResource.r_activitiy_uploaded_files || strings('r_activitiy_uploaded_files')}</TextView>
                <ActivityAttachments
                    single
                    files={activity.file.filter(f => f.ownerType === 2)}
                    selectedFile={(file) => props.selectedFile(file)} />
                {
                    enrollmentData?.uploadCount != activity.assignmentMaximumUploadCount &&
                    <TouchableOpacity
                        style={{ borderWidth: 0.3, padding: 10, backgroundColor: "#eeede9", borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => openFilePicker()}>
                        <Ionicons name="ios-attach" size={20} />
                        {
                            selectedFile
                                ?
                                <View style={{ flexDirection: "row", alignItems: "center", marginStart: 10, marginEnd: 10 }}>
                                    <TextView style={{ flex: 1 }} numberOfLines={1} ellipsizeMode={'middle'} >{selectedFile.name}</TextView>
                                    <TouchableOpacity style={{ paddingStart: 10, paddingEnd: 10 }} onPress={() => setSelectedFile(null)}>
                                        <Icon name={"ios-close"} type={"ionicon"} />
                                    </TouchableOpacity>
                                </View>
                                : <TextView style={{ marginStart: 5 }}>{strings('r_activity_answer_by_file_upload')}</TextView>
                        }

                    </TouchableOpacity>
                }
                <TextView weight="medium" style={{ fontSize: 12, marginTop: 5 }}>{"Dosya yükleme hakkı : " + (enrollmentData?.uploadCount || 0) + " / " + activity.assignmentMaximumUploadCount}</TextView>

            </View>
        )

    }

    const _renderActionButtons = () => {
        const enrollmentData = courses.enrollmentProgressData.find(data => data.activityId === activity.activityId)
        // if (activity.completionType === Constants.ActivityCompletionTypes.View)
        //     if (enrollmentData && enrollmentData.status === Constants.ActivityCompletedStatus.Completed) {
        //         if (!props.detail) {
        //             return (
        //                 <TouchableOpacity
        //                     activeOpacity={0.7}
        //                     onPress={() => props.navigation.navigate('activityDetail', { activity })}
        //                     style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }} >
        //                     <TextView weight="bold" style={{ color: 'black', fontSize: 16, marginBottom: 5 }}>{main.languageResource.r_activity_detail_button_text || strings('r_activity_detail_button_text')}</TextView>
        //                     <Ionicons name={props.detail ? "md-checkmark" : "ios-arrow-forward"} size={25} color="black" style={{ marginStart: 5, marginEnd: 5 }} />
        //                 </TouchableOpacity>
        //             )
        //         } else {
        //             return null
        //         }
        //     } else {
        //         if (!isUserInstructor(main.userIdentity)) {
        //             return (
        //                 <TouchableOpacity
        //                     activeOpacity={0.7}
        //                     onPress={() => setAsCompleted()}
        //                     style={{ flexDirection: 'row', padding: 10, flex: 0.5, justifyContent: 'flex-end', alignItems: 'center' }} >
        //                     <Ionicons name="md-checkmark" size={25} color="black" style={{ marginEnd: 5 }} />
        //                     <TextView weight="bold" style={{ color: 'black', fontSize: 16 }}>
        //                         {main.languageResource.r_activity_complete_button_text || strings('r_activity_complete_button_text')}
        //                     </TextView>
        //                 </TouchableOpacity>
        //             )
        //         } else {
        //             return null
        //         }
        //     }
        if (activity.completionType === Constants.ActivityCompletionTypes.View ||activity.completionType === Constants.ActivityCompletionTypes.Upload || activity.completionType === Constants.ActivityCompletionTypes.Grade)
            if (!props.detail) {
                return <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => props.navigation.navigate('activityDetail', { activity })}
                    style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }} >
                    <TextView weight="bold" style={{ color: 'black', fontSize: 16, marginBottom: 5 }}>{main.languageResource.r_activity_detail_button_text || strings('r_activity_detail_button_text')}</TextView>
                    <Ionicons name={props.detail ? "md-checkmark" : "ios-arrow-forward"} size={25} color="black" style={{ marginStart: 5, marginEnd: 5 }} />
                </TouchableOpacity>
            } else {
                if (activity.completionType === Constants.ActivityCompletionTypes.Grade && enrollmentData?.uploadCount == activity.assignmentMaximumUploadCount) {
                    return null
                }
                if (Moment(Moment()).isAfter(activity.taskDeadLine)) {
                    return null
                }
                return enrollmentData && enrollmentData.status === Constants.ActivityCompletedStatus.Completed && enrollmentData?.uploadCount == activity.assignmentMaximumUploadCount
                    ? null
                    :
                    !(props.detail && isUserInstructor(main.userIdentity)) && <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (props.detail) {
                                sendAssignmentAnswerFile()
                            } else {
                                props.navigation.navigate('activityDetail', { activity })
                            }
                        }}
                        style={{ flexDirection: 'row', padding: 10, flex: 0.5, justifyContent: 'flex-end', alignItems: 'center' }} >
                        <Ionicons name={props.detail ? "md-checkmark" : "ios-arrow-forward"} size={25} color="black" style={{ marginEnd: 5 }} />
                        <TextView weight="bold" style={{ color: 'black', fontSize: 16 }}>

                            {props.detail
                                ? main.languageResource.r_activity_answer_button_text || strings('r_activity_answer_button_text')
                                : main.languageResource.r_activity_detail_button_text || strings('r_activity_detail_button_text')}
                        </TextView>
                    </TouchableOpacity>
            }
        else return null;
    }
    const _renderUploader = () => {
        return uploaderVisibility && (
            <Uploader
                uploadingData={{
                    "almsPlusApiUrl": main.selectedOrganization.almsPlusApiUrl,
                    "accessToken": main.authData.access_token,
                    "selectedFile": selectedFile,
                    "fileUploadId": selectedFileId
                }}
                visibility={uploaderVisibility}
                onCancel={() => {
                    setUploaderVisibility(false)
                }}
                onError={() => {
                    setUploaderVisibility(false)
                }}
                uplaodingProgress={() => { }}
                onSuccess={() => {
                    console.log("onSuccess")
                    setUploaderVisibility(false)
                    callAssignmentAnswerApi()
                }}
            />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps={"handled"}>
                <View style={AppTheme.activityTypeStyle}>
                    {/* Card Header */}
                    {_renderCardHeader()}

                    {/* Card Container */}
                    {_renderCardContainer()}

                    {/* Card Attachments */}
                    <ActivityAttachments
                        titleEnabled
                        files={activity.file.filter(f => f.ownerType === 4)}
                        selectedFile={(file) => props.selectedFile(file)} />

                    {/* Student Answers */}
                    {props.detail && _renderStudentAnswers()}

                    {/* {this._renderAnswerContent()} */}

                    <View style={{ marginTop: 20, height: 1, backgroundColor: Colors.lineColor }} />

                    {/* Card Action Button */}
                    {_renderActionButtons()}
                    {_renderUploader()}
                </View>
            </ScrollView>
        </View >
    )
}
export default ActivityAssignmentType

const style = StyleSheet.create({
    dueDateText: {
        fontSize: 13,
        color: Colors.activity_due_date_past
    },
    dueDateData: {
        fontSize: 13,
        marginStart: 5,
        color: Colors.activity_due_date_past
    },
    activityDescription: {
        padding: 10
    },
    downloadButtons: {
        flex: 0.5,
        justifyContent: 'center',
        marginStart: 5
    },
    cardHeaderContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: "center"
    },
    cardHeaderTextContainer: {
        flex: 1,
        flexDirection: 'column',
        marginStart: 5
    },
    cardHeaderText: {
        color: 'black',
        fontSize: 18
    }
})