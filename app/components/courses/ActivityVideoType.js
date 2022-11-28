//react libraries
import React from 'react';
import { View, TouchableOpacity, ScrollView, Linking } from 'react-native';

//3.rd libraries
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import HTML from 'react-native-render-html';
import Moment from 'moment';
import PercentageCircle from 'react-native-percentage-circle';


//Components & styles
import TextView from '../TextView';
import ActivityInteractActions from '../../redux/ActivityInteractRedux';

//settings

import { template } from '../../locales/StringTemplate';
import { strings } from '../../locales/i18n';
import { connect } from 'react-redux';
import Colors from '../../theme/Colors';
import Constants from '../../services/Constants';
import styles from '../../theme/Style';
import AppTheme from '../../theme/AppTheme';
import ActivityCardImage from '../ActivityCardImage';


//TODO: tek aktivite açıldıktan sonra onlayout methodunun implement etmen gerek,
class ActivityVideoType extends React.Component {

    getVideoDetail() {
        if (this.props.activity.file.length > 0) {
            this.props.navigation.navigate('VideoPlayer', { activity: this.props.activity })
        } else {
            const requestBody = {
                "almsPlusApiUrl": this.props.main.selectedOrganization.almsPlusApiUrl,
                "accessToken": this.props.main.authData.access_token,
                "data": JSON.stringify({
                    "activityCompletionType": Constants.ActivityCompletionTypes.View,
                    "activityId": this.props.activity.activityId,
                    "classId": this.props.courseDetail.course.classId
                })
            }
            this.props.activityCompletionViewCriteriaRequest(requestBody)

            Linking.openURL(this.props.activity.fileEmbed)
        }
    }

    _renderDueDate() {
        if (this.props.activity.taskDeadLine !== null) {
            var curDate = Moment();
            var isAfter = Moment(curDate).isAfter(this.props.activity.taskDeadLine);

            if (isAfter) {
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TextView weight="bold" style={{ fontSize: 13, color: Colors.activity_due_date_past }}>
                            {this.props.main.languageResource.r_activity_due_date || strings('r_activity_due_date')}
                        </TextView>
                        <TextView weight="regular" style={{ fontSize: 12, marginStart: 5, color: Colors.activity_due_date_past }}>
                            {this.props.main.languageResource.r_activiy_due_outdate_day !== undefined
                                ? template(this.props.main.languageResource.r_activiy_due_outdate_day, { day: curDate.diff(this.props.activity.taskDeadLine, 'days') })
                                : curDate.diff(this.props.activity.taskDeadLine, 'days') !== 0
                                    ? template(strings('r_activiy_due_outdate_day'), { day: curDate.diff(this.props.activity.taskDeadLine, 'days') })
                                    : this.props.main.languageResource.r_activity_due_date_yesterday || strings('r_activity_due_date_yesterday')
                            }
                        </TextView>
                    </View>
                );
            } else {
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TextView weight="bold" style={{ fontSize: 12 }}>
                            {this.props.main.languageResource.r_activity_due_date || strings('r_activity_due_date')}
                        </TextView>
                        <TextView weight="regular" style={{ fontSize: 12, marginStart: 5 }}>
                            {Moment(this.props.activity.taskDeadLine).format('D MMMM, hh:mm ')}
                        </TextView>
                    </View>
                );
            }
        }
        else
            return null;
    }

    _renderDescription() {
        if (this.props.activity.description != null && this.props.activity.description.length !== 0) {
            return (
                <View style={{ padding: 10 }}>
                    <HTML source={{ html: this.props.activity.description }} baseFontStyle={AppTheme.activityHtmlDescriptionBaseStyle} />
                </View>
            )
        } else return null
    }
    _renderCompletionIcon() {
        const enrollmentData = this.props.courses.enrollmentProgressData.find(data => data.activityId === this.props.activity.activityId)
        if (enrollmentData)
            switch (enrollmentData.completionType) {
                case Constants.ActivityCompletionTypes.View:
                    if (enrollmentData.status === Constants.ActivityCompletedStatus.Completed)
                        return (
                            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                                <Ionicons name="ios-checkmark" size={styles.marked_completed_activity_icon_size} color="white" />
                            </View>
                        )
                    else return null
                case Constants.ActivityCompletionTypes.Progress:
                    if (enrollmentData.status === Constants.ActivityCompletedStatus.UnCompleted)
                        return (<View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                            <PercentageCircle
                                radius={17}
                                borderWidth={3}
                                percent={enrollmentData.progress}
                                color={Colors.primary}>
                                <TextView weight="medium" style={{ fontSize: 11 }}>
                                    %{enrollmentData.progress}
                                </TextView>
                            </PercentageCircle>
                        </View>
                        )
                    else if (enrollmentData.status === Constants.ActivityCompletedStatus.Completed) {
                        return (
                            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                                <Ionicons name="ios-checkmark" size={styles.marked_completed_activity_icon_size} color="white" />
                            </View>
                        )
                    }
                case Constants.ActivityCompletionTypes.Grade:
                    if (enrollmentData.status === Constants.ActivityCompletedStatus.Completed) {
                        return (
                            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                                <Ionicons name="ios-checkmark" size={styles.marked_completed_activity_icon_size} color="white" />
                            </View>
                        )
                    }

            }

        else return null
    }

    _renderCardHeader() {
        return (
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <MaterialIcons name="play-circle-outline" size={25} color={"black"} />
                <View style={{ flex: 1, flexDirection: 'column', marginStart: 5 }}>
                    <TextView numberOfLines={2} weight="bold" style={{ color: 'black', fontSize: 18 }}>
                        {this.props.activity.name}
                    </TextView>
                    {this._renderDueDate()}
                </View>
                {this._renderCompletionIcon()}
            </View>
        )
    }


    _renderCardContainer() {
        return (
            <View style={{ marginTop: 10, flexDirection: 'column' }}>
                <ActivityCardImage cardImgName={this.props.activity.cardImgName} activityType={this.props.activity.activityType} onPress={()=>this.getVideoDetail()} />
                {this._renderDescription()}

            </View>
        )
    }

    //TODO:localization
    _renderActionButtons() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.getVideoDetail()}
                    style={{ flexDirection: 'row', padding: 10, flex: 0.5, justifyContent: 'flex-end', alignItems: 'center' }} >
                    <TextView weight="bold" style={{ color: 'black', fontSize: 16, marginBottom: 2 }}>İzle</TextView>
                    <MaterialIcons name="play-circle-outline" size={25} color="black" style={{ marginEnd: 5, marginStart: 5 }} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <View style={AppTheme.activityTypeStyle}>
                        {/* Card Header */}
                        {this._renderCardHeader()}

                        {/* Card Container */}
                        {this._renderCardContainer()}
                        <View style={{ marginTop: 20, height: 1, backgroundColor: Colors.lineColor }} />

                        {/* Card Action Button */}
                        {this._renderActionButtons()}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        activityCompletionViewCriteriaRequest: (...args) => dispatch(ActivityInteractActions.activityCompletionViewCriteriaRequest(...args))
    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
        activityInteract: state.activityInteract,
        addActivity: state.addActivity,
        courses: state.courses,
        courseDetail: state.courseDetail
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityVideoType)