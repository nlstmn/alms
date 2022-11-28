import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity } from 'react-native';
import SearchBar from '@ant-design/react-native/lib/search-bar'
import { useDispatch, useSelector } from 'react-redux';
import Constants from '../../../services/Constants';
import AnnouncementActions from '../../../redux/AnnouncementRedux';
import AnnouncementItem from "../../../components/announcement/AnnouncementItem";
import EmptyPage from '../../../components/EmptyPage';
import { strings } from '../../../locales/i18n';

function SearchAnnouncement(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const announcementRedux = useSelector(state => state.announcement)

    const [announcements, setAnnouncements] = useState(null)

    const initRef = useRef(true)
    useEffect(() => {
        if (initRef.current) {
            initRef.current = false
            return
        }
        setAnnouncements(announcementRedux.searchAnnouncementData)
    }, [announcementRedux.searchAnnouncementData])

    const callApi = (searchedWord = '') => {
        const requestBody = {
            remote: true,
            accessToken: main.authData.access_token,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            state: 4,
            take: Constants.ApiResponseQuantity,
            searchedWord: searchedWord,
            skip: 0,
            type: 3,
            loader: false
        }
        dispatch(AnnouncementActions.getAnnouncementRequest(requestBody))
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: "#efeff4", alignItems: "center", flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <SearchBar
                        autoFocus
                        placeholder={ main.languageResource.r_search_announcement_input_placeholder ||strings('r_search_announcement_input_placeholder')}
                        cancelText={ main.languageResource.r_cancal_text ||strings('r_cancal_text')}
                        showCancelButton
                        onCancel={()=>props.navigation.goBack()}
                        style={{ padding: 5, flex: 1 }}
                        onChange={(text) => {
                            if (text.length > 0) {
                                callApi(text)
                            } else {
                                setAnnouncements([])
                            }
                        }}
                    />
                </View>
            </View>
            {announcements === null
                ? <EmptyPage description={ main.languageResource.r_search_announcement_empty_page_title ||strings('r_search_announcement_empty_page_title')} />
                : announcements.length === 0
                    ? <EmptyPage description={ main.languageResource.r_search_announcement_not_found ||strings('r_search_announcement_not_found')} />
                    : <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        data={announcements}
                        contentContainerStyle={{ paddingTop: 5 }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View key={index}>
                                <AnnouncementItem announcement={item} navigation={props.navigation}
                                    refresh={() => { }} />
                            </View>
                        )}
                    />
            }
        </SafeAreaView>
    )
}

SearchAnnouncement.navigationOptions = ({ navigation }) => {
    return {
        header: null
    }
}
export default SearchAnnouncement