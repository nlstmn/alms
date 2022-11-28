
import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import AllAnnouncement from '../views/tabs/announcement/AllAnnouncement';
import Colors from '../theme/Colors';
import { strings } from '../locales/i18n';
import LessonAnnouncement from '../views/tabs/announcement/LessonAnnouncement';

const TabAnnouncementScreen = createMaterialTopTabNavigator(
    {
        All: {
            screen: AllAnnouncement,
            navigationOptions: ({ navigation, screenProps }) => {
                return {
                    tabBarLabel: screenProps.languageResource.r_all_text || strings('r_all_text')
                }
            }
        },
        LessonAnnouncement: {
            screen: LessonAnnouncement,
            navigationOptions: ({ navigation, screenProps }) => {
                return {
                    tabBarLabel: screenProps.languageResource.r_announcement_lesson || strings('r_announcement_lesson')
                }
            }
        }
    },
    {
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        backBehavior: 'none',
        tabBarOptions: {

            activeTintColor: Colors.announcement_tab_active_text_color,
            inactiveTintColor: Colors.announcement_tab_inactive_text_color,
            scrollEnabled: false,
            style: {
                backgroundColor: Colors.announcement_tab_background,
            },
            labelStyle: {
                textAlign: 'center',
            },
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2,
            },
        },
    }
);


const AnnouncementRouter = createAppContainer(createSwitchNavigator({
    announcementTabs: {
        screen: TabAnnouncementScreen
    }
}));
export default AnnouncementRouter
