import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TextView from '../TextView'
import { Avatar } from 'react-native-elements'
import { getDateText, listHtmlFormatter } from '../../helpers/Calculate'
import HTML from 'react-native-render-html';
import AppTheme from '../../theme/AppTheme'
import moment from 'moment'


function AnnouncementItem({ announcement, navigation, refresh }) {
    const displayName = announcement.fromDisplayName.match(/\b(\w)/g).join('').toUpperCase().substring(0, 2)

    // const body = "<p>" + announcement.body + "</p>"
    const startDate = moment(announcement.createdDate).format("YYYY-MM-DD hh:mm")
    return (
        <TouchableOpacity style={style.item} activeOpacity={0.5} onPress={() => {
            navigation.navigate('AnnouncementDetail', { announcement, refresh: () => refresh() })
        }}>
            <Avatar title={displayName} rounded size={40} />
            <View style={{ marginStart: 5, marginEnd: 5, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <TextView style={style.title} weight="bold" numberOfLines={1} ellipsizeMode="tail" >{announcement.subject}</TextView>
                    <TextView style={{ fontSize: 10, marginStart: 5 }} weight={'medium'} >{getDateText(startDate)}</TextView>
                </View>


                <HTML
                    source={{ html: announcement.body }}
                    baseFontStyle={{ fontFamily: AppTheme.fonts.medium }}
                    renderers={{
                        p: (_, children, convertedCSSStyles, { allowFontScaling, key }) => {
                            return (
                                <Text numberOfLines={2} allowFontScaling={allowFontScaling} key={key} style={convertedCSSStyles}>{children}</Text>
                            );
                        }
                    }} />


            </View>
        </TouchableOpacity>
    )
}
const style = StyleSheet.create({
    item: {
        padding: 10,
        marginStart: 10,
        marginEnd: 10,
        marginBottom: 10,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        elevation: 5,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    title: {
        color: 'black',
        fontSize: 15,
        flex: 1
    }
})
export default React.memo(AnnouncementItem)

