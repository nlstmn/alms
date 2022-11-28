import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TextView from '../TextView';
import Colors from '../../theme/Colors';
import PercentageCircle from 'react-native-percentage-circle';
import { Icon, Badge } from 'react-native-elements';
import Constants from '../../services/Constants';


function LessonItem({ data, navigation, userType }) {
    return (
        <TouchableOpacity style={style.card} onPress={() => navigation.navigate('courseDetail', { Course: data })} activeOpacity={0.8}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={style.lessonInfo}>
                    <TextView weight="bold" style={style.lessonName} numberOfLines={2}>
                        {data.name}
                    </TextView>
                    {data.teachers?.length !== 0 ?
                        <TextView numberOfLines={1} >
                            {data.teachers}
                        </TextView> : null}

                </View>
                {
                    userType == Constants.UserTypes.Student
                        ?
                        <View style={style.progressView}>
                            <PercentageCircle
                                radius={25}
                                borderWidth={3}
                                percent={data.progress}
                                color={Colors.primary}>
                                <TextView weight="medium" style={{ fontSize: 13, color: 'black' }}>{data.progress}%</TextView>
                            </PercentageCircle>
                        </View>
                        : null
                }
            </View>

            <View>
                <View>
                    <Icon name={'ios-notifications'} type={'ionicon'} color={data.isNotifications === 1 ? 'black' : 'gray'} />
                    {data.isNotifications === 1 && <Badge status={'warning'} containerStyle={{ position: 'absolute', top: -3, right: -3 }} />}
                </View>

            </View>




        </TouchableOpacity>
    )
}
export default LessonItem


const style = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        marginStart: 10,
        marginEnd: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 3,
        // overflow: 'hidden',
        padding: 15,
        flex: 1,
        alignItems: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:5
    },
    lessonInfo: {
        flexDirection: 'column',
        flex: 0.8
    },
    progressView: {
        alignItems: 'flex-end',
        flex: 0.2
    },
    lessonName: {
        color: 'black',
        fontSize: 17,
    },

    actions: {
        marginTop: 5,
        flexDirection: 'row'
    }

})