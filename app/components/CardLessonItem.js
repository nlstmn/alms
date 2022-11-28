import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '../theme/Colors';
import TextView from './TextView';
import * as Progress from 'react-native-progress';
import { strings } from '../locales/i18n';
import Constants from '../services/Constants';


function CardLessonItem({ data, navigation, userType, theme }) {
    // console.log("CardLessonItem: ", data)
    return (
        <TouchableOpacity style={style.card} onPress={() => navigation.navigate('courseDetail', { Course: data ,theme})} activeOpacity={0.7}>
            <View style={style.header}>
                <TextView style={style.lessonName} weight="bold">{data.name}</TextView>
                <TextView style={style.teacherName}>{data.teachers}</TextView>
            </View>

            {/* Total completion */}
            {
                userType == Constants.UserTypes.Student
                    ?
                    <View style={{ padding: 10, backgroundColor: "white", borderBottomStartRadius: 5, borderBottomEndRadius: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextView style={style.totalCompletionText} weight="bold">{strings('r_activity_total_completion')}</TextView>
                            <TextView style={style.completionProgress} >{data.progress}%</TextView>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Progress.Bar progress={data.progress / 100} width={(Dimensions.get('screen').width) * 0.90} color="gray" />
                        </View>
                    </View>
                    : null
            }

        </TouchableOpacity>
    )
}
export default CardLessonItem

const style = StyleSheet.create({
    card: {
        backgroundColor: Colors.primary,
        margin: 7,
        borderRadius: 5,
        // overflow: 'hidden',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        padding: 20,
    },
    lessonName: {
        color: 'white',
        fontSize: 17
    },
    teacherName: {
        color: 'white',
        fontSize: 13
    },
    totalCompletionText: {
        color: 'black',
        fontSize: 13
    },
    completionProgress: {
        color: 'white',
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingStart: 5,
        paddingEnd: 5
    }

})