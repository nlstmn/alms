import React, { useEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActivityAssignmentType from "../../../components/courses/ActivityAssignmentType";
import ActivityDocumentType from "../../../components/courses/ActivityDocumentType";
import Downloader from "../../../components/Downloader";
import { isUserInstructor } from "../../../helpers/StateControls";
import Constants from "../../../services/Constants";

import CourseDetailActions from "../../../redux/CourseDetailRedux";
import ActivityInteractActions from "../../../redux/ActivityInteractRedux";
import CoursesActions from "../../../redux/CoursesRedux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';


import { showMessage, hideMessage } from "react-native-flash-message";
import { errorMessageData, successMessageData } from "../../../helpers/FlashMessageData";
import { strings } from "../../../locales/i18n";
import ActivityVideoType from "../../../components/courses/ActivityVideoType";
import ActivityVirtualClassType from "../../../components/courses/ActivityVirtualClassType";
import ActivityELessonType from "../../../components/courses/ActivityELessonType";
import ActivityLinkType from "../../../components/courses/ActivityLinkType";
import ActivityExamType from "../../../components/courses/ActivityExamType";
import ActivitySurveyType from "../../../components/courses/ActivitySurveyType";
import ActivityForumType from "../../../components/courses/ActivityForumType";

function ActivityDetail(props) {
    const dispatch = useDispatch()

    const main = useSelector(state => state.main)
    const activityInteract = useSelector(state => state.activityInteract)
    const addActivityRedux = useSelector(state => state.addActivity)
    const courseDetail = useSelector(state => state.courseDetail)


    const [activity, setActivity] = useState(props.navigation.getParam('activity'))
    const [classId, setClassId] = useState(props.navigation.getParam('activity').classId)
    const [isMissingDetail, setMissingDetail] = useState(props.navigation.getParam('isMissingDetail'))
    const [selectedFile, setSelectedFile] = useState(null)
    const [downloader, setDownloader] = useState(false)


    useEffect(() => {
        props.navigation.setParams({
            title: main.languageResource.r_page_activity_detail_title || strings('r_page_activity_detail_title')
        })

        getActivityDetail()
        activitySetViewEnrollment()
        StatusBar.setBarStyle("dark-content")

        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white")
        }

        return () => {
            if (props.navigation.getParam('theme')) {
                StatusBar.setBarStyle("light-content")
                if (Platform.OS === "android") {
                    StatusBar.setBackgroundColor("black")
                }
            }
        }

    }, [])

    const initActivityDetailRef = useRef(true)
    useEffect(() => {
        if (initActivityDetailRef.current) {
            initActivityDetailRef.current = false
            return
        }
        if (courseDetail.singleActivityData.length > 0) {
            setMissingDetail(false)
            setActivity(courseDetail.singleActivityData[0])
        }
    }, [courseDetail.singleActivityData])

    const initSendAssignmentAnswerRef = useRef(true)
    useEffect(() => {
        if (initSendAssignmentAnswerRef.current) {
            initSendAssignmentAnswerRef.current = false
            return
        }
        if (courseDetail.sendAssignmentAnswerData.error) {
            var errorString = JSON.parse(courseDetail.sendAssignmentAnswerData.text).generalError[0]
            showMessage(errorMessageData({ message: main.languageResource[errorString] || strings('r_api_assignment_dead_line_passed') }))
            return
        }
        getActivityDetail()
        getEnrollmentProgress()
        activitySetViewEnrollment(activity.completionType)
    }, [courseDetail.sendAssignmentAnswerData])

    const initViewCompletionRef = useRef(true)
    useEffect(() => {
        if (initViewCompletionRef.current) {
            initViewCompletionRef.current = false
            return
        }
        getEnrollmentProgress()
    }, [activityInteract.viewCompletionCriteriaData])


    const activitySetViewEnrollment = (activityCompletionType = 1) => {
        const requestBody = {
            "almsPlusApiUrl": main.selectedOrganization.almsPlusApiUrl,
            "accessToken": main.authData.access_token,
            "data": null
        }
        if (isMissingDetail) {
            requestBody.data = JSON.stringify({
                "activityCompletionType": activityCompletionType,
                "activityId": activity.activityId,
                "classId": activity.classId
            })
        } else {
            requestBody.data = JSON.stringify({
                "activityCompletionType": activityCompletionType,
                "activityId": activity.activityId,
                "classId": isUserInstructor(main.userIdentity)
                    ? addActivityRedux.classInformation[0].value
                    : courseDetail.course.classId
            })
        }
        dispatch(ActivityInteractActions.activityCompletionViewCriteriaRequest(requestBody))
    }


    const getActivityDetail = () => {
        const requestBody = {
            remote: true,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: null,
            single: true

        }
        if (isMissingDetail) {
            requestBody.data = JSON.stringify({
                "GetActivityType": 1,
                "ClassId": activity.classId,
                "CourseId": activity.courseId,
                "ActivityId": activity.activityId,
                "TermWeekId": "",
                "take": 100,
                "skip": 0,
            })
        } else {
            requestBody.data = JSON.stringify({
                "GetActivityType": 1,
                "ClassId": isUserInstructor(main.userIdentity)
                    ? addActivityRedux.classInformation[0].value
                    : courseDetail.course.classId,
                "CourseId": courseDetail.course.courseId,
                "ActivityId": activity.activityId,
                "TermWeekId": "",
                "take": 100,
                "skip": 0,
            })
        }
        dispatch(CourseDetailActions.getActivityListRequest(requestBody))
    }

    const getEnrollmentProgress = () => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            remote: true,
        }
        dispatch(CoursesActions.getEnrollmentProgressRequest(requestBody))
    }



    // TODO: CourseDetail.js ile ayni olmali!
    const _renderContent = () => {
        switch (activity.activityType) {
            case Constants.ActivityType.Document:
                return <ActivityDocumentType
                    activity={activity}
                    navigation={props.navigation}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }} />
            case Constants.ActivityType.Assignment:
                return <ActivityAssignmentType
                    activity={activity}
                    navigation={props.navigation}
                    detail
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }}
                />
            case Constants.ActivityType.Video:
                return <ActivityVideoType
                    activity={activity}
                    navigation={props.navigation} />
            case Constants.ActivityType.VirtualClass:
                return <ActivityVirtualClassType
                    activity={activity}
                    navigation={props.navigation}
                    classId={classId}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }}
                />
            case Constants.ActivityType.Elesson:
                return <ActivityELessonType
                    activity={activity}
                    navigation={props.navigation}
                    classId={classId}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }} />
            case Constants.ActivityType.LinkActivity:
                return <ActivityLinkType
                    activity={activity}
                    navigation={props.navigation} />
            case Constants.ActivityType.Exam:
                return <ActivityExamType
                    activity={activity}
                    navigation={props.navigation}
                    classId={classId} />
            case Constants.ActivityType.Survey:
                return <ActivitySurveyType
                    activity={activity}
                    navigation={props.navigation}
                    classId={classId} />
            case Constants.ActivityType.Forum:
                return <ActivityForumType
                    activity={activity}
                    navigation={props.navigation}
                    classId={classId}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }} />
            default: return null
        }
    }

    const _renderDownloader = () => {
        return downloader && <Downloader file={selectedFile} accessToken={main.authData.access_token}
            onclose={() => {
                setSelectedFile(null)
                setDownloader(false)
            }} onCancel={() => {
                setSelectedFile(null)
                setDownloader(false)
            }} />
    }
    return (
        <View style={{ flex: 1 }}>
            {!isMissingDetail && _renderContent()}
            {_renderDownloader()}
        </View>
    )
}
ActivityDetail.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        title: params.title,
        headerLeft: (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" color="black" size={25} onPress={() => {
                    const backActions = NavigationActions.back({
                        key: null
                    });
                    navigation.dispatch(backActions)
                }} />
            </View>
        ),
    }
}
export default ActivityDetail