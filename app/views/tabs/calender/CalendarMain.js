import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, StatusBar, Platform } from "react-native";
import { Icon } from 'react-native-elements';

import { Agenda, LocaleConfig } from 'react-native-calendars';
import moment from "moment";
import { strings } from "../../../locales/i18n";
import PageEmpty from "../../../components/courses/PageEmpty";
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../../../local/LocalStorageConstants';
import { useDispatch, useSelector } from "react-redux";
import Constants from "../../../services/Constants";
import { calendarTimeToString } from "../../../helpers/DateFormatter";
import ScheduleActions from '../../../redux/ScheduleRedux';
import Colors from "../../../theme/Colors";
import TextView from "../../../components/TextView";


function CalendarMain(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const schedule = useSelector(state => state.schedule)

    const [activities, setActivities] = useState({})
    const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"))
    const [refreshing, setRefreshing] = useState(false)
    const agendaRef = useRef()

    useEffect(() => {
        props.navigation.setParams({
            title: main.languageResource.r_calendar_page_title || strings('r_calendar_page_title'),
            drawer: openDrawerMenu,
            changeToggled: changeToggled,
            toggled: false
        })
        setAgendaLocalization()

        callCalendarData(moment().valueOf())
    }, [])

    useEffect(() => {
        console.log("rendering ? :", props.navigation.getParam('today'))
        if (props.navigation.getParam('today')) {
            // setSelectedDay(moment().format("YYYY-MM-DD"))
            setTimeout(() => { 
                agendaRef.current.chooseDay(moment().format("YYYY-MM-DD"))
            }, 1000)
            
            StatusBar.setBarStyle('dark-content')
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor("white")
            }
        }
        props.navigation.setParams({ today: false })
    }, [props.navigation.getParam('today')])

    const initCalendarData = useRef(true)
    useEffect(() => {
        if (initCalendarData.current) {
            initCalendarData.current = false
            return
        }
        let activityList = {}
        schedule.calendarData.map((activity) => {
            const startDate = moment(activity.startDate).format('YYYY-MM-DD');
            if (!activityList[startDate]) {
                activityList[startDate] = []
            }
            activityList[startDate].push({
                data: activity
            })
        })
        setActivities(activityList)
        console.log("activityList : ", activityList)
    }, [schedule.calendarData])

    const initSelectedDayRef = useRef(true)
    useEffect(() => {
        if (initSelectedDayRef.current) {
            initSelectedDayRef.current = false
            return
        }
        callCalendarData(moment(selectedDay).valueOf())
    }, [selectedDay])

    const callCalendarData = (day) => {
        console.log("callCalendarData : ", day)
        const startTime = day - 5 * 24 * 60 * 60 * 1000;
        const startDate = calendarTimeToString(startTime)

        const endTime = day + 15 * 24 * 60 * 60 * 1000;
        const endDate = calendarTimeToString(endTime)

        const requestBody = {
            remote: true,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            startDate: startDate,
            endDate: endDate,
            contextType: 16,
            take: Constants.CalendarApiResponseQuantity,
            skip: 0
        }
        dispatch(ScheduleActions.getCalendarDataRequest(requestBody))
    }

    const setAgendaLocalization = () => {
        AsyncStorage.getItem(LocalStorageConstants.Language).then(selectedLang => {
            if (selectedLang === LocalStorageConstants.LanguageTrResource) {
                LocaleConfig.locales['tr'] = {
                    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                    dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
                }
                LocaleConfig.defaultLocale = 'tr';
            }
        })
    }
    const changeToggled = () => {
        agendaRef.current.chooseDay(agendaRef.current.state.selectedDay)
    }
    const openDrawerMenu = () => {
        props.navigation.openDrawer()
    }

    const onRefresh = () => {

    }

    const onDayPress = (day) => {
        console.log("day pressed1 : ", day)
        const time = day.timestamp + 0 * 24 * 60 * 60 * 1000;
        setSelectedDay(moment(time).format('YYYY-MM-DD'))
    }

    const renderItem = (item) => {
        let activity = item.data
        let startColor, endColor;
        switch (activity.activityType) {
            case Constants.ActivityType.Video:
                startColor = Colors.calendar_video_activity_card_start_color
                endColor = Colors.calendar_video_activity_card_end_color
                break;
            case Constants.ActivityType.Assignment:
                startColor = Colors.calendar_assignment_activity_card_start_color
                endColor = Colors.calendar_assignment_activity_card_end_color
                break;
            case Constants.ActivityType.Document:
                startColor = Colors.calendar_document_activity_card_start_color
                endColor = Colors.calendar_document_activity_card_end_color
                break;
            case Constants.ActivityType.VirtualClass:
                startColor = Colors.calendar_virtualclass_activity_card_start_color
                endColor = Colors.calendar_virtualclass_activity_card_end_color
                break;
            case Constants.ActivityType.Exam:
                startColor = Colors.calendar_exam_activity_card_start_color
                endColor = Colors.calendar_exam_activity_card_end_color
                break;
            case Constants.ActivityType.Elesson:
                startColor = Colors.calendar_elesson_activity_card_start_color
                endColor = Colors.calendar_elesson_activity_card_end_color
                break;
            case Constants.ActivityType.LinkActivity:
                startColor = Colors.calendar_link_activity_card_start_color
                endColor = Colors.calendar_link_activity_card_end_color
                break;
            case Constants.ActivityType.Survey:
                startColor = Colors.calendar_link_survey_card_start_color
                endColor = Colors.calendar_link_survey_card_end_color
                break;
            case Constants.ActivityType.Forum:
                startColor = Colors.calendar_link_forum_card_start_color
                endColor = Colors.calendar_link_forum_card_end_color
                break;
            default:
                startColor = Colors.calendar_default_activity_card_color
                endColor = Colors.calendar_default_activity_card_color
        }

        return (
            <TouchableOpacity style={style.activityItem}
                onPress={() => props.navigation.navigate('activityDetail', { activity: activity, isMissingDetail: true })}>
                <View style={{ backgroundColor: startColor, width: 5, borderTopStartRadius: 5, borderBottomStartRadius: 5 }} />
                <View style={{ backgroundColor: endColor, flex: 1, padding: 10, borderTopEndRadius: 5, borderBottomEndRadius: 5, flexDirection: "row", alignItems: "center" }}>
                    <TextView weight="bold" style={{ color: Colors.calendar_activity_title }}>{activity.activityName}</TextView>
                </View>
            </TouchableOpacity>

        );
    }
    const renderEmptyData = () => {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}>
                <PageEmpty text={strings('r_calendar_empty_desctiption')} />
            </ScrollView>
        );
    }

    const renderAgenda = () => {
        return (
            <Agenda
                ref={agendaRef}
                items={activities}
                selected={selectedDay}
                renderItem={(item) => renderItem(item)}
                onDayPress={(day) => onDayPress(day)}
                renderEmptyData={() => renderEmptyData()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh} />}
                rowHasChanged={(r1, r2) => r1.data.activityId !== r2.data.activityId}
                onCalendarToggled={(calendarOpened) => {
                    props.navigation.setParams({ toggled: calendarOpened })
                }}
                theme={{
                    calendarBackground: "white",
                    agendaKnobColor: Colors.primary,
                    backgroundColor: "white",
                    agendaTodayColor: Colors.primary,
                    todayTextColor: Colors.primary,
                    selectedDayBackgroundColor: Colors.primary,
                    dotColor: Colors.primary,
                    // dayTextColor: colors.primary, // calendar day
                    // textDisabledColor: "red"
                    // agendaDayTextColor: Colors.primary, // day name
                    // agendaDayNumColor: colors.primary, // day number
                    // monthTextColor: colors.primary, // name in calendar
                    // textDefaultColor: "red",
                    // todayBackgroundColor: Colors.primary,
                    // textSectionTitleColor: colors.primary,
                }}
            />
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {renderAgenda()}
        </View>
    )
}

CalendarMain.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        title: params.title,
        headerLeft: params.toggled ? (
            <View style={{ flexDirection: 'row' }}>
                <Icon name="ios-arrow-dropup" type="ionicon" containerStyle={{ padding: 10 }} onPress={() => params.changeToggled()} />
            </View>
        ) : null,
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <Icon name="md-menu" type="ionicon" containerStyle={{ padding: 10 }} onPress={() => params.drawer()} />
            </View>
        ),
        headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0,
        },
    }
}
const style = StyleSheet.create({
    activityItem: {
        flex: 1,
        borderRadius: 5,
        marginStart: 10,
        marginEnd: 10,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
})
export default CalendarMain