import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Text, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import TextView from '../../../components/TextView';
import { strings } from '../../../locales/i18n';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import AnnouncementActions from '../../../redux/AnnouncementRedux';
import Colors from '../../../theme/Colors';
import FontSize from '../../../theme/FontSize';
import { Button, CheckBox } from "react-native-elements";
import ActivityAttachments from '../../../components/ActivityAttachments';
import DocumentPicker from 'react-native-document-picker';
import Constants from '../../../services/Constants';
import { bytesToSize, createGuid } from '../../../helpers/Calculate';
import AppTheme from '../../../theme/AppTheme';
import { showMessage, hideMessage } from "react-native-flash-message";
import { warningMessageData, successMessageData } from '../../../helpers/FlashMessageData';
import Uploader from '../../../components/Uploader';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment"
import { addAnnouncementValidation } from '../../../helpers/Validations';

const DatepickerActionType = {
    startDate: 1,
    endDate: 2
}
function AddAnnouncement(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const announcementRedux = useSelector(state => state.announcement)


    const [announcement, setAnnouncement] = useState({
        title: "",
        content: "",
        showOnStartup: false,
        isShowDateRange: false,
        files: [],
        fileUploadKey: createGuid(),
        startDate: null,
        endDate: null,
        dateRange: "",
    })
    const [receiver, setReceiver] = useState([])
    const [selectedReceiver, setSelectedReceiver] = useState([])
    const [uploaderVisibility, setUploaderVisibility] = useState(false)
    const [uploadingFileCount, setUploadingFileCount] = useState(0)
    const [uplaodingFile, setUplaodingFile] = useState(null)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datepickerActionType, setDatepickerActionType] = useState(null)


    const titleRef = useRef(null)
    const contentRef = useRef(null)
    const actionSheetRef = useRef(null)

    useEffect(() => {
        getAnnoucementReceiver()
        props.navigation.setParams({
            title: main.languageResource.r_page_new_announcement_title || strings('r_page_new_announcement_title')
        })
    }, [])

    const initRef = useRef(true)
    useEffect(() => {
        if (initRef.current) {
            initRef.current = false
            return
        }
        setReceiver(announcementRedux.searchAnnouncementReceiverData)
    }, [announcementRedux.searchAnnouncementReceiverData])

    const initAnnouncementSaveRef = useRef(true)
    useEffect(() => {
        if (initAnnouncementSaveRef.current) {
            initAnnouncementSaveRef.current = false
            return
        }
        props.navigation.goBack()
        showMessage(successMessageData({ message: main.languageResource.r_save_announcement_success || strings('r_save_announcement_success') }))
    }, [announcementRedux.addAnnouncementResponseData])

    const initUploadingRef = useRef(true)
    useEffect(() => {
        if (initUploadingRef.current) {
            initUploadingRef.current = false
            return
        }
        setUplaodingFile(announcement.files[uploadingFileCount - 1])
    }, [uploadingFileCount])


    const uplaodingFileRef = useRef(true)
    useEffect(() => {
        if (uplaodingFileRef.current) {
            uplaodingFileRef.current = false
            return
        }
        setUploaderVisibility(true)
    }, [uplaodingFile])


    const getAnnoucementReceiver = () => {
        const requestBody = {
            accessToken: main.authData.access_token,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            data: JSON.stringify({
                "ClassId": "",
                "GetTypes": "Class,Course",
                "SearchedText": "",
                "Skip": 0,
                "Take": 20,
                "userTypes": [
                    8
                ]
            })
        }
        dispatch(AnnouncementActions.searchAnnouncementReceiverRequest(requestBody))
    }

    const saveAnnouncement = () => {
        if (addAnnouncementValidation(announcement, selectedReceiver)) {
            if (announcement.files.length > 0) {
                setUploadingFileCount(uploadingFileCount + 1)
            } else {
                callSaveAnnouncement()
            }
        }
    }

    const callSaveAnnouncement = () => {
        var targets = []
        selectedReceiver.forEach((r) => {
            targets.push(r.value)
        })
        const requestBody = {
            accessToken: main.authData.access_token,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            data: JSON.stringify({
                "alwaysOnTop": false,
                "announcementId": "",
                "content": announcement.content,
                "dateFormat": "d.m.Y",
                "dateRange": announcement.isShowDateRange
                    ? moment(announcement.startDate).format("DD.MM.YYYY") + " - " + moment(announcement.endDate).format("DD.MM.YYYY")
                    : "",
                "deletedFiles": [""],
                "endDate": announcement.endDate,
                "fileUploadKey": announcement.fileUploadKey,
                "isEmail": false,
                "isNotification": false,
                "isPin": false,
                "isShowDateRange": announcement.isShowDateRange,
                "isShowOnStartUp": announcement.showOnStartup,
                "isSms": false,
                "notificationContent": "",
                "smsContent": "",
                "startDate": announcement.startDate,
                "subject": announcement.title,
                "targets": targets
            })
        }
        console.log("request Body: ", requestBody)
        dispatch(AnnouncementActions.addAnnouncementRequest(requestBody))
    }

    const openFilePicker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: Platform.OS === "android" ? Constants.AndroidMimeTypes : Constants.IOSMimeTypes,
            });
            console.log("selected res: ", res);
            setAnnouncement({ ...announcement, files: [...announcement.files, res] })

        } catch (error) {
            console.log("error : ", error)
        }
    }

    const renderPicker = () => {
        const menuOptions = [];

        receiver.map((r, Index) => {
            if (Platform.OS === 'android') {
                menuOptions.push(
                    <TextView weight="bold" style={{ textAlign: "center", color: Colors.course_weeks_menu_item_text_color, fontSize: FontSize.course_weeks_item }}>
                        {r.label}
                    </TextView>)
            }
            else {
                menuOptions.push(<Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", padding: 10 }} >
                    {r.label}
                </Text>)
            }
        })

        if (Platform.OS === 'android') {
            menuOptions.push(<TextView weight="bold" style={{ color: 'black', fontSize: 18 }}>
                {main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')}
            </TextView>);
        } else {
            menuOptions.push(<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", padding: 10 }} >{main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')}</Text>)
        }

        return (<ActionSheet
            ref={actionSheetRef}
            options={menuOptions}
            cancelButtonIndex={menuOptions.length - 1}
            onPress={(index) => {
                if (index == menuOptions.length - 1) return
                if (selectedReceiver.find(data => data.value === receiver[index].value)) return
                console.log("selected : ", [...selectedReceiver, receiver[index]])
                setSelectedReceiver([...selectedReceiver, receiver[index]])
            }}
        />)
    }

    const renderAttachment = () => {
        return (
            <View style={{ padding: 10, marginTop: 10, marginBottom: 10 }} >
                <TextView weight="bold" style={{ color: "black", fontSize: 16, marginBottom: 10 }} >{main.languageResource.r_new_announcement_upload_file || strings('r_new_announcement_upload_file')}</TextView>
                {announcement.files.map((file, fIndex) => (
                    <TouchableOpacity key={fIndex} activeOpacity={0.7} style={style.fileAttachmentContainer} onPress={() => {
                        setAnnouncement({ ...announcement, files: announcement.files.filter((f) => f.uri !== file.uri) })
                    }}>
                        <Ionicons name="ios-attach" size={20} />
                        <TextView style={{ flex: 1, marginStart: 5, color: 'black' }} weight="regular" numberOfLines={1} ellipsizeMode={'middle'}>{file.name}</TextView>

                        <TextView style={style.fileAttachmentSize} weight="bold">{bytesToSize(file.size)}</TextView>
                        <Ionicons name="ios-close" size={25} style={{ marginStart: 10 }} />
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={{ borderWidth: 0.3, padding: 10, backgroundColor: "#eeede9", borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => { openFilePicker() }}>
                    <Ionicons name="ios-attach" size={20} />
                    <TextView style={{ marginStart: 5 }}>{strings('r_activity_answer_by_file_upload')}</TextView>

                </TouchableOpacity>

            </View>
        )
    }

    const renderActionButton = () => {
        return (
            <Button
                buttonStyle={{ backgroundColor: Colors.primary, margin: 10 }}
                title={strings('r_save_button_text')}
                onPress={() => saveAnnouncement()}
                titleStyle={{ marginEnd: 8, marginBottom: 3, fontFamily: AppTheme.fonts.medium }} />
        )
    }

    const renderUploader = () => {
        return uploaderVisibility && (
            <Uploader
                uploadingData={{
                    "almsPlusApiUrl": main.selectedOrganization.almsPlusApiUrl,
                    "accessToken": main.authData.access_token,
                    "selectedFile": uplaodingFile,
                    "fileUploadId": announcement.fileUploadKey
                }}
                visibility={uploaderVisibility}
                onCancel={() => {
                    setUploaderVisibility(false)
                }}
                onError={() => {
                    setUploaderVisibility(false)
                }}
                uplaodingProgress={() => { }}
                onSuccess={() => {
                    setUploaderVisibility(false)
                    if (uploadingFileCount === announcement.files.length) {
                        callSaveAnnouncement()
                    } else {
                        setUploadingFileCount(uploadingFileCount + 1)
                    }
                }}
            />
        )
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.log("date: ", date)
        const selectedDate = moment(date).format("YYYY-MM-DD")
        console.log("selectedDate: ", selectedDate)
        if (datepickerActionType === DatepickerActionType.startDate) {
            setAnnouncement({ ...announcement, startDate: selectedDate })
        } else {
            setAnnouncement({ ...announcement, endDate: selectedDate })
        }
        setDatepickerActionType(null)
        hideDatePicker();
    };



    const renderDateInputs = () => {
        return announcement.isShowDateRange ? (
            <View style={{ padding: 10 }}>
                <TouchableOpacity style={style.dateInput} onPress={() => {
                    setDatepickerActionType(DatepickerActionType.startDate)
                    showDatePicker()
                }}>
                    <TextView style={{ flex: 1 }}>{main.languageResource.r_new_announcement_start_date_text || strings('r_new_announcement_start_date_text')}</TextView>
                    {
                        announcement.startDate
                            ? <TextView>{moment(announcement.startDate).format("DD-MM-YYYY")}</TextView>
                            : <Ionicons name="ios-arrow-forward" />
                    }

                </TouchableOpacity>

                <TouchableOpacity style={[style.dateInput, { marginTop: 5 }]} onPress={() => {
                    setDatepickerActionType(DatepickerActionType.endDate)
                    showDatePicker()
                }}>
                    <TextView style={{ flex: 1 }}>{main.languageResource.r_new_announcement_end_date_text || strings('r_new_announcement_end_date_text')}</TextView>
                    {
                        announcement.endDate
                            ? <TextView>{moment(announcement.endDate).format("DD-MM-YYYY")}</TextView>
                            : <Ionicons name="ios-arrow-forward" />
                    }

                </TouchableOpacity>
            </View>
        ) : null
    }

    const renderDatePicker = () => {
        return (
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        )
    }

    return (
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={"handled"} >
            <TouchableOpacity activeOpacity={1} style={style.titleContainer} onPress={() => titleRef.current.focus()}>
                <TextInput
                    ref={titleRef}
                    onChangeText={(title) => {
                        setAnnouncement({ ...announcement, title })
                    }}
                    placeholder={main.languageResource.r_new_announcement_title_placeholder || strings('r_new_announcement_title_placeholder')}
                    returnKeyType="next"
                    onSubmitEditing={() => contentRef.current.focus()}
                    autoCapitalize={"sentences"}
                    style={{ padding: 10 }}
                    // containerStyle={style.textInputContainer}
                    value={announcement.title}
                    keyboardType="default" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} style={style.contentContainer} onPress={() => contentRef.current.focus()}>
                <TextInput
                    ref={contentRef}
                    placeholder={main.languageResource.r_new_announcement_content_placeholder || strings('r_new_announcement_content_placeholder')}
                    returnKeyType="done"
                    autoCapitalize={"sentences"}
                    value={announcement.content}
                    onChangeText={(content) => {
                        setAnnouncement({ ...announcement, content })
                    }}
                    style={{ padding: 10 }}
                    multiline
                    numberOfLines={5}
                    keyboardType='default' />
            </TouchableOpacity>

            <View style={style.receipentsContainer} >
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => actionSheetRef.current.show()}>
                    <TextView style={{ flex: 1 }}>{main.languageResource.r_new_announcement_recipient || strings('r_new_announcement_recipient')}</TextView>
                    <Ionicons name={"ios-arrow-down"} size={25} />
                </TouchableOpacity>
                <FlatList
                    style={selectedReceiver.length > 0 ? { marginTop: 10 } : {}}
                    showsHorizontalScrollIndicator={false}
                    data={selectedReceiver}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity key={index} style={{ padding: 5, margin: 2, flexDirection: "row", alignItems: "center", backgroundColor: "#D3D3D3", borderRadius: 5 }}
                            onPress={() => setSelectedReceiver(selectedReceiver.filter(s => s.value != item.value))} >
                            <TextView>{item.label.length < 20
                                ? `${item.label}`
                                : `${item.label.substring(0, 17)}...`}</TextView>
                            <Ionicons name={"ios-close"} size={20} style={{ marginStart: 5 }} />
                        </TouchableOpacity>
                    )}
                />
            </View>
            {renderAttachment()}
            <View>
                <CheckBox
                    checkedColor={Colors.primary}
                    center
                    title={main.languageResource.r_new_annoucement_showonstartup || strings('r_new_annoucement_showonstartup')}
                    textStyle={{ flex: 1 }}
                    checked={announcement.showOnStartup}
                    onPress={() => setAnnouncement({ ...announcement, showOnStartup: !announcement.showOnStartup })}
                />

                <CheckBox
                    checkedColor={Colors.primary}
                    center
                    title={main.languageResource.r_new_announcement_isshowdaterange || strings('r_new_announcement_isshowdaterange')}
                    textStyle={{ flex: 1 }}
                    checked={announcement.isShowDateRange}
                    onPress={() => setAnnouncement({ ...announcement, isShowDateRange: !announcement.isShowDateRange, endDate: null, startDate: null })}
                />
            </View>
            {renderDateInputs()}
            {renderPicker()}
            {renderActionButton()}
            {renderUploader()}
            {renderDatePicker()}
        </ScrollView>
    )
}

AddAnnouncement.navigationOptions = ({ navigation }) => {
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
        ),
    }
}
const style = StyleSheet.create({
    contentContainer: { minHeight: 200, borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10, margin: 10 },
    titleContainer: { borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10, margin: 10 },
    receipentsContainer: { borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10, margin: 10 },
    textInputContainer: { paddingTop: 0, paddingBottom: 10 },
    fileAttachmentContainer: {
        borderRadius: 5,
        borderWidth: 0.3,
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    fileAttachmentSize: {
        fontSize: 12,
        color: 'black',
        textAlign: 'right'
    },
    dateInput: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafafa", borderRadius: 5, padding: 10, borderWidth: 1, borderColor: "#f0f0f0" }
})
export default AddAnnouncement