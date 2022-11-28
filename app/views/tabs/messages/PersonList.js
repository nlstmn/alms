import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import TextView from '../../../components/TextView';
import MessagesActions from '../../../redux/MessagesRedux';
import SearchBar from '@ant-design/react-native/lib/search-bar'
import { strings } from '../../../locales/i18n';

function PersonList(props) {
    const dispatch = useDispatch()
    const main = useSelector(state => state.main)
    const messages = useSelector(state => state.messages)

    const [refreshing, setRefreshing] = useState(false)
    const [contacts, setContacts] = useState(messages.personsData)
    const [selectedPerson, setSelectedPerson] = useState(null)

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
        setContacts(messages.personsData)
    }, [messages.personsData])

    const initOriginMessageRef = useRef(true)
    useEffect(() => {
        if (initOriginMessageRef.current) {
            initOriginMessageRef.current = false
            return
        }
        console.log("daha onceden olusturulmus")
        const message = {
            isGroup: false,
            recipientUserId: selectedPerson.userId,
            originMessageId: messages.messageOriginPerson.originMessageId,
            recipientName: selectedPerson.nameSurname
        }
        props.navigation.navigate('MessageDetailNew', { message, refresh: refresh })
    }, [messages.messageOriginPerson])

    const initOriginMessageErrorRef = useRef(true)
    useEffect(() => {
        if (initOriginMessageErrorRef.current) {
            initOriginMessageErrorRef.current = false
            return
        }
        if (messages.messageOriginPersonErrorMessage.code == 404) {
            const message = {
                isGroup: false,
                recipientUserId: selectedPerson.userId,
                recipientName: selectedPerson.nameSurname
            }
            props.navigation.navigate('MessageDetailNew', { message, refresh: refresh, initChat: true })
            console.log("daha onceden olusturulmamis")
        }
    }, [messages.messageOriginPersonErrorMessage])

    const callApi = (loader = true) => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            take: 1000,
            skip: 0,
            loader
        }

        dispatch(MessagesActions.getPersonsRequest(requestBody))
    }

    const getRecipientOriginMessage = (item) => {
        const requestBody = {
            almsPlusApiUrl: main.selectedOrganization.almsPlusApiUrl,
            accessToken: main.authData.access_token,
            recipientId: item.userId,
            recipientType: "User"
        }
        dispatch(MessagesActions.getMessageOriginRequest(requestBody))
    }

    const itemClicked = (item) => {
        setSelectedPerson(item)
        getRecipientOriginMessage(item)
    }

    const refresh = () => {

    }

    return (
        <View style={{ flex: 1 }} >
             <SearchBar
                autoFocus
                placeholder={main.languageResource.r_search_contact_input_placeholder ||strings('r_search_contact_input_placeholder')}
                cancelText={main.languageResource.r_cancal_text ||strings('r_cancal_text')}
                // style={{ padding: 20, flex: 1 }}
                onChange={(text) => {
                    if (text.length > 0) {
                        setContacts(messages.personsData.filter((p)=>p.nameSurname.toLowerCase().includes(text.toLowerCase())))
                    } else {
                        setContacts(messages.personsData)
                    }
                }}
            />
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true)
                    callApi(false)
                }} />}
                style={{ padding: 10 }}
                // contentContainerStyle={{ flex: 1, padding: 10 }}
                keyExtractor={(item, index) => index.toString()}
                // ItemSeparatorComponent={()=><View  />}
                data={contacts}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        style={{ padding: 10, alignItems: 'center', flex: 1, flexDirection: 'row' }}
                        onPress={() => itemClicked(item)}
                    >
                        <Avatar size={40} rounded icon={{ name: 'ios-person', type: 'ionicon' }} />
                        <TextView style={{ color: 'black', marginStart: 10, flex: 1, fontSize: 15 }} weight="bold" >{item.nameSurname}</TextView>
                    </TouchableOpacity>
                )} />
        </View>
    )
}

export default PersonList