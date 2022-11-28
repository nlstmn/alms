import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AnnouncementItem from '../../../components/announcement/AnnouncementItem';
import Constants from '../../../services/Constants';
import AnnouncementActions from '../../../redux/AnnouncementRedux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import { strings } from '../../../locales/i18n';


function ShowAllAnnouncement(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const announcementRedux = useSelector(state => state.announcement)


    const [type, setType] = useState(props.navigation.getParam('type'))
    const [announcements, setAnnouncements] = useState(type === 1 ? announcementRedux.unreadAnnouncementData : announcementRedux.otherAnnouncementData)
    const [take, setTake] = useState(Constants.ApiResponseQuantity)

    useEffect(() => {
        callApi()

        props.navigation.setParams({
            title: type === 1
                ? (main.languageResource.r_unread_announcement_title_lowercase || strings('r_unread_announcement_title_lowercase'))
                : (main.languageResource.r_other_announcement_title_lowercase || strings('r_other_announcement_title_lowercase'))
        })
    }, [])

    const initRef = useRef(false)
    useEffect(() => {
        if (!initRef.current) {
            initRef.current = true
            return
        }
        if (type === 1) {
            setAnnouncements(announcementRedux.unreadAnnouncementData)
        }

    }, [announcementRedux.unreadAnnouncementData])

    const initOtherRef = useRef(false)
    useEffect(() => {
        if (!initOtherRef.current) {
            initOtherRef.current = true
            return
        }
        if (type === 2) {
            setAnnouncements(announcementRedux.otherAnnouncementData)
        }
    }, [announcementRedux.otherAnnouncementData])

    const callApi = () => {
        const requestBody = {
            remote: true,
            accessToken: main.authData.access_token,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            state: 4,
            take: take,
            searchedWord: "",
            skip: take - Constants.ApiResponseQuantity,
            type: type,
            loader: true
        }
        dispatch(AnnouncementActions.getAnnouncementRequest(requestBody))
    }

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={announcements}
            contentContainerStyle={{ paddingTop: 5 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View key={index}>
                    <AnnouncementItem announcement={item} navigation={props.navigation} refresh={() => callApi()} />
                </View>
            )}
        />
    )
}


ShowAllAnnouncement.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
        title: params.title,
        headerLeft: (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" color="black" size={25} onPress={() => {
                    const backActions = NavigationActions.back({
                        key: null
                    });
                    navigation.dispatch(backActions)
                }} />
            </View>
        )
    }
}

export default ShowAllAnnouncement