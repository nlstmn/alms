import React, { useEffect, useRef, useState } from "react"
import { ScrollView, View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementItem from "../../../components/announcement/AnnouncementItem";
import TextView from "../../../components/TextView";
import AnnouncementActions from '../../../redux/AnnouncementRedux';
import Constants from "../../../services/Constants";
import { Icon } from 'react-native-elements';
import EmptyCard from "../../../components/EmptyCard";
import { strings } from "../../../locales/i18n";


function AllAnnouncement(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const announcementRedux = useSelector(state => state.announcement)

    const [unreadAnnouncement, setUnreadAnnouncement] = useState(announcementRedux.announcementsData.filter((a) => a.isRead === false))
    const [otherAnnouncement, setOtherAnnouncement] = useState(announcementRedux.announcementsData.filter((a) => a.isRead != false))
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        callApi()
    }, [])

    const initRef = useRef(true)
    useEffect(() => {
        if (initRef.current) {
            initRef.current = false
            return
        }
        setRefreshing(false)
        setUnreadAnnouncement(announcementRedux.announcementsData.filter((a) => a.isRead === false))
        setOtherAnnouncement(announcementRedux.announcementsData.filter((a) => a.isRead == !false))
    }, [announcementRedux.announcementsData])

    useEffect(() => {
        if (announcementRedux.error) {
            setRefreshing(false)
        }
    }, [announcementRedux.error])

    const callApi = () => {
        const requestBody = {
            remote: true,
            accessToken: main.authData.access_token,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            state: 4,
            take: Constants.ApiResponseQuantity,
            searchedWord: "",
            skip: 0,
            loader: true
        }
        dispatch(AnnouncementActions.getAnnouncementRequest(requestBody))
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true)
                    callApi()
                }} />}
        >
            <View style={{ marginTop: 10 }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextView style={{ padding: 10, flex: 1 }} weight='bold'>{main.languageResource.r_unread_announcement_title || strings('r_unread_announcement_title')}</TextView>
                    {unreadAnnouncement.length !== 0 &&
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, marginEnd: 10, alignItems: 'center' }} onPress={() => {
                            props.navigation.navigate('ShowAllAnnouncement', { type: 1 })
                        }}>
                            <TextView style={{ color: 'black', marginEnd: 10 }}>{main.languageResource.r_all_text || strings('r_all_text')}</TextView>
                            <Icon name="md-arrow-forward" type="ionicon" color="black" />
                        </TouchableOpacity>
                    }
                </View>
                {unreadAnnouncement.length !== 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={unreadAnnouncement}
                        contentContainerStyle={{ paddingTop: 5 }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View key={index}>
                                <AnnouncementItem announcement={item} navigation={props.navigation} refresh={() => callApi()} />
                            </View>
                        )}
                    />
                    : <EmptyCard description={main.languageResource.r_unread_announcement_empty_text || strings('r_unread_announcement_empty_text')} />}
            </View>

            <View style={{ marginTop: 30 }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextView style={{ padding: 10, flex: 1 }} weight='bold'>{main.languageResource.r_other_announcement_title ||strings('r_other_announcement_title')}</TextView>
                    {
                        otherAnnouncement.length !== 0 &&
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, marginEnd: 10, alignItems: 'center' }} onPress={() => {
                            props.navigation.navigate('ShowAllAnnouncement', { type: 2 })

                        }}>
                            <TextView style={{ color: 'black', marginEnd: 10 }}>{main.languageResource.r_all_text || strings('r_all_text')}</TextView>
                            <Icon name="md-arrow-forward" type="ionicon" color="black" />
                        </TouchableOpacity>
                    }
                </View>
                {
                    otherAnnouncement.length !== 0 ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={otherAnnouncement}
                            contentContainerStyle={{ paddingTop: 5 }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View key={index}>
                                    <AnnouncementItem announcement={item} navigation={props.navigation} refresh={() => callApi()} />
                                </View>
                            )}
                        />
                        : <EmptyCard description={ main.languageResource.r_other_announcement_empty_text ||strings('r_other_announcement_empty_text')} />
                }
            </View>

        </ScrollView>
    )
}
export default AllAnnouncement