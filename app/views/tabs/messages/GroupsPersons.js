import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createAppContainer, createSwitchNavigator, createMaterialTopTabNavigator, FlatList } from 'react-navigation';
import PersonList from './PersonList';
import GroupsList from './GroupsList';
import Colors from '../../../theme/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import { strings } from '../../../locales/i18n';
import { useSelector } from 'react-redux';


const GroupsPersonsTabRouter = createMaterialTopTabNavigator({
    Groups: {
        screen: GroupsList,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: screenProps.languageResource.r_page_groups_title || strings('r_page_groups_title')
            }

        }
    },
    Persons: {
        screen: PersonList,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: screenProps.languageResource.r_page_contacts_title || strings('r_page_contacts_title')
            }

        }
    }
}, {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    backBehavior: 'none',
    tabBarOptions: {

        activeTintColor: Colors.messages_tab_active_text_color,
        inactiveTintColor: Colors.messages_tab_inactive_text_color,
        scrollEnabled: false,
        style: {
            backgroundColor: Colors.messages_tab_background,
        },
        labelStyle: {
            textAlign: 'center',
        },
        indicatorStyle: {
            borderBottomColor: Colors.primary,
            borderBottomWidth: 2,
        },
    },
});

const GroupsPersonsRouter = createAppContainer(createSwitchNavigator({
    groupsPersonsTabs: {
        screen: GroupsPersonsTabRouter
    },
}))

function GroupsPersons(props) {
    const main = useSelector(state => state.main)

    useEffect(() => {
        props.navigation.setParams({
            title: main.languageResource.r_page_groups_contacts_title || strings('r_page_groups_contacts_title')
        })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <GroupsPersonsRouter navigation={props.navigation} screenProps={{ languageResource: main.languageResource }} />
        </View>
    )
}

GroupsPersons.router = GroupsPersonsRouter.router; //equivalent to static variable inside a class
GroupsPersons.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        title: params.title,
        headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
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

    }
}

export default GroupsPersons