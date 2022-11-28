import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Dimensions } from 'react-native';
import Colors from '../../theme/Colors';
import TextView from '../TextView';
import PercentageCircle from 'react-native-percentage-circle';

import * as Progress from 'react-native-progress';
import { strings } from '../../locales/i18n';
import { useSelector } from 'react-redux';

function CourseActivityProgress({ data }) {
    const [totalCompletion, setTotalCompletion] = useState(0)
    const main = useSelector(state => state.main)

    const totals = () => {
        var total = 0;
        data?.map(item => {
            total = total + ((item.completedCount / item.totalCount) * 100)
        })
        if (data !== null)
            setTotalCompletion((total / data.length).toFixed())
    }

    useEffect(() => {
        totals()
    }, [data])

    return (
        <View style={style.card} >
            <TextView style={style.activityText} weight="bold">{main.languageResource.r_course_activity_progress_title || strings('r_course_activity_progress_title')}</TextView>

            <FlatList
                data={data}
                style={{ marginTop: 10, marginBottom: 10 }}
                keyExtractor={(item, index) => index.toString()}
                // horizontal
                numColumns={4}
                renderItem={({ item, index }) => {
                    return (
                        <View style={style.activityItem} key={index}>
                            <PercentageCircle
                                radius={30}
                                innerColor={Colors.primary}
                                bgcolor="gray"
                                borderWidth={3}
                                percent={(item.completedCount / item.totalCount) * 100}
                                color="white">
                                <TextView weight="medium" style={{ fontSize: 15, color: 'white', textAlign: 'center' }}>
                                    {item.completedCount} / {item.totalCount}
                                </TextView>
                            </PercentageCircle>
                            <TextView style={style.activityType} numberOfLines={1} ellipsizeMode='tail'>{item.type}</TextView>
                        </View>
                    )
                }} />


            {/* Total completion */}
            <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextView style={style.totalCompletionText} weight="bold">{strings('r_activity_total_completion')}</TextView>
                    <TextView style={style.completionProgress} >{totalCompletion}%</TextView>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Progress.Bar progress={totalCompletion / 100} width={(Dimensions.get('screen').width) * 0.85} color="white" />
                </View>
            </View>
        </View>
    )
}
export default CourseActivityProgress

const style = StyleSheet.create({
    card: {
        backgroundColor: Colors.primary,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        // overflow: 'hidden'
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    activityText: {
        fontSize: 18,
        color: 'white'
    },
    activityItem: {
        flex: 1,
        margin: 10,
        alignItems: 'center'
    },
    activityType: {
        color: 'white',
        fontSize: 12
    },
    totalCompletionText: {
        color: 'white',
        fontSize: 13
    },
    completionProgress: {
        color: 'white',
    }
})