import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import TextView from './TextView';
import PercentageCircle from 'react-native-percentage-circle';
import Colors from '../theme/Colors';
import moment from 'moment';

function CardActivityItem({ data, navigation }) {
    return (
        <TouchableOpacity style={style.card} activeOpacity={1} onPress={() => {
            navigation.navigate("activityDetail", { activity: data, isMissingDetail: true,theme:"black" })
        }}>
            <PercentageCircle
                radius={30}
                borderWidth={5}
                percent={data.enrollmentProgress}
                color={Colors.primary}>
                <TextView weight="medium" style={{ fontSize: 15 }}>
                    {data.enrollmentProgress}%
                </TextView>
            </PercentageCircle>
            <View style={style.content}>
                <TextView style={style.activityName} numberOfLines={2} ellipsizeMode='tail' weight="bold">{data.activityName}</TextView>
                <TextView style={style.activityTeacher} numberOfLines={2} >{data.teacher} </TextView>

                <TextView style={style.activityDate} weight="bold">{moment(data.startDate).format('DD MMMM')} - {moment(data.endDate).format('DD MMMM')}</TextView>
            </View>
        </TouchableOpacity>
    )
}
export default CardActivityItem

const style = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 15,
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
        flexDirection: 'column',
        marginStart: 20,
    },
    activityName: {
        fontSize: 16,
        color: 'black',
    },
    activityTeacher: {
        marginTop: 10,
        fontSize: 11
    },
    activityDate: {
        color: Colors.primary
    }
})