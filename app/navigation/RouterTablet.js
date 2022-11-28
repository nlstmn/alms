import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';

import CourseDetail from '../views/tabs/courses/CourseDetail';
import VideoPlayerComponent from '../views/tabs/courses/VideoPlayer';

//Drawer Menu
import DrawerPuppet from '../views/drawer/DrawerPuppet';


//routing
import DrawerMenu from '../views/drawer/DrawerMenu';
import AppRootContainer from '../views/tabs/AppRootContainer';
import AuthenticationRootContainer from '../views/tabs/AuthenticationRootContainer';

import { createBottomTab } from './AppRootRouter';
import ActivityDetail from '../views/tabs/courses/ActivityDetail';

import ErrorMainpage from '../views/error/ErrorMainpage';


const { width, height } = Dimensions.get('screen');


export const ErrorNavigation = createAppContainer(createStackNavigator({
    ErrorMain: {
        screen: ErrorMainpage,
        navigationOptions: {
            header: null,
        }
    }
}))


export const DrawerMenu2Router = createStackNavigator({
    DrawerPuppet: {
        screen: DrawerPuppet
    }
})

export const createDrawerRouter = createAppContainer(createSwitchNavigator({
    Menu2: {
        screen: DrawerMenu2Router
    }
}))

// export const courseDetailRouter = createStackNavigator({
//     CourseDetail: {
//         screen: CourseDetail,
//     }
// }, {
//         defaultNavigationOptions: {

//             headerTitleStyle: {
//                 flex: 1,
//                 textAlign: 'center',
//                 fontSize: 16
//             }
//         }
//     })


export const courseDetailRouter = createAppContainer(createStackNavigator({
    CourseDetail: {
        screen: CourseDetail,
        navigationOptions: ({ navigation }) => ({
            title: navigation.getParam('Course').name,
            headerTitleStyle: {
                alignSelf: 'center'
            },
            headerLeft: (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" size={25} onPress={() => {
                        const backActions = NavigationActions.back({
                            key: null
                        });
                        navigation.dispatch(backActions)
                        //navigation.goBack()
                    }} />
                </View>
            ),
        })
    },
    VideoPlayer: {
        screen: VideoPlayerComponent,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
}, { headerLayoutPreset: 'center' }));

export const drawerRouter = (menu, languageResources, navigate) => {
    const bottomTabNavigator = createBottomTab(menu, languageResources)

    return createAppContainer(createDrawerNavigator({
        bottomTabNavigator,
        createDrawerRouter
    }, {
            navigationOptions: {
                header: null
            },
            unmountInactiveRoutes: true,
            drawerPosition: 'left',
            drawerLockMode: 'locked-open',
            drawerWidth: Math.min(height, width) * 0.8, // calculates 80% of the smaller side of the screen.
            contentComponent: props => <DrawerMenu menuItems={menu} {...props} nav={navigate} />

        }))
}


export const createAppRoot = (menu, languageResources, navigate) => {
    const drawerNavigator = drawerRouter(menu, languageResources, navigate)

    return createAppContainer(createStackNavigator({
        root: {
            screen: drawerNavigator,
            navigationOptions: {
                header: null
            }
        },
        courseDetail: {
            screen: courseDetailRouter,
            navigationOptions: {
                header: null
            }
        },
        activityDetail: {
            screen: ActivityDetail
        }
    }, { headerLayoutPreset: 'center' }))
}

export const createTabletRootNavigator = (signedIn = "false") => {

    return createAppContainer(createSwitchNavigator({
        SignedIn: {
            //screen: createAppRoot(),
            screen: AppRootContainer,
        },
        SignedOut: {
            screen: AuthenticationRootContainer,
        },
        ErrorPage: {
            screen: ErrorNavigation
        }

    }, { initialRouteName: signedIn === 'true' ? "SignedIn" : "SignedOut" }));

}