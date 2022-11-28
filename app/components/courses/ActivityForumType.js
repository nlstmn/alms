//react libraries
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';


//3.rd libraries
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import HTML from 'react-native-render-html';


//Component & styles
import TextView from '../TextView';
import Colors from '../../theme/Colors';
import Constants from '../../services/Constants';
import ActivityInteractActions from '../../redux/ActivityInteractRedux';

//settings
import { connect } from 'react-redux';
import { strings } from '../../locales/i18n';
import { template } from '../../locales/StringTemplate';

import styles from '../../theme/Style';
import AppTheme from '../../theme/AppTheme';
import ActivityAttachments from '../ActivityAttachments';
import ActivityCardImage from '../ActivityCardImage';

class ActivityForumType extends React.Component {

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

    redirectToWebView() {
        console.log("redirectToWebView : ", this.props.activity)
        this.props.navigation.navigate('ActivityDetailWebView', { activity: this.props.activity, classId: this.props.classId })
    }

    _renderActionButtons() {
        return (
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center', margin: 5 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.redirectToWebView()}
                        style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }} >
                        <TextView weight="bold" style={{ color: 'black', fontSize: 16, marginBottom: 3 }}>{this.props.main.languageResource.r_activity_show_btn_text || strings('r_activity_show_btn_text')}</TextView>
                        <Ionicons name={"ios-arrow-forward"} size={25} color="black" style={{ marginStart: 5, marginEnd: 5 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderCompletionIcon() {
        const enrollmentData = this.props.courses.enrollmentProgressData.find(data => data.activityId === this.props.activity.activityId)
        if (enrollmentData) {
            if (enrollmentData.status === Constants.ActivityCompletedStatus.Completed)
                return <View style={{ alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                    <Ionicons name="ios-checkmark" size={styles.marked_completed_activity_icon_size} color="white" />
                </View>
        } else return null;
    }

    _renderCardHeader() {
        return (
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <MaterialCommunityIcons name="forum-outline" size={25} color="black" />
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
                <ActivityCardImage cardImgName={this.props.activity.cardImgName} activityType={this.props.activity.activityType} />
                {this.props.activity.description != null &&
                    <View style={{ padding: 10 }}>
                        <HTML source={{ html: this.props.activity.description }} baseFontStyle={AppTheme.activityHtmlDescriptionBaseStyle} />
                    </View>
                }
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

                        {/* Card Attachments */}
                        <ActivityAttachments
                            titleEnabled
                            files={this.props.activity.file}
                            selectedFile={(file) => this.props.selectedFile(file)}
                        />

                        <View style={{ marginTop: 20, height: 1, backgroundColor: Colors.lineColor }} />

                        {/* Card Action Button */}
                        {this._renderActionButtons()}
                    </View>
                </ScrollView>
            </View >
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAsCompleted: (...args) => dispatch(ActivityInteractActions.activityCompletionViewCriteriaRequest(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
        courseDetail: state.courseDetail,
        activityInteract: state.activityInteract,
        courses: state.courses
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityForumType)