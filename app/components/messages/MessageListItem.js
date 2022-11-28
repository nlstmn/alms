import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import TextView from '../TextView';
import { Avatar } from 'react-native-elements';
import moment from 'moment';
import { getDateText } from '../../helpers/Calculate';
import { Icon } from 'react-native-elements';
import HTML from 'react-native-render-html';
import AppTheme from '../../theme/AppTheme';
import Colors from '../../theme/Colors';


function MessageListItem({ data, navigation, refresh, currentUserId }) {
    const lastMessage = "<p>" + data.lastMessage + "</p>"

    return (
        <TouchableOpacity style={style.item} activeOpacity={0.5} onPress={() => {
            navigation.navigate('MessageDetailNew', { message: data, refresh: refresh })
        }}>
            <Avatar size={40} rounded title={data.name && data.name.split(' ').slice(0, 3).map(function (item) { return item[0] }).join('').toUpperCase()} titleStyle={{ fontSize: 13 }} />
            <View style={style.content}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextView style={style.title} weight="bold" numberOfLines={2} ellipsizeMode='tail'>{data.name && data.name.trim()}</TextView>
                    {/* <TextView style={style.date}>{moment(data.lastMessageDate).format('HH:mm')}</TextView> */}
                    <TextView style={style.date}>{getDateText(data.lastMessageDate)}</TextView>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    {/* <TextView style={style.lastMessage} numberOfLines={2} ellipsizeMode='tail' >{data.lastMessage}</TextView> */}
                    <View style={{ flex: 1 }}>
                        {data.lastMessage ?
                            <HTML
                                source={{ html: lastMessage }}
                                baseFontStyle={{ fontFamily: AppTheme.fonts.medium }}
                                renderers={{
                                    p: (_, children, convertedCSSStyles, { allowFontScaling, key }) => {
                                        return (
                                            <Text ellipsizeMode='tail' numberOfLines={2} allowFontScaling={allowFontScaling} key={key} style={[convertedCSSStyles, { "flex": 1 }]}>{children}</Text>
                                        );
                                    }
                                }} />
                            : <TextView style={style.lastMessage} numberOfLines={2} ellipsizeMode='tail' ></TextView>
                        }
                    </View>
                    {
                        // currentUserId === data.lastSenderId
                        //     ? data.isDelivery
                        //         ? <Icon color={'#09f'} size={18} name={'check-all'} type={'material-community'} />
                        //         : <Icon size={18} name={'check'} type={'material-community'} />
                        //     : data.myUnreadCount > 0
                        //         ? <TextView style={{ backgroundColor: Colors.primary, fontSize: 11, color: 'white', padding: 3, borderRadius: 10, width: 20, height: 20, textAlign: 'center' }}>{data.myUnreadCount}</TextView>
                        //         : null
                        currentUserId !== data.lastSenderId && data.myUnreadCount > 0
                            ? <TextView style={{ backgroundColor: Colors.primary, fontSize: 11, color: 'white', padding: 3, borderRadius: 10, width: 20, height: 20, textAlign: 'center' }}>{data.myUnreadCount}</TextView>
                            : null
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default MessageListItem

const style = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flexDirection: 'row',
        margin: 5,
        padding: 10,
        borderRadius: 2,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    content: {
        marginStart: 10,
        marginEnd: 10,
        flex: 1
    },
    title: {
        color: 'black',
        fontSize: 15,
        flex: 1
    },
    date: {
        fontSize: 11,
        marginStart: 5
    },
    lastMessage: {
        flex: 1
    }
})