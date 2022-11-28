import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { TextInput } from "react-native"
import { TouchableOpacity } from "react-native"
import { KeyboardAvoidingView } from "react-native"
import { SafeAreaView } from "react-native"
import { Platform } from "react-native"
import { FlatList, Image, StyleSheet, View } from "react-native"
import { Avatar, Icon } from "react-native-elements"
import { useDispatch, useSelector } from "react-redux"
import TextView from "../../../components/TextView"
import MessageActions from "../../../redux/MessagesRedux";
import AddActivityActions from "../../../redux/AddActivityRedux";
import Constants from "../../../services/Constants"
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import DocumentPicker from 'react-native-document-picker';
import { createGuid, getDateText, getMessageDateText } from "../../../helpers/Calculate"
import Downloader from "../../../components/Downloader"
import HTML from 'react-native-render-html';

import MessageEmpty from '../../../assets/images/message_empty.png'
import AppTheme from "../../../theme/AppTheme"
import { strings } from "../../../locales/i18n"


function MessageDetailNew(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const messages = useSelector(state => state.messages)
    const addActivity = useSelector(state => state.addActivity)
    const [message, setMessage] = useState(props.navigation.getParam('message'))
    const [initChat, setInitChat] = useState(props.navigation.getParam('initChat'))
    const [messageList, setMessageList] = useState([])
    const [postMessage, setPostMessage] = useState("")
    const [lastMessage, setLastMessage] = useState(null)
    const [guid, setGuid] = useState(createGuid()) //TODO: ard arda file gonderimi?

    const [selectedFile, setSelectedFile] = useState(null)
    const [downloader, setDownloader] = useState(false)

    const listRef = useRef(null)


    useEffect(() => {
        androidSetAdjustResize()
        if (!initChat) {
            callApi()
        }
        console.log("message=> ", message)

        return () => {
            androidSetAdjustPan()
            props.navigation.state.params.refresh()
        }
    }, [])

    const messageDetailInit = useRef(true)
    useEffect(() => {
        if (messageDetailInit.current) {
            messageDetailInit.current = false
            return;
        }
        var reversed = Object.assign([], messages.getMessageDetailData)
        setMessageList(reversed.reverse())
        setLastMessage(messages.getMessageDetailData[messages.getMessageDetailData.length - 1])
    }, [messages.getMessageDetailData])

    const sendMessageResult = useRef(true)
    useEffect(() => {
        if (sendMessageResult.current) {
            sendMessageResult.current = false
            return;
        }
        console.log("refresh list")
        if (initChat) {
            setMessage({ ...message, originMessageId: messages.sendMessageData.originMessageId })
        }
        callApi()
        setInitChat(false)
    }, [messages.sendMessageData])

    const fileUploadInit = useRef(true)
    useEffect(() => {
        if (fileUploadInit.current) {
            fileUploadInit.current = false
            return
        }
        setInitChat(false)

        if (addActivity.uploadFile) {
            console.log("file uploaded, call file message api")
            callFileMessageApi()
        }


    }, [addActivity.uploadFile])

    const androidSetAdjustResize = () => {
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustResize()
        }
    }

    const androidSetAdjustPan = () => {
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustPan()
        }
    }

    const callFileMessageApi = () => {

        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: null
        }

        if (message.isGroup) {
            requestBody.data = JSON.stringify({
                body: "file",
                contextList: [
                    {
                        targetType: Constants.MessagesSendTargetTypes.Class,
                        contextId: message.originMessageId,
                    }
                ],
                fileUploadId: guid,
                originMessageId: initChat ? "-1" : message.originMessageId,
            })
        } else {
            requestBody.data = JSON.stringify({
                body: "file",
                contextList: [
                    {
                        targetType: Constants.MessagesSendTargetTypes.User,
                        contextId: message.recipientUserId,
                    }
                ],
                fileUploadId: guid,
                originMessageId: initChat ? "-1" : message.originMessageId,
            })
        }

        dispatch(MessageActions.sendMessageRequest(requestBody))
    }

    const callApi = () => {
        const requestBody = {
            remote: true,
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            messageId: initChat ? messages.sendMessageData.originMessageId : message.originMessageId,
            take: 1000, //TODO: pagination?
            skip: 0
        }
        dispatch(MessageActions.getMessageDetailRequest(requestBody))
    }

    const sendMessageApi = () => {
        setMessageList([...messageList, {
            "temp": true,
            "message": postMessage,
            "userId": main.userIdentity.userId,
            "fileId": ""
        }])
        setPostMessage("")
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            data: null
        }

        if (message.isGroup) {
            requestBody.data = JSON.stringify({
                body: postMessage,
                contextList: [
                    {
                        targetType: Constants.MessagesSendTargetTypes.Class,
                        contextId: message.originMessageId,
                    }
                ],
                fileUploadId: null,
                originMessageId: initChat ? "-1" : message.originMessageId,
            })
        } else {
            requestBody.data = JSON.stringify({
                body: postMessage,
                contextList: [
                    {
                        targetType: Constants.MessagesSendTargetTypes.User,
                        contextId: message.recipientUserId,
                    }
                ],
                fileUploadId: null,
                originMessageId: initChat ? "-1" : message.originMessageId,
            })
        }
        console.log("request body: ", requestBody)
        dispatch(MessageActions.sendMessageRequest(requestBody))
    }

    async function OpenFilePicker(androidMimeTypes, iosMimeTypes) {
        try {
            const res = await DocumentPicker.pick({
                type: Platform.OS === "android" ? androidMimeTypes : iosMimeTypes,
            })
            return res

        } catch (error) { //Kullanıcı döküman seçmeyi iptal ederse de buraya düşüyor!
            // console.log("error: ", error)
            // Alert.alert(strings('error_document_picker_title'), strings('error_document_picker_description'), [{ text: 'OK', onPress: () => console.log("ok") }])
        }
    }

    async function sendFileMessage() {
        const file = await OpenFilePicker(Constants.AndroidMimeTypes, Constants.IOSMimeTypes)
        if (file) {
            console.log("file: ", file)

            setMessageList([...messageList, {
                "temp": true,
                "message": file.name,
                "userId": main.userIdentity.userId,
                "fileId": ""
            }])
            setPostMessage("")


            const formData = new FormData()
            formData.append('fileUploadId', guid)

            var filebody = {
                uri: file.uri,
                name: file.name,
                type: file.type,
            };
            formData.append('', filebody)

            const requestBody = {
                almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
                accessToken: main.authData.access_token,
                formData: formData
            }
            dispatch(AddActivityActions.uploadFileRequest(requestBody))
        }
    }

    customNavigationBar = () => {
        return (
            <View style={Platform.OS == 'ios' ? { overflow: 'hidden', paddingBottom: 2 } : {}}>
                <View style={style.navigationBar}>
                    <Icon name="ios-arrow-back" type="ionicon" containerStyle={{ padding: 20 }} onPress={() => {
                        props.navigation.goBack()
                    }} />
                    {
                        message.isGroup
                            ? <Avatar size={30} rounded title={message.name.split(' ').slice(0, 3).map(function (item) { return item[0] }).join('').toUpperCase()} titleStyle={{ fontSize: 13 }} />
                            : <Avatar size={30} rounded title={message.recipientName.split(' ').slice(0, 3).map(function (item) { return item[0] }).join('').toUpperCase()} />
                    }
                    {
                        message.isGroup
                            ? <TextView weight="bold" style={style.navigationTitle}>{message.name}</TextView>
                            : <TextView weight="bold" style={style.navigationTitle}>{message.recipientName}</TextView>
                    }

                </View>
            </View>
        )
    }

    const fileMessageOnClick = (item) => {
        setDownloader(true)
        const file = {
            path: item.filePath,
            createdDate: item.date,
            fileName: item.fileName
        }
        setSelectedFile(file)
    }

    recipientMessageItem = (item, index) => {
        return (
            <TouchableOpacity key={index} style={style.recipientMessageItem} activeOpacity={0.5} onPress={() => {
                if (item.fileId.length > 0) {
                    fileMessageOnClick(item)
                }
            }}>
                {item.fileId.length > 0
                    ? <View>
                        <HTML
                            source={{ html: item.message }}
                            baseFontStyle={{ fontFamily: AppTheme.fonts.medium, color: "black", fontSize: 14 }} />
                            
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginEnd: 5 }}>
                            <Icon size={20} name={'ios-attach'} type={'ionicon'} />
                            <TextView style={style.fileName} numberOfLines={1} ellipsizeMode={'middle'} weight="medium" >{item.fileName}</TextView>
                        </View>
                        <TextView style={style.recipientMessageTime}>{getMessageDateText(item.date)}</TextView>
                    </View>
                    : <View>
                        {/* <TextView style={style.recipientMessageText} weight="medium" >{item.message}</TextView> */}
                        <HTML
                            source={{ html: item.message }}
                            baseFontStyle={{ fontFamily: AppTheme.fonts.medium, color: "black", fontSize: 14 }} />

                        <TextView style={style.recipientMessageTime}>{getMessageDateText(item.date)}</TextView>
                    </View>}

            </TouchableOpacity>
        )
    }
    senderMessageItem = (item, index) => {
        return (
            <TouchableOpacity key={index} style={style.senderMessageItem} activeOpacity={0.5} onPress={() => {
                if (item.fileId.length > 0) {
                    fileMessageOnClick(item)
                }
            }}>
                {item.fileId.length > 0
                    ? <View >
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginEnd: 5 }}>
                            <Icon size={20} name={'ios-attach'} type={'ionicon'} />
                            <TextView style={style.fileName} numberOfLines={1} ellipsizeMode={'middle'} weight="medium" >{item.fileName}</TextView>
                        </View>
                        <TextView style={style.senderMessageTime}>{getMessageDateText(item.date)}</TextView>
                    </View>
                    : <View>
                        {/* <TextView style={style.senderMessageText} weight="medium" >{item.message}</TextView> */}
                        <HTML
                            source={{ html: item.message }}
                            baseFontStyle={{ fontFamily: AppTheme.fonts.medium, color: "black", fontSize: 14 }} />
                        <TextView style={style.senderMessageTime}>{item.temp ? (main.languageResource.r_message_sending_text || strings('r_message_sending_text')) : getMessageDateText(item.date)}</TextView>
                    </View>
                }
            </TouchableOpacity>
        )
    }
    messagesList = () => {
        return <View style={{ flex: 1 }}>
            {messageList.length > 0 ?
                <FlatList
                    ref={(ref) => listRef.current = ref}
                    showsVerticalScrollIndicator={false}
                    style={style.container}
                    data={messageList}
                    // inverted
                    onContentSizeChange={() => listRef.current.scrollToEnd({ animated: true })}
                    onLayout={() => listRef.current.scrollToEnd({ animated: true })}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        if (main.userIdentity.userId == item.userId) {
                            return senderMessageItem(item, index)
                        } else {
                            return recipientMessageItem(item, index)
                        }
                    }}
                />
                : messages.getMessageDetailFetching
                    ? null
                    :
                    <View style={{ flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                        <Image source={MessageEmpty} style={{ width: 100, height: 100, resizeMode: "contain" }} />
                        <TextView style={{ marginTop: 10 }}>{main.languageResource.r_messages_empty_text || strings('r_messages_empty_text')}</TextView>
                    </View>
            }
        </View>
    }

    typeBox = () => {
        return (
            <View style={style.typeBox}>
                <TextInput style={{ flex: 1 }}
                    multiline
                    placeholder={main.languageResource.r_message_typebox_placeholder || strings('r_message_typebox_placeholder')}
                    value={postMessage} onChangeText={text => setPostMessage(text)} />
                {
                    postMessage.length != 0
                        ? <TouchableOpacity style={{ padding: 10, marginStart: 5, marginEnd: 5 }} onPress={() => {
                            sendMessageApi()
                        }}>
                            <Icon type="ionicon" name="md-send" />
                        </TouchableOpacity>
                        : <TouchableOpacity style={{ padding: 10, marginStart: 5, marginEnd: 5 }} onPress={() => {
                            sendFileMessage()
                        }}>
                            <Icon type="ionicon" name="ios-attach" />
                        </TouchableOpacity>
                }

            </View>
        )
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {customNavigationBar()}
                    {messagesList()}
                    {typeBox()}

                    {downloader && <Downloader file={selectedFile} accessToken={main.authData.access_token} onclose={() => {
                        setSelectedFile(null)
                        setDownloader(false)
                    }} onCancel={() => {
                        setSelectedFile(null)
                        setDownloader(false)
                    }} />}
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

MessageDetailNew.navigationOptions = ({ navigation }) => {
    return {
        header: null
    }
}

export default MessageDetailNew

const style = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
        // paddingBottom:5
    },
    navigationTitle: {
        color: "black",
        fontSize: 17,
        flex: 1,
        marginStart: 10
    },
    senderMessageItem: {
        backgroundColor: "#acdddf",
        padding: 10,
        marginStart: 50,
        marginTop: 5,
        marginBottom: 5,
        marginEnd: 10,
        borderRadius: 5
    },
    recipientMessageItem: {
        backgroundColor: "#eeede9",
        padding: 10,
        marginStart: 10,
        marginTop: 5,
        marginBottom: 5,
        marginEnd: 50,
        borderRadius: 5
    },
    senderMessageText: {
        fontSize: 14
    },
    senderMessageTime: {
        textAlign: "right",
        fontSize: 10
    },
    recipientMessageText: {
        fontSize: 14
    },
    recipientMessageTime: {
        textAlign: "left",
        fontSize: 10
    },
    typeBox: {
        backgroundColor: "#eeede9",
        padding: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    container: {
        backgroundColor: '#fbfaf6'
    },
    fileName: {
        color: "black",
        fontSize: 14,
        marginStart: 5
    }

})