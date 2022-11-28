import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import CoursesActions from '../../../redux/CoursesRedux';
import NetInfo from '@react-native-community/netinfo';
import Constants from '../../../services/Constants';
import LessonItem from '../../../components/courses/LessonItem';
import Colors from '../../../theme/Colors';


function LessonsMain(props) {

    useEffect(() => {
        props.navigation.setParams({
            title: props.main.languageResource.r_menu_my_courses,
            drawer: openDrawerMenu
        })

        callEnrolledCoursesApi()
    }, [])

    const requestBody = {
        remote: true,
        userIdentity: props.main.userIdentity,
        accessToken: props.main.authData.access_token,
        almsPlusApiUrl: props.main.selectedOrganization.almsPlusApiUrl,
        activeStatus: Constants.CourseTypes.Active,
        courseDateFilter: 1,
        isNotifications: true,
        take: 30,
        skip: 0
    }

    const openDrawerMenu = () => {
        props.navigation.openDrawer()
    }

    const callEnrolledCoursesApi = () => {
        NetInfo.fetch().then(statu => {
            if (!statu.isConnected) {
                requestBody.remote = false
            } else {
                requestBody.remote = true
            }
            props.getLessonsRequest(requestBody)
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                data={props.courses.lessonsData}
                renderItem={({ item, index }) => (
                    <LessonItem key={index} data={item} navigation={props.navigation} userType={props.main.userIdentity?.userType} />
                )}
            />
        </View>
    )
}

LessonsMain.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        headerTitle: params.title,
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                {/* <Icon name="ios-add-circle" type="ionicon" containerStyle={style.icon} onPress={() => console.log("clicked")} /> */}
                {/* <Icon name="ios-search" type="ionicon" containerStyle={style.icon} onPress={() => console.log("clicked")} /> */}
                <Icon name="md-menu" type="ionicon" containerStyle={style.icon} onPress={() => params.drawer()} />
            </View>
        )
    }
}
const style = StyleSheet.create({
    icon: {
        padding: 10
    }
})


const mapDispatchToProps = (dispatch) => {
    return {
        getLessonsRequest: (...args) => dispatch(CoursesActions.getLessonsRequest(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
        courses: state.courses,
        loader: state.loader
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsMain)