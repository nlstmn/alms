import React, { useState, useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';
import CourseActivityProgress from '../../../../components/courses/CourseActivityProgress';
import CourseAnnouncements from '../../../../components/courses/CourseAnnouncements';

import { useDispatch, useSelector } from 'react-redux';
import CoursesDetail from '../../../../redux/CourseDetailRedux';
import AddActivityTypes from '../../../../redux/AddActivityRedux';

import { isUserInstructor, isUserStudent } from '../../../../helpers/StateControls';

import NetInfo from '@react-native-community/netinfo';
import Colors from '../../../../theme/Colors';

function CourseHome(props) {
    const dispatch = useDispatch()
    const [progress, setProgress] = useState(null)
    const [announcement, setAnnouncement] = useState([])

    const main = useSelector(state => state.main)
    const courseDetail = useSelector(state => state.courseDetail)
    const addActivityRedux = useSelector(state => state.addActivity)


    useEffect(() => {
        if (isUserStudent(main.userIdentity)) {
            getTopCompletedActivity()
        }
        if (isUserInstructor(main.userIdentity)) {
            getClassInformation()
        } else {
            getLessonAnnouncement(props.screenProps.course.classId)
        }
    }, [])

    useEffect(() => {
        setProgress(courseDetail.topCompletedActivityData)
    }, [courseDetail.topCompletedActivityData])

    const initCourseAnnouncementRef = useRef(true)
    useEffect(() => {
        if (initCourseAnnouncementRef.current) {
            initCourseAnnouncementRef.current = false
            return
        }
        setAnnouncement(courseDetail.courseAnnouncementData)
    }, [courseDetail.courseAnnouncementData])

    const initiClassInformationRef = useRef(true)
    useEffect(() => {
        if (initiClassInformationRef.current) {
            initiClassInformationRef.current = false
            return
        }
        if (addActivityRedux.classInformation?.length > 0) {
            getLessonAnnouncement(addActivityRedux.classInformation[0].value)
        }

    }, [addActivityRedux.classInformation])

    const getClassInformation = () => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: JSON.stringify({
                "CourseId": props.screenProps.course.courseId,
                "SearchedText": "",
                "Take": 1,
                "Skip": 0
            })
        }
        dispatch(AddActivityTypes.getClassInformationRequest(requestBody))
    }

    const getTopCompletedActivity = () => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: {
                "classId": props.screenProps.course.classId,
                "take": 10,
                "skip": 0
            }
        }
        dispatch(CoursesDetail.topCompletedActivityRequest(requestBody))
    }

    const getLessonAnnouncement = (contextId) => {
        const requestBody = {
            remote: true,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: JSON.stringify({
                "take": 5,
                "skip": 0,
                "items": [
                    {
                        "contextType": 16,
                        "contextId": contextId
                    }
                ],
                "state": 1,
                "address": main.selectedOrganization.hostAddress,
                "port": 3000
            })
        }

        NetInfo.fetch().then(statu => {
            if (!statu.isConnected) {
                requestBody.remote = false;
            }
            dispatch(CoursesDetail.getCourseAnnouncementRequest(requestBody))
        });

    }

    return (
        <ScrollView contentContainerStyle={{  backgroundColor: Colors.background }}>
            {isUserStudent(main.userIdentity) &&
                <CourseActivityProgress data={progress} />
            }
            {announcement.length > 0 && <CourseAnnouncements data={announcement} navigation={props.navigation} />}


        </ScrollView>
    )
}


export default CourseHome