import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
//tabs
import CoursesMain from '../views/tabs/courses/CoursesMain';
import LessonsMain from '../views/tabs/courses/LessonsMain';
import NotesMain from '../views/tabs/notes/NotesMain';
import AnnouncementMain from '../views/tabs/announcement/AnnouncementMain';
import DrawerPuppet from '../views/drawer/DrawerPuppet';
import CalendarMain from '../views/tabs/calender/CalendarMain';
import MessagesMain from '../views/tabs/messages/MessagesMain';
import GroupsPersons from '../views/tabs/messages/GroupsPersons';

//localization
import { strings } from '../locales/i18n';
import Colors from '../theme/Colors';
import { Platform, StatusBar } from 'react-native';
import { courseDetailRouter } from './Router'
import AppTheme from '../theme/AppTheme';
import AnnouncementDetailNew from '../views/tabs/announcement/AnnouncementDetailNew';
import ShowAllAnnouncement from '../views/tabs/announcement/ShowAllAnnouncement';
import SearchAnnouncement from '../views/tabs/announcement/SearchAnnouncement';
import AddAnnouncement from '../views/tabs/announcement/AddAnnouncement';

//courses stack navigator
const HomeStack = (title) => {
    return createStackNavigator({
        Main: {
            screen: CoursesMain,
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
        AnnouncementDetail: {
            screen: AnnouncementDetailNew
        },
    }, {
        headerMode: 'float',
        headerLayoutPreset: 'left',
        navigationOptions: {
            tabBarLabel: title,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName = 'ios-home';
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }
    })
}

//courses stack navigator
const LessonsStack = (title) => {
    return createStackNavigator({
        LessonsMain: {
            screen: LessonsMain,
        },
        courseDetail: {
            screen: courseDetailRouter,
            navigationOptions: {
                header: null
            }
        },
        AnnouncementDetail: {
            screen: AnnouncementDetailNew
        },
    }, {
        // headerMode: 'float', headerLayoutPreset: 'left',
        navigationOptions: {
            tabBarLabel: title,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName = 'logo-buffer';
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }
    })
}




//notes stack navigator
const NotesStack = createStackNavigator({
    Main: {
        screen: NotesMain,
        navigationOptions: {
            header: null
        }
    },
}, { headerMode: 'float', headerLayoutPreset: 'center' });
NotesStack.navigationOptions = {
    tabBarLabel: strings('tabs.notes'),
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let IconComponent = Ionicons;
        let iconName = 'md-today';
        return <IconComponent name={iconName} size={25} color={tintColor} />;
    },
}

//Calender stack navigator
const CalendarStack = (title) => {
    return createStackNavigator({
        CalendarMain: {
            screen: CalendarMain,
        },
    }, {
        headerMode: 'float', headerLayoutPreset: 'center', navigationOptions: {
            tabBarLabel: title,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName = 'ios-calendar';
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }
    });

}


const MessagesStack = (title) => {
    return createStackNavigator({
        Main: {
            screen: MessagesMain
        },
        GroupsPersons: {
            screen: GroupsPersons
        }
    }, {
        navigationOptions: {
            tabBarLabel: title,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName = 'ios-chatboxes';
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }
    });

}


//Announcement stack navigator
const AnnouncementStack = (title) => {
    return createStackNavigator({
        Main: {
            screen: AnnouncementMain
        },
        AnnouncementDetail: {
            screen: AnnouncementDetailNew
        },
        ShowAllAnnouncement: {
            screen: ShowAllAnnouncement
        },
        SearchAnnouncement: {
            screen: SearchAnnouncement
        },
        AddAnnouncement: {
            screen: AddAnnouncement
        }
    }, {
        navigationOptions: {
            tabBarLabel: title,
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName = 'ios-notifications';
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }
    })
}


//Menu stack navigator
const MenuStack = () => {
    return createStackNavigator({
        MenuMain: {
            screen: DrawerPuppet,
            navigationOptions: {
                header: null
            }
        },
    }, {
        headerMode: 'float', navigationOptions: ({ navigation }) => ({
            tabBarLabel: strings('tabs.menu'),
            tabBarOnPress: () => {
                navigation.openDrawer()
            },
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                let IconComponent = Ionicons;
                let iconName = 'ios-more';
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        })
    })

}

//tablet ve telefon için dinamik ana tab menüsü (menü string adına göre)

/* TODO: dinamik menü geçici olarak kaldırıldı. */
export const createBottomTab = (menu, languageResources) => {
    var arrayStack = [];

    const homeStack = HomeStack(languageResources.r_menu_home)
    arrayStack.push(homeStack);

    const coursesStack = LessonsStack(languageResources.r_menu_my_courses)
    arrayStack.push(coursesStack);

    const calanderStack = CalendarStack(languageResources.r_menu_calendar)
    arrayStack.push(calanderStack);

    const announcementStack = AnnouncementStack(languageResources.r_menu_announcements)
    arrayStack.push(announcementStack);

    const messagesStack = MessagesStack(languageResources.r_menu_messages);
    arrayStack.push(messagesStack);

    // const filesStack = FilesStack(languageResources.r_menu_my_files);
    // arrayStack.push(filesStack);

    // menu.map((item, index) => {
    //     // if (index === 1) {
    //     //     const courseStack = LessonStack(languageResources.r_menu_my_courses)
    //     //     arrayStack.push(courseStack);
    //     //     return
    //     // }
    //     switch (item.name) {
    //         case 'r_menu_my_courses':
    //             const homeStack = HomeStack(languageResources.r_menu_home)
    //             arrayStack.push(homeStack);
    //             break;
    //         case 'r_menu_calendar':
    //             const calanderStack = CalendarStack(languageResources.r_menu_calendar)
    //             arrayStack.push(calanderStack);
    //             break
    //         case 'r_menu_forum':
    //             const coursesStack = LessonsStack(languageResources.r_menu_my_courses)
    //             arrayStack.push(coursesStack);
    //             break;
    //         case 'r_menu_announcements':
    //             const announcementStack = AnnouncementStack(languageResources.r_menu_announcements)
    //             arrayStack.push(announcementStack);
    //             break
    //         case 'r_menu_messages':
    //             const messagesStack = MessagesStack(languageResources.r_menu_messages);
    //             arrayStack.push(messagesStack);
    //             break;
    //         case 'r_menu_my_files':
    //             const filesStack = FilesStack(languageResources.r_menu_my_files);
    //             arrayStack.push(filesStack);
    //             break;
    //     }
    // })
    // const menuStack = MenuStack();
    // arrayStack.push(menuStack);


    return createBottomTabNavigator(arrayStack, {
        tabBarOptions: {
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.tab_inactive_color,
            labelStyle: {
                fontFamily: AppTheme.fonts.medium
            }
        },
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ navigation, defaultHandler }) => {
                switch (parseInt(navigation.state.routeName)) {
                    case 0:
                        StatusBar.setBarStyle('light-content')
                        if (Platform.OS == "android") {
                            StatusBar.setBackgroundColor("black")
                        }
                        break
                    default:
                        StatusBar.setBarStyle('dark-content')
                        if (Platform.OS === "android") {
                            StatusBar.setBackgroundColor("white")
                        }
                        break
                }

                defaultHandler()
            },
            tabBarOnLongPress: ({ navigation, defaultHandler }) => {
                defaultHandler()
            },
        })
    });

}