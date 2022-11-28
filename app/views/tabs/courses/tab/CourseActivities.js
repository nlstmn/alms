import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Dimensions, Platform, TouchableOpacity, FlatList, RefreshControl, Text } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import Colors from "../../../../theme/Colors";
import CourseDetailActions from '../../../../redux/CourseDetailRedux';
import CoursesActions from '../../../../redux/CoursesRedux';

import { isUserInstructor } from "../../../../helpers/StateControls";
import TextView from "../../../../components/TextView";
import FontSize from "../../../../theme/FontSize";
import { strings } from "../../../../locales/i18n";
import { template } from "../../../../locales/StringTemplate";
import moment from "moment";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import ActionSheet from 'react-native-actionsheet';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

import Constants from "../../../../services/Constants";
import Downloader from "../../../../components/Downloader";
import EmptyPage from "../../../../components/EmptyPage";


//Activity types
import ActivityDocumentType from '../../../../components/courses/ActivityDocumentType';
import ActivityAssignmentType from '../../../../components/courses/ActivityAssignmentType';
import ActivityELessonType from '../../../../components/courses/ActivityELessonType';
import ActivityVideoType from '../../../../components/courses/ActivityVideoType';
import ActivitySurveyType from '../../../../components/courses/ActivitySurveyType';
import ActivityLinkType from '../../../../components/courses/ActivityLinkType';
import ActivityExamType from '../../../../components/courses/ActivityExamType';
import ActivityVirtualClassType from '../../../../components/courses/ActivityVirtualClassType';
import ActivityForumType from "../../../../components/courses/ActivityForumType";

function CourseActivities(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const addActivityRedux = useSelector(state => state.addActivity)
    const courseDetail = useSelector(state => state.courseDetail)
    const coursesRedux = useSelector(state => state.courses)
    const activityInteract = useSelector(state => state.activityInteract)

    const [width, setWidth] = useState(Dimensions.get('window').width)
    const actionSheetRef = useRef()

    const [courseWeeks, setCourseWeeks] = useState([])
    const [selectedWeek, setSelectedWeek] = useState(null)
    const [menuPosition, setMenuPosition] = useState(0)
    const [activityList, setActivityList] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [downloader, setDownloader] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const [take, setTake] = useState(Constants.ApiResponseQuantity)
    const [skip, setSkip] = useState(0)
    const [pageInit, setPageInit] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setPageInit(true)
        getEnrollmentProgress()
    }, [])

    const initSkip = useRef(true)
    useEffect(() => {
        if (initSkip.current) {
            initSkip.current = false
            return
        }
        if (skip === 0) return

        console.log("pagination")
        getWeekActivities()
    }, [skip])

    const initEnrollmentProgress = useRef(true)
    useEffect(() => {
        if (initEnrollmentProgress.current) {
            initEnrollmentProgress.current = false
            return
        }
        if (pageInit) {
            getCourseWeeks()
        }

    }, [coursesRedux.enrollmentProgressData])

    const initCourseWeeks = useRef(true)
    useEffect(() => {
        if (initCourseWeeks.current) {
            initCourseWeeks.current = false
            return
        }
        setSelectedWeek(courseDetail.courseWeeks[menuPosition])
        setCourseWeeks(courseDetail.courseWeeks)
    }, [courseDetail.courseWeeks])

    const initActivityList = useRef(true)
    useEffect(() => {
        if (initActivityList.current) {
            initActivityList.current = false
            return
        }

        if (refreshing) {
            setActivityList(courseDetail.activityList)
        } else {
            setActivityList(activityList ? [...activityList, ...courseDetail.activityList] : courseDetail.activityList)
        }

        setRefreshing(false)
        setPageInit(false)
    }, [courseDetail.activityList])


    const initSelectedWeeks = useRef(true)
    useEffect(() => {
        if (initSelectedWeeks.current) {
            initSelectedWeeks.current = false
            return
        }
        getWeekActivities()
    }, [selectedWeek])

    const initActivityCompletionRef = useRef(true)
    useEffect(() => {
        if (initActivityCompletionRef.current) {
            initActivityCompletionRef.current = false
            return
        }
        if (activityInteract.viewCompletionCriteriaData.length > 0) {
            dispatch(CoursesActions.setEnrollmentProgressData(activityInteract.viewCompletionCriteriaData[0]))
        }
    }, [activityInteract.viewCompletionCriteriaData])


    const getEnrollmentProgress = () => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            remote: true,
        }
        dispatch(CoursesActions.getEnrollmentProgressRequest(requestBody))
    }

    const getCourseWeeks = () => {
        const requestBody = {
            remote: true,
            classId: isUserInstructor(main.userIdentity)
                ? addActivityRedux.classInformation[0].value
                : courseDetail.course.classId,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
        }
        dispatch(CourseDetailActions.getCourseWeeksRequest(requestBody))
    }

    const getWeekActivities = (skipParam = skip) => {
        const requestBody = {
            remote: true,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: JSON.stringify({
                "getActivityType": 2,
                "classId": isUserInstructor(main.userIdentity)
                    ? addActivityRedux.classInformation[0].value
                    : courseDetail.course.classId,
                "courseId": courseDetail.course.courseId,
                "activityId": "",
                "termWeekId": selectedWeek.week !== 0 ? selectedWeek.termWeekId : null,
                "take": take,
                "skip": skipParam,
                "searchedText": "",
                "contextId": "",
                "weekZero": selectedWeek.week === 0,
            }),
            single: false

        }
        dispatch(CourseDetailActions.getActivityListRequest(requestBody))
    }


    const setLastWeek = () => {
        if (menuPosition !== 0) {
            dispatch(CourseDetailActions.setActivityList())
            setActivityList(null)
            setSkip(0)
            setSelectedWeek(courseDetail.courseWeeks[menuPosition - 1])
            setMenuPosition(menuPosition - 1)
        }
    }

    const setNextWeek = () => {
        if (menuPosition + 1 !== courseDetail.courseWeeks.length) {
            dispatch(CourseDetailActions.setActivityList())
            setActivityList(null)
            setSkip(0)
            setSelectedWeek(courseDetail.courseWeeks[menuPosition + 1])
            setMenuPosition(menuPosition + 1)
        }
    }

    const refresh = () => {
        setRefreshing(true)
        setSkip(0)
        getWeekActivities(0)
        getEnrollmentProgress()
    }
    const _renderMoreItem = () => {
        if (activityList.length % Constants.ApiResponseQuantity === 0) {
            console.log("_renderMoreItem")
            if (scrolled) {
                setSkip(skip + Constants.ApiResponseQuantity)
            }
            setScrolled(false)
        }
    }
    
    const _renderActivityList = () => {
        return (activityList && activityList.length == 0)
            ? <EmptyPage description={main.languageResource.r_empty_activity_for_selected_weeks || strings('r_empty_activity_for_selected_weeks')} activity />
            : (
                <FlatList
                    // contentContainerStyle={{ margin: 10 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => refresh()} />}
                    keyExtractor={(item, index) => index.toString()}
                    data={activityList}
                    // extraData={this.state.orientation}
                    onEndReached={() => _renderMoreItem()}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={Constants.ApiResponseQuantity}
                    onMomentumScrollBegin={() => {
                        console.log("onMomentumScrollBegin")
                        setScrolled(true)
                    }}
                    renderItem={({ item }) => (
                        _renderActivityItem(item)
                    )}
                />
            )
    }


    // TODO: ActivityDetail.js ile ayni olmali!
    const _renderActivityItem = (item) => {
        switch (item.activityType) {
            case Constants.ActivityType.Document:
                return <ActivityDocumentType
                    activity={item}
                    navigation={props.navigation}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }} />
            case Constants.ActivityType.Assignment:
                return <ActivityAssignmentType
                    activity={item}
                    navigation={props.navigation}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }}
                    sendAnswer={(requestBody) => {
                        props.sendAssignmentAnswerRequest(requestBody)
                    }} />
            case Constants.ActivityType.Video:
                return <ActivityVideoType
                    activity={item}
                    navigation={props.navigation} />
            case Constants.ActivityType.VirtualClass:
                return <ActivityVirtualClassType
                    activity={item}
                    navigation={props.navigation}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }}
                />
            case Constants.ActivityType.Elesson:
                return <ActivityELessonType
                    activity={item}
                    navigation={props.navigation}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }} />
            case Constants.ActivityType.LinkActivity:
                return <ActivityLinkType
                    activity={item}
                    navigation={props.navigation} />

            case Constants.ActivityType.Exam:
                return <ActivityExamType
                    activity={item}
                    navigation={props.navigation} />
            case Constants.ActivityType.Survey:
                return <ActivitySurveyType
                    activity={item}
                    navigation={props.navigation} />
            case Constants.ActivityType.Forum:
                return <ActivityForumType
                    activity={item}
                    navigation={props.navigation}
                    selectedFile={(file) => {
                        setSelectedFile(file)
                        setDownloader(true)
                    }} />

            // case Constants.ActivityType.LTI:
            //     return null;
            default: return null
        }
    }


    const _renderMenuText = () => {
        if (selectedWeek.week === 0) {
            return (
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <TextView weight="bold" style={{ color: Colors.course_weeks_menu_item_text_color, fontSize: FontSize.course_weeks_item }}>
                        {main.languageResource.r_course_unplanned_activities || strings('r_course_unplanned_activities')}
                    </TextView>
                </View>
            );
        } else {
            return (
                <View style={{ alignItems: 'center' }}>
                    <TextView weight="bold" style={{ color: Colors.course_weeks_menu_item_text_color, fontSize: FontSize.course_weeks_item }}>
                        {main.languageResource.r_course_week_text !== undefined
                            ? template(main.languageResource.r_course_week_text, { weekName: selectedWeek.week })
                            : template(strings('r_course_week_text'), { weekName: selectedWeek.week })}
                    </TextView>
                    <TextView weight="regular" style={{ fontSize: FontSize.course_weeks_item_description }}>
                        {moment(selectedWeek.startDate).format('DD') + " - " + moment(selectedWeek.endDate).format('DD MMMM YYYY')}
                    </TextView>
                </View>
            );
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

    const _renderPicker = () => {
        const menuOptions = []; //menuOptions contains only string on the ios platform
        courseWeeks.map((data, index) => {
            if (data.week === 0) {
                if (Platform.OS === 'android')
                    menuOptions.push(
                        <TextView weight="bold" style={{ color: Colors.course_weeks_menu_item_text_color, fontSize: FontSize.course_weeks_item }}>
                            {main.languageResource.r_course_unplanned_activities || strings('r_course_unplanned_activities')}
                        </TextView>)
                else
                    // menuOptions.push(main.languageResource.r_course_unplanned_activities || strings('r_course_unplanned_activities'))
                    menuOptions.push(<Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", padding: 10 }} >{main.languageResource.r_course_unplanned_activities || strings('r_course_unplanned_activities')}</Text>)
            } else {
                if (Platform.OS === 'android') {
                    menuOptions.push(
                        <View style={{ alignItems: 'center' }}>
                            <TextView weight="bold" style={{ color: Colors.course_weeks_menu_item_text_color, fontSize: 15 }}>
                                {main.languageResource.r_course_week_text !== undefined
                                    ? template(main.languageResource.r_course_week_text, { weekName: data.week })
                                    : template(strings('r_course_week_text'), { weekName: data.week })}
                            </TextView>
                            <TextView weight="regular" style={{ fontSize: 13 }}>
                                {moment(data.startDate).format('DD MMMM') + " - " + moment(data.endDate).format('DD MMMM YYYY')}
                            </TextView>
                        </View>
                    )
                } else {
                    menuOptions.push(<Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", padding: 10 }} >{
                        main.languageResource.r_course_week_text !== undefined
                            ? template(main.languageResource.r_course_week_text, { weekName: data.week })
                            : template(strings('r_course_week_text'), { weekName: data.week })}</Text>)
                }
            }
        })

        if (Platform.OS === 'android') {
            menuOptions.push(<TextView weight="bold" style={{ color: 'black', fontSize: 18 }}>
                {main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')}
            </TextView>);
        } else {
            menuOptions.push(<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", padding: 10 }} >{main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')}</Text>)
        }

        if (courseWeeks.length > 0) {
            return (
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ height: 1, backgroundColor: Colors.lineColor }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                        <View style={{ flex: 0.2 }}>
                            <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" size={25} onPress={() => setLastWeek()} />
                        </View>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', padding: 10 }} activeOpacity={0.7} onPress={() => actionSheetRef.current.show()}>
                                {_renderMenuText()}
                            </TouchableOpacity>
                            <ActionSheet
                                ref={actionSheetRef}
                                options={menuOptions}
                                cancelButtonIndex={menuOptions.length - 1}
                                onPress={(index) => {
                                    if (index == menuOptions.length - 1) return
                                    if (menuPosition === index) return

                                    dispatch(CourseDetailActions.setActivityList())
                                    setActivityList(null)
                                    setSkip(0)
                                    setSelectedWeek(courseDetail.courseWeeks[index])
                                    setMenuPosition(index)

                                }}
                            />
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-forward" size={25} onPress={() => setNextWeek()} />
                        </View>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: Colors.background, width: width }} >
                <View style={{ flex: 1 }}>
                    {_renderActivityList()}
                </View>
                {_renderPicker()}
                {_renderDownloader()}
            </View>
        </SafeAreaView>
    )


}
export default CourseActivities