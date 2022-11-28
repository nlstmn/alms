import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AnnouncementItem from '../../../../components/announcement/AnnouncementItem';
import NetInfo from '@react-native-community/netinfo';
import CoursesDetail from '../../../../redux/CourseDetailRedux';
import EmptyPage from '../../../../components/EmptyPage';
import { isUserInstructor } from '../../../../helpers/StateControls';
import Constants from '../../../../services/Constants';
import { strings } from '../../../../locales/i18n';


function CourseAnnouncement(props) {
    const dispatch = useDispatch()
    const [lessonAnnouncement, setLessonAnnouncement] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const main = useSelector(state => state.main)
    const loader = useSelector(state => state.loader)
    const courseDetail = useSelector(state => state.courseDetail)
    const addActivityRedux = useSelector(state => state.addActivity)

    const [take, setTake] = useState(Constants.ApiResponseQuantity)
    const [skip, setSkip] = useState(0)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        callApi()
    }, [])

    const initSkip = useRef(true)
    useEffect(() => {
        if (initSkip.current) {
            initSkip.current = false
            return
        }
        if (skip === 0) return

        console.log("pagination")
        callApi()
    }, [skip])


    const initCourseAnnouncementRef = useRef(true)
    useEffect(() => {
        if (initCourseAnnouncementRef.current) {
            initCourseAnnouncementRef.current = false
            return
        }
        if (refreshing) {
            setLessonAnnouncement(courseDetail.courseAllAnnouncementData)
        } else {
            setLessonAnnouncement(lessonAnnouncement ? [...lessonAnnouncement, ...courseDetail.courseAllAnnouncementData] : courseDetail.courseAllAnnouncementData)
        }

        setRefreshing(false)
    }, [courseDetail.courseAllAnnouncementData])

    const callApi = (skipParam = skip) => {
        if (isUserInstructor(main.userIdentity)) {
            getLessonAnnouncements(true, addActivityRedux.classInformation[0].value, skipParam)
        } else {
            getLessonAnnouncements(true, props.screenProps.course.classId, skipParam)
        }
    }

    const getLessonAnnouncements = (loader = true, contextId, skipParam = skip) => {
        const requestBody = {
            loader: loader,
            remote: true,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: JSON.stringify({
                "take": take,
                "skip": skipParam,
                "items": [
                    {
                        "contextType": 16,
                        "contextId": contextId
                    },
                    // {
                    //     "contextType": 8,
                    //     "contextId": props.screenProps.course.courseId
                    // }
                ],
                "state": 1,
                "address": main.selectedOrganization.hostAddress,
                "port": 3000
            }),
            type: 2
        }

        NetInfo.fetch().then(statu => {
            if (!statu.isConnected) {
                requestBody.remote = false;
            }
            dispatch(CoursesDetail.getCourseAnnouncementRequest(requestBody))
        });
    }

    const _onRefresh = () => {
        setRefreshing(true)
        setSkip(0)
        callApi(0)
    }

    const _renderMoreItem = () => {
        if (lessonAnnouncement.length % Constants.ApiResponseQuantity === 0) {
            console.log("_renderMoreItem")
            if (scrolled) {
                setSkip(skip + Constants.ApiResponseQuantity)
            }
            setScrolled(false)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {lessonAnnouncement && lessonAnnouncement.length > 0 &&
                <FlatList
                    contentContainerStyle={{ paddingTop: 5 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={lessonAnnouncement}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => _onRefresh()} />}
                    onEndReached={() => _renderMoreItem()}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={Constants.ApiResponseQuantity}
                    onMomentumScrollBegin={() => {
                        console.log("onMomentumScrollBegin")
                        setScrolled(true)
                    }}
                    renderItem={({ item, index }) => (
                        <View key={index}>
                            <AnnouncementItem announcement={item} navigation={props.navigation} refresh={() => { }} />
                        </View>
                    )}
                />}
            {lessonAnnouncement && lessonAnnouncement.length == 0 && <EmptyPage description={main.languageResource.r_page_course_announcement_empty_title || strings('r_page_course_announcement_empty_title')} />}

        </View>
    )
}

export default CourseAnnouncement