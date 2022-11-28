import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';

import CourseDetail from '../views/tabs/courses/CourseDetail';
import VideoPlayerComponent from '../views/tabs/courses/VideoPlayer';
import ActivityDetailWebView from '../views/tabs/courses/ActivityDetailWebView';

//routing
import DrawerMenu from '../views/drawer/DrawerMenu';
import AppRootContainer from '../views/tabs/AppRootContainer';
import AuthenticationRootContainer from '../views/tabs/AuthenticationRootContainer';

import { createBottomTab } from './AppRootRouter';
import ActivityDetail from '../views/tabs/courses/ActivityDetail';
import MessageDetailNew from '../views/tabs/messages/MessageDetailNew';
import ProfileMain from '../views/tabs/profile/ProfileMain';
import FilesMain from '../views/tabs/files/FilesMain';

import ErrorMainpage from '../views/error/ErrorMainpage';

export const ErrorNavigation = createAppContainer(createStackNavigator({
    ErrorMain: {
        screen: ErrorMainpage,
        navigationOptions: {
            header: null,
        }
    }
}))


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
                    <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" color="black" size={25} onPress={() => {
                        const backActions = NavigationActions.back({
                            key: null
                        });
                        navigation.dispatch(backActions)
                    }} />
                </View>
            ),
        }),
    },
}, {}));

export const drawerRouter = (menu, languageResources, navigate) => {
    const bottomTabNavigator = createBottomTab(menu, languageResources)

    return createAppContainer(createDrawerNavigator({
        bottomTabNavigator,
    }, {
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-open'
        },
        unmountInactiveRoutes: true,
        drawerPosition: 'right',

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

        activityDetail: {
            screen: ActivityDetail
        },
        VideoPlayer: {
            screen: VideoPlayerComponent,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        ActivityDetailWebView: {
            screen: ActivityDetailWebView
        },
        MessageDetailNew: {
            screen: MessageDetailNew
        },
        //Burada side menü seçenekleri yeni bir sayfa olarak açılması gerektiğinden menu api'deki verilere göre sayfalar eklenmiştir.
        profile: {
            screen: ProfileMain
        },
        files: {
            screen: FilesMain
        },
    }, { headerLayoutPreset: 'center' }))
}

// ? { headerMode: 'none' }



export const createRootNavigator = (signedIn = "false") => {

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