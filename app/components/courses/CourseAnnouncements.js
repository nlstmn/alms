import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import TextView from '../TextView';
import Colors from '../../theme/Colors';
import { strings } from '../../locales/i18n';
import moment from 'moment';
import HTML from 'react-native-render-html';
import AppTheme from '../../theme/AppTheme';
import { formatDateType1 } from '../../helpers/DateFormatter';


function CourseAnnouncements({ data, navigation }) {

    const refresh = () => {

    }

    return (
        <View style={style.card}>
            <TextView style={style.cardTitle} weight="bold">{strings('r_course_detail_tab_announcements')}</TextView>

            <FlatList
                data={data}
                // style={{ marginTop: 20, marginBottom: 20 }}
                keyExtractor={(item, index) => index.toString()}
                // ItemSeparatorComponent={() => <View style={{ height: 1, flex: 1, backgroundColor: "#808080" }} />}
                renderItem={({ item, index }) => {
                    const body = "<p>" + item.body + "</p>"

                    return (
                        <TouchableOpacity style={style.announcementItem} key={index} onPress={() => {
                            navigation.navigate('AnnouncementDetail', { announcement: item, refresh: () => refresh() })
                        }}>
                            <TextView style={style.announcementTitle} weight="bold">{item.subject}</TextView>

                            <HTML
                                source={{ html: item.body }}
                                baseFontStyle={{ fontFamily: AppTheme.fonts.medium, fontSize: 13 }}
                                renderers={{
                                    p: (_, children, convertedCSSStyles, { allowFontScaling, key }) => {
                                        return (
                                            <Text numberOfLines={1} allowFontScaling={allowFontScaling} key={key} style={convertedCSSStyles}>{children}</Text>
                                        );
                                    }
                                }} />

                            <TextView style={style.announcementDate}>{moment(item.startDate).format(formatDateType1())}</TextView>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}
export default CourseAnnouncements

const style = StyleSheet.create({
    card: {
        backgroundColor: "white",
        margin: 10,
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        // overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    cardTitle: {
        fontSize: 20,
        // marginStart:10,
        color: Colors.primary
    },
    announcementItem: {
        marginTop: 10,
        marginBottom: 10
    },
    announcementTitle: {
        fontSize: 16,
        color: 'black'
    },
    announcementDate: {
        marginTop: 5,
        fontSize: 13
    }
})