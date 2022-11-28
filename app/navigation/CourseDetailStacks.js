import React from 'react';
import { createStackNavigator } from 'react-navigation';

//tabs
import CourseActivities from '../views/tabs/courses/tab/CourseActivities';
import CourseHome from '../views/tabs/courses/tab/CourseHome';
import CourseAnnouncement from '../views/tabs/courses/tab/CourseAnnouncement';

export const CourseActivitiesStack = createStackNavigator({
    CourseActivities: {
        screen: CourseActivities,
        navigationOptions: {
            header: null
        }
    },
})

export const CourseHomeStack = createStackNavigator({
    CourseHome: {
        screen: CourseHome,
        navigationOptions: {
            header: null
        }
    }
})

export const CourseAnnouncementStack = createStackNavigator({
    CourseAnnouncement: {
        screen: CourseAnnouncement,
        navigationOptions: {
            header: null
        },
    }
})
