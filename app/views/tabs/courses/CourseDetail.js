import React from 'react';
import { Platform, StatusBar, View } from 'react-native';

import CourseDetailActions from '../../../redux/CourseDetailRedux';
import { connect } from 'react-redux';

import TextView from '../../../components/TextView';

import { CourseActivitiesStack, CourseAnnouncementStack, CourseHomeStack } from '../../../navigation/CourseDetailStacks'
import { createMaterialTopTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
import Colors from '../../../theme/Colors';

import { Icon } from 'react-native-elements';


const CourseDetailTopMenu = createMaterialTopTabNavigator({
    CourseHome: {
        screen: CourseHomeStack,
        navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: ({ focused, tintcolor }) => (
                <Icon name="ios-home" type="ionicon" size={24} />
            )
        }
    },
    CourseActivities: {
        screen: CourseActivitiesStack,
        navigationOptions: {
            tabBarIcon: ({ focused, tintcolor }) => (
                <Icon name="ios-list" type="ionicon" size={24} />
            )
        }
    },
    CourseAnnouncementStack: {
        screen: CourseAnnouncementStack,
        navigationOptions: {
            tabBarIcon: ({ focused, tintcolor }) => (
                <Icon name="ios-megaphone" type="ionicon" size={24} />
            )
        }
    },
},
    {

        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        backBehavior: 'none',
        tabBarOptions: {
            showLabel: false,
            showIcon: true,
            upperCaseLabel: false,
            activeTintColor: Colors.messages_tab_active_text_color,
            inactiveTintColor: Colors.messages_tab_inactive_text_color,
            scrollEnabled: false,
            style: {
                backgroundColor: Colors.messages_tab_background,
            },
            labelStyle: {
                fontSize: 11,
                textAlign: 'center',
            },
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2,
            },
        },
    })

const CourseDetailRouter = createAppContainer(createSwitchNavigator({
    courseDetailRoot: {
        screen: CourseDetailTopMenu
    }
}))

class CourseDetail extends React.Component {
    constructor(props) {
        super(props);
        StatusBar.setBarStyle("dark-content")
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("white")
        }
        this.props.setCourse(this.props.navigation.getParam('Course'));
    }
    static navigationOptions = ({ navigation }) => {

        return {
            headerStyle: {
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
                borderBottomWidth: 0,
            },
            headerTitle: () => (<View style={{ flexDirection: 'column' }}>
                <TextView style={{ fontSize: 13, color: 'black' }}>{navigation.getParam('Course').masterCourseName}</TextView>
                <TextView style={{ fontSize: 18, color: 'black' }} weight="bold">{navigation.getParam('Course').name}</TextView>
            </View>)
        };
    }

    componentWillMount() {
        this.props.setActivityList()
    }
    componentWillUnmount() {
        if (this.props.navigation.getParam('theme')) {
            StatusBar.setBarStyle("light-content")
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor("black")
            }
        }
    }

    static router = CourseDetailRouter.router;
    render() {
        return (
            <View style={{ flex: 1 }}>
                <CourseDetailRouter navigation={this.props.navigation} screenProps={{ course: this.props.navigation.getParam('Course') }} />
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCourse: (...args) => dispatch(CourseDetailActions.setCourse(...args)),
        setActivityList: () => dispatch(CourseDetailActions.setActivityList())
    }
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail)