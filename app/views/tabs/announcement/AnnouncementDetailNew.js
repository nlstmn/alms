import React, { useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Avatar, Icon } from 'react-native-elements'
import TextView from "../../../components/TextView"
import { getDateText } from "../../../helpers/Calculate"
import Colors from "../../../theme/Colors"
import HTML from 'react-native-render-html';
import AppTheme from "../../../theme/AppTheme"
import { useDispatch, useSelector } from "react-redux"
import NetInfo from '@react-native-community/netinfo';
import AnnouncementRedux from '../../../redux/AnnouncementRedux';
import Downloader from "../../../components/Downloader"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import moment from "moment";
import { strings } from "../../../locales/i18n"

function AnnouncementDetailNew(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const announcementRedux = useSelector(state => state.announcement)

    const [announcement, setAnnouncement] = useState(props.navigation.getParam('announcement'))
    const [selectedFile, setSelectedFile] = useState(null)
    const [downloader, setDownloader] = useState(false)

    useEffect(() => {
        getDetail()

        props.navigation.setParams({
            title: main.languageResource.r_page_announcement_detail_title || strings('r_page_announcement_detail_title')
        })

        return () => {
            props.navigation.state.params.refresh()
        }

    }, [])


    const initRef = useRef(false)
    useEffect(() => {
        if (!initRef.current) {
            initRef.current = true
            return
        }
        setAnnouncement({ ...announcement, files: announcementRedux.announcementDetail.files })
    }, [announcementRedux.announcementDetail])

    const getDetail = () => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            remote: true,
            announcementId: announcement.announcementId
        }

        NetInfo.fetch().then(statu => {
            if (!statu.isConnected) {
                requestBody.remote = false;
            }
            dispatch(AnnouncementRedux.getAnnouncementDetailRequest(requestBody))
        });
    }


    const displayName = announcement.fromDisplayName.match(/\b(\w)/g).join('').toUpperCase().substring(0, 2)
    const startDate = moment(announcement.createdDate).format("YYYY-MM-DD hh:mm")
    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center', backgroundColor: 'white', elevation: 10 }}>
                <Avatar title={displayName} rounded size={40} />
                <View style={{ marginStart: 5, marginEnd: 5, flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextView style={{ flex: 1, fontSize: 13 }} weight="bold" >{announcement.fromDisplayName}</TextView>
                        <TextView style={{ fontSize: 10 }} weight={'medium'} >{getDateText(startDate)}</TextView>
                    </View>
                    <TextView style={{ color: 'black' }} weight="bold">{announcement.subject}</TextView>
                </View>
            </View>

            <View style={style.content}>

                <HTML
                    source={{ html: announcement.body }}
                    baseFontStyle={{ fontFamily: AppTheme.fonts.medium }} />

                {announcement.files && announcement.files.length > 0 &&
                    <View style={{ marginTop: 10 }}>
                        <TextView weight="bold" style={{ color: 'black', marginBottom: 10 }} >Dosya Ekleri</TextView>
                        {
                            announcement.files?.map((file, fIndex) => (
                                <TouchableOpacity style={style.fileItem} key={fIndex} onPress={() => {
                                    setSelectedFile(file)
                                    setDownloader(true)
                                }}>
                                    <Icon name={'ios-attach'} type={'ionicon'} size={20} color={'gray'} />
                                    <TextView style={style.fileItemName}>{file.fileName}</TextView>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                }

            </View>
            {downloader && <Downloader file={selectedFile} accessToken={main.authData.access_token} onclose={() => {
                setSelectedFile(null)
                setDownloader(false)
            }} onCancel={() => {
                setSelectedFile(null)
                setDownloader(false)
            }} />}

        </ScrollView>
    )
}

AnnouncementDetailNew.navigationOptions = ({ navigation }) => {
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

const style = StyleSheet.create({
    fileItem: {
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        padding: 8,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 1
    },
    fileItemName: {
        marginStart: 5
    },
    content: {
        padding: 15,
        margin: 15,
        borderRadius: 3,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    }
})
export default AnnouncementDetailNew