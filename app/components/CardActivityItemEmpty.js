import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import TextView from './TextView';
import PercentageCircle from 'react-native-percentage-circle';
import Colors from '../theme/Colors';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { strings } from '../locales/i18n';

function CardActivityItemEmpty() {
    return (
        <TouchableOpacity style={style.card} activeOpacity={1}>

            <View style={style.content}>
                <Icon name="ios-checkmark-circle" type="ionicon" size={30} containerStyle={{ marginEnd: 10 }} />
                <TextView style={style.activityName} weight="bold">{strings('r_today_activity_empty')}</TextView>
                {/* <TextView style={style.activityTeacher} >{data.Teachers || 'Test user, Test user'} </TextView> */}

                {/* <TextView style={style.activityDate} weight="bold">{moment(data.startDate).format('DD MMMM')} - {moment(data.endDate).format('DD MMMM')}</TextView> */}
            </View>
        </TouchableOpacity>
    )
}
export default CardActivityItemEmpty

const style = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 20,
        margin: 7,
        // height: 150,
        width: 300,
        maxWidth: 300,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 0,
        marginEnd: 10

    },
    activityName: {
        fontSize: 16,
        color: 'black',
    },
    activityTeacher: {
        marginTop: 10,
        fontSize: 13
    },
    activityDate: {
        color: Colors.primary
    }
})