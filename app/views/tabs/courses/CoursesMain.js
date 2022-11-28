import React, { Fragment } from 'react'
import { View, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground, Platform, StatusBar, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native'


import { template } from '../../../locales/StringTemplate'
//redux
import { connect } from 'react-redux';
import CoursesActions from '../../../redux/CoursesRedux';
import ActivityInteractActions from '../../../redux/ActivityInteractRedux';
import ScheduleActions from '../../../redux/ScheduleRedux';
import MainActions from '../../../redux/MainRedux';

import Colors from '../../../theme/Colors';

import NetInfo from '@react-native-community/netinfo';

import header_bg from '../../../assets/images/header_bg.jpg'
import Moment from 'moment';
import TextView from '../../../components/TextView';
import Constants from '../../../services/Constants';
import { strings } from '../../../locales/i18n';
import { Avatar, Icon } from 'react-native-elements';
import CardActivityItem from '../../../components/CardActivityItem';
import CardActivityItemEmpty from '../../../components/CardActivityItemEmpty';
import CardLessonItem from '../../../components/CardLessonItem';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-navigation';

class CoursesMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            scrolled: false,
            listEmpty: false,
            enrolledCoursesData: this.props.courses.enrolledCoursesData,
            dailyCalender: this.props.schedule.dailyCalender
        }
        this._isMounted = false;
        this._isStateFull = false;
        this._isStateFullDaily = false;

        this.enrolledCourseApiRequestBody = {
            loader: true,
            remote: true,
            userIdentity: this.props.main.userIdentity,
            accessToken: this.props.main.authData.access_token,
            //accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkI0Mzg4RUM1QUFBQUY3MkJDMzFEMTRBNjFBNkJFNEVDRTQwREZFQTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJ0RGlPeGFxcTl5dkRIUlNtR212azdPUU5fcUUifQ.eyJuYmYiOjE1NzAwODI4MzIsImV4cCI6MTU3MDExODgzMiwiaXNzIjoiaHR0cHM6Ly9hbG1zcC1hdXRoLmFsbXNjbG91ZC5jb20vIiwiYXVkIjpbImh0dHBzOi8vYWxtc3AtYXV0aC5hbG1zY2xvdWQuY29tL3Jlc291cmNlcyIsImFwaSJdLCJjbGllbnRfaWQiOiJhcGkiLCJzdWIiOiI1MTk1ODk6MTc5IiwiYXV0aF90aW1lIjoxNTcwMDgyODMyLCJpZHAiOiJsb2NhbCIsImlkIjoiNTE5NTg5IiwibmFtZSI6IkF2bmkiLCJnaXZlbl9uYW1lIjoiYXlhbGNpbi5vZ3JldG1lbiIsImZhbWlseV9uYW1lIjoiWWFsw6fEsW4iLCJlbWFpbCI6ImZha2VfYXlhbGNpbi5vZ3JldG1lbkBhZHYuY29tLnRyIiwicm9sZSI6IjQiLCJwZXJtaXNzaW9uX2NvbnRlbnQiOiI1MTk1ODk6NDo3M0NBOUM1NDE5MjY4RjNFRTU1ODJENjg4MjExNzcxMjoxNjowN0I1MDIxRUM0QjQxMTBERkY2RjZBNzIzNDZDRjZBRSw1MTk1ODk6NDoyMzcyNjRGMTVCMkQ3QUFENTVCQkE0QTU3Mzc2REY3QToxNjoxNkFGRjkxRjY5N0Q5QjdENTU5NDVDN0MyRTk0OTdCQSw1MTk1ODk6NDpDQTVBNTUzOTUxREM2ODhEQjE5MjVGQTg4REY1MTAyRDoxNjo4MDg3RjhFMTMwRDA4QkMzRTE4NDU2MjZBM0ZFODhCQSw1MTk1ODk6NDoyNTk0OEY4QzJCQTlFNUY0NjNERDI2MDgyNTJFRTU1NjoxNjo2NDU2ODMxNUM4QkY4MDdEQzM2RkRGMkMwQTlGNTI0QSw1MTk1ODk6NDpDQkM2QzIxRDYxN0M5NkU3MjQwOUU2NEQyOTRBOTMwNDoxNjo0QkU2ODlGQjBBMDYyMDM5RjBEQUU1RTM0ODAxQzNCNyw1MTk1ODk6NDpBMUE3RTVCMDFCQjYwMDg2RjlDQUNFMERCMkQwNzY4NDoxNjo0Mzk2MTkzMjEzODBFQTlEQTMyRjJCMkYzRkUxMkFBOSw1MTk1ODk6NDpGRkZBQzY5N0UzNzQ4M0U2OEJGODI3ODI4RjYzMDlBODoxNjo0OEZGRTMzNUMzQ0Q2MjU2N0REMzZEQURGQjU3QzhEOCw1MTk1ODk6NDo1REJBRkU5QTkzNzYwRjM2MUJFNzZBODAyRjExMjVGQToxNjoyMDg3M0Y0NTBDQTQwNjFCNjI3OUJGMDM1NTk4MjYyNiw1MTk1ODk6NDowMDFENThGMTczNUQxQUE1MDdGMzdDODlBQzMzNDYzNjoxNjpDQjFEQUUzRjAzNUI0RDE4M0QwQkIwNjA2NjAyN0M5RCw1MTk1ODk6NDpBQ0I5MDk4OTAzNkRDMUMxNDhGREJFREI5ODI0OTA1MToxNjo3MzVCMkU4MEZEQjE3M0M1NzY2M0Q0MzMxM0ExRkZDMiIsImN1c3RvbV9wZXJtaXNzaW9uX2NvbnRlbnQiOiIiLCJvcmdhbml6YXRpb25faWQiOiIxNzkiLCJzY29wZSI6WyJhcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsiY3VzdG9tIl19.WJide_HmkG4w0fGpc89XjBDdQ6DRv-MIYuY9aYJB9qZu3AG7jKCXWcDBP7Cai0hxmW0lV96UsHKhKZKefQgsH1G22Cq_lHegbcBklkwIr3WllZvOhQjw39jrES7YzMRAzIH7CkFu0HP65Ig7mtqJ5AaTrkU5B6zJxkU13rdypoAyRqiIfTHNJVjI9tYUc5FYdfKgBP-7CLn1lYM00p_FxzdhjhwN--juqF1jwvO-eCwarMeb1cxHgzBOraDOFlf6p-ja1XU0TyvLctKm-o17bNzHRO9JsMop01QnD1OAsHPOrxSJ2gZ8wu_FMXgI1kMqv8TVAyQXwkPCA3lmkOv4kA',
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            activeStatus: Constants.CourseTypes.Active,
            courseDateFilter: 1,
            isNotifications: true,
            take: Constants.HomepageLessonQuantity,
            skip: 0
        }


        this.dailyCalendarApiRequestBody = {
            loader: true,
            remote: true,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            accessToken: this.props.main.authData.access_token,
            startDate: Moment().format('YYYY-MM-DD'),
            endDate: Moment().add(1, 'd').format('YYYY-MM-DD'),
            contextType: 16,
            take: Constants.DailyCalendarQuantity,
            skip: 0
        }
        this.refreshTokenApiBody = {
            almsPlusAuthUrl: this.props.main.selectedOrganization.almsPlusAuthUrl,
            userName: '',
            password: '',
            apiAddress: this.props.main.selectedOrganization.apiAddress,
            refreshToken: null,
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this.props.courses.enrolledCoursesData !== null) {
            this._isStateFull = true;
        }
        if (this.props.schedule.dailyCalender != null) {
            this._isStateFullDaily = true;
        }
        this.callEnrolledCoursesApi()
        this.callDailyActivityApi()
        // this.saveUnSavedVideoTrackingDatas()

        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("black")
        }
        StatusBar.setBarStyle("light-content")
    }

    static getDerivedStateFromProps(props, state) {
        if (props.courses.enrolledCoursesData !== state.enrolledCoursesData) {
            return {
                enrolledCoursesData: props.courses.enrolledCoursesData,
                refreshing: false
            }
        }
        if (props.schedule.dailyCalender !== state.dailyCalender) {
            return {
                dailyCalender: props.schedule.dailyCalender,
                refreshing: false
            }
        }
        return null
    }


    //kaydedilmemiş video tracking dataları internet varsa kaydedilir.
    async saveUnSavedVideoTrackingDatas() {
        NetInfo.fetch().then(statu => {
            if (statu.isConnected) {
                this.props.saveUnsavedVideoTrackingData()
            }
        })
    }


    componentWillUnmount() {
        this._isMounted = false;
        this._isStateFull = false;
        this._isStateFullDaily = false;
        this.state = {
            refreshing: false,
        }
        console.log("Courses Main componentWillMount")

    }



    callEnrolledCoursesApi() {
        NetInfo.fetch().then(statu => {
            if (!statu.isConnected) {
                this.enrolledCourseApiRequestBody.remote = false;
            } else {
                this.enrolledCourseApiRequestBody.remote = true;
            }
            this.props.getEnrolledCourses(this.enrolledCourseApiRequestBody)

        });
    }

    callDailyActivityApi(loader = true) {
        NetInfo.fetch().then(statu => {
            if (!statu.isConnected) {
                this.dailyCalendarApiRequestBody.remote = false;
            } else {
                this.dailyCalendarApiRequestBody.remote = true;
            }
            this.dailyCalendarApiRequestBody.loader = loader
            this.props.getMyDailyCalender(this.dailyCalendarApiRequestBody);
        });
    }


    _callEnrolledCoursesApi(loader = true) {
        this.setState({ scrolled: false })
        NetInfo.fetch().then(statu => {
            if (statu.isConnected) this.enrolledCourseApiRequestBody.remote = true; else this.enrolledCourseApiRequestBody.remote = false;
            this.enrolledCourseApiRequestBody.loader = loader
            this.props.getEnrolledCourses(this.enrolledCourseApiRequestBody)
        })
    }

    _onRefresh() {
        this.setState({ refreshing: true, scrolled: false })
        this.enrolledCourseApiRequestBody.skip = 0
        this._callEnrolledCoursesApi(false)
        this.callDailyActivityApi(false)
    }

    _renderMoreItem = () => {
        if (this.state.scrolled && !this.state.listEmpty && (this.props.courses.enrolledCoursesData.length % Constants.ApiResponseQuantity === 0)) {
            console.log("Load more item")
            this.enrolledCourseApiRequestBody.skip = this.enrolledCourseApiRequestBody.skip + Constants.ApiResponseQuantity
            this._callEnrolledCoursesApi()
        }
    }

    openSideMenu() {
        this.props.navigation.openDrawer()
    }


    renderLessons() {
        return (
            <View style={style.myLessonView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <TextView style={style.myLessonsText}>{this.props.main.languageResource.r_my_lessons || strings('r_my_lessons')}</TextView>
                    {/* <Icon name="md-arrow-forward" type="ionicon" color="black" /> */}
                </View>

                <FlatList
                    data={this.state.enrolledCoursesData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <CardLessonItem
                            theme={"black"}
                            data={item}
                            key={index}
                            navigation={this.props.navigation}
                            userType={this.props.main.userIdentity?.userType} />
                    )}
                />

                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, marginEnd: 10, alignItems: 'center' }} onPress={() => {
                    this.props.navigation.navigate('LessonsMain')
                }}>
                    <TextView style={{ color: 'black', marginEnd: 10 }}>Tümü</TextView>
                    <Icon name="md-arrow-forward" type="ionicon" color="black" />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0.4, backgroundColor: "black" }} />
                    <View style={{ flex: 1, backgroundColor: Colors.background }} />
                    <SafeAreaView style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}>
                        <ScrollView
                            contentContainerStyle={{
                                backgroundColor: Colors.background,
                            }}
                            refreshControl={<RefreshControl tintColor={"white"} refreshing={this.state.refreshing} onRefresh={() => this._onRefresh()} />}>
                            <ImageBackground source={header_bg} style={{ width: '100%', height: 200, position: 'absolute' }}>
                                <LinearGradient colors={['#000000', 'transparent']}>
                                    <View style={{ width: "100%", height: "100%" }}></View>
                                </LinearGradient>
                            </ImageBackground>
                            <View style={style.headerView}>
                                <View style={style.toolbar}>
                                    <View style={{ flex: 1, marginStart: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Avatar rounded icon={{ name: 'ios-person', type: 'ionicon' }} size={50} containerStyle={{ backgroundColor: '#FFFFFF33', padding: 5 }} />
                                        <TextView style={style.userNameText}>{template(strings('r_greetings_user'), { name: this.props.main.userIdentity?.firstName })}</TextView>
                                    </View>
                                    <View style={style.toolbarActions}>
                                        {/* <Icon name="ios-add-circle" type="ionicon" color="white" containerStyle={{ padding: 10, marginStart: 5, marginEnd: 5 }} /> */}
                                        {/* <Icon name="ios-search" type="ionicon" color="white" containerStyle={{ padding: 10 }} /> */}
                                        <TouchableOpacity onPress={() => this.openSideMenu()}>
                                            <Icon name="ios-menu" type="ionicon" color="white" containerStyle={{ padding: 10 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={style.toolbarline} />

                                <View style={style.todayActivityView}>
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }} onPress={() => {
                                        this.props.navigation.navigate('CalendarMain', { today: true })
                                    }}>
                                        <TextView weight="bold" style={style.todayActivityText}>{this.props.main.languageResource.r_course_daily_activity || strings('r_course_daily_activity')}</TextView>
                                        <Icon name="md-arrow-forward" type="ionicon" color="white" />
                                    </TouchableOpacity>

                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.dailyCalender}
                                        horizontal={true}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => (
                                            <CardActivityItem data={item} key={index} navigation={this.props.navigation} />
                                        )}
                                        ListEmptyComponent={() => <CardActivityItemEmpty />}

                                    />

                                </View>

                                {this.renderLessons()}
                            </View>
                        </ScrollView>
                    </SafeAreaView >
                </View>
            </Fragment>
        );
    }
}

const style = StyleSheet.create({
    headerView: {
        // marginTop: Platform.OS === "android" ? 10 : 10,
    },
    toolbar: {
        height: Header.HEIGHT,
        // margin: 10,
        // backgroundColor:"red",
        // marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userNameText: {
        color: 'white',
        fontSize: 16,
        marginStart: 5
    },
    toolbarActions: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    toolbarline: { height: 0.5, backgroundColor: 'white', marginTop: 10, marginStart: 10, marginEnd: 10, opacity: 0.5 },
    todayActivityView: {
        marginTop: 40,
        minHeight: 130,
    },
    todayActivityText: {
        color: 'white',
        fontSize: 16
    },
    myLessonView: {
        marginTop: 10
    },
    myLessonsText: {
        color: 'black',
        fontSize: 18
    }
})


const mapDispatchToProps = (dispatch) => {
    return {
        getEnrolledCourses: (...args) => dispatch(CoursesActions.getCoursesRequest(...args)),
        getMyDailyCalender: (...args) => dispatch(ScheduleActions.getMyDailyCalenderRequest(...args)),
        setCoursesList: (...args) => dispatch(CoursesActions.setCoursesList(...args)),
        saveUnsavedVideoTrackingData: () => dispatch(ActivityInteractActions.saveUnsavedVideoTrackingData()),
        setAuthData: (...args) => dispatch(MainActions.setAuthData(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        courses: state.courses,
        schedule: state.schedule,
        main: state.main,
        activityInteract: state.activityInteract,
        login: state.login,
        loader: state.loader
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesMain)