import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import TextView from '../../../components/TextView';
import SearchBar from '@ant-design/react-native/lib/search-bar'
import MessagesActions from '../../../redux/MessagesRedux';
import { Avatar } from 'react-native-elements';
import { strings } from '../../../locales/i18n';

function GroupsList(props) {

    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const messages = useSelector(state => state.messages)

    const [refreshing, setRefreshing] = useState(false)
    const [groups, setGroups] = useState(messages.groupsData)
    const [selectedGroup, setSelectedGroup] = useState(null)

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
        setGroups(messages.groupsData)
    }, [messages.groupsData])

    const initOriginMessageRef = useRef(true)
    useEffect(() => {
        if (initOriginMessageRef.current) {
            initOriginMessageRef.current = false
            return
        }
        console.log("daha onceden olusturulmus")
        const message = {
            isGroup: true,
            originMessageId: messages.messageOrigin.originMessageId,
            name: selectedGroup.groupName
        }
        props.navigation.navigate('MessageDetailNew', { message, refresh: refresh })
    }, [messages.messageOrigin])

    const initOriginMessageErrorRef = useRef(true)
    useEffect(() => {
        if (initOriginMessageErrorRef.current) {
            initOriginMessageErrorRef.current = false
            return
        }
        if (messages.messageOriginErrorMessage.code == 404) {
            const message = {
                isGroup: true,
                originMessageId: selectedGroup.classId,
                name: selectedGroup.groupName
            }
            props.navigation.navigate('MessageDetailNew', { message, refresh: refresh, initChat: true })
            console.log("daha onceden olusturulmamis")
        }
    }, [messages.messageOriginErrorMessage])

    const callApi = (loader = true) => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            take: 1000,
            skip: 0,
            loader
        }

        dispatch(MessagesActions.getGroupsRequest(requestBody))
    }

    const getRecipientOriginMessage = (item) => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            recipientId: item.classId,
            recipientType: "Class"
        }
        dispatch(MessagesActions.getMessageOriginRequest(requestBody))
    }

    const itemClicked = (item) => {
        setSelectedGroup(item)
        getRecipientOriginMessage(item)
    }

    const refresh = () => {

    }

    return (
        <View style={{ flex: 1 }} >
            <SearchBar
                autoFocus
                placeholder={main.languageResource.r_search_group_input_placeholder ||strings('r_search_group_input_placeholder')}
                cancelText={main.languageResource.r_cancal_text ||strings('r_cancal_text')}
                // style={{ padding: 20, flex: 1 }}
                onChange={(text) => {
                    if (text.length > 0) {
                        setGroups(messages.groupsData.filter((g)=>g.groupName.toLowerCase().includes(text.toLowerCase())))
                    } else {
                        setGroups(messages.groupsData)
                    }
                }}
            />
            <FlatList
                style={{ padding: 10 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true)
                    callApi(false)
                }} />}
                // contentContainerStyle={{ flex: 1, padding: 10 }}
                keyExtractor={(item, index) => index.toString()}
                // ItemSeparatorComponent={()=><View  />}
                data={groups}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        style={{ padding: 10, alignItems: 'center', flex: 1, flexDirection: 'row' }}
                        onPress={() => itemClicked(item)}
                    >
                        <Avatar size={40} rounded icon={{ name: 'ios-person', type: 'ionicon' }} />
                        <TextView style={{ color: 'black', marginStart: 10, fontSize: 15, flex: 1 }} weight="bold" >{item.groupName}</TextView>
                    </TouchableOpacity>
                )} />
        </View>
    )
}

export default GroupsList