//react libraries
import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';


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
import styles from '../../theme/Style';
import ActivityAttachments from '../ActivityAttachments';

//settings
import { connect } from 'react-redux';
import { strings } from '../../locales/i18n';
import { template } from '../../locales/StringTemplate';
import AppTheme from '../../theme/AppTheme';
import { isUserStudent } from '../../helpers/StateControls';
import ActivityCardImage from '../ActivityCardImage';


class ActivityDocumentType extends React.Component {

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
                        <TextView weight="regular" style={{ fontSize: 12, color: Colors.activity_due_date_past }}>

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
                            {this.props.main.languageResource.r_activity_due_date || strings('r_activity_due_date')} :
                        </TextView>
                        <TextView weight="regular" style={{ fontSize: 12 }}> {Moment(this.props.activity.taskDeadLine).format('D MMMM, hh:mm ')}</TextView>
                    </View>
                );
            }
        }
        else
            return null;
    }

    _renderDescription() {
        if (this.props.activity.description != null) {
            return (
                <View style={{ padding: 10 }}>
                    <HTML
                        source={{ html: this.props.activity.description }}
                        baseFontStyle={AppTheme.activityHtmlDescriptionBaseStyle} />
                </View>
            )
        } else return null
    }

    setAsCompleted() {
        const requestBody = {
            "almsPlusApiUrl": this.props.main.selectedOrganization.almsPlusApiUrl,
            "accessToken": this.props.main.authData.access_token,
            "data": JSON.stringify({
                "activityCompletionType": this.props.activity.completionType,
                "activityId": this.props.activity.activityId,
                "classId": this.props.courseDetail.course.classId
            })
        }
        this.props.setAsCompleted(requestBody);
    }

    _renderActionButtons() {
       return isUserStudent(this.props.main.userIdentity) && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                {this.props.activity.completionType === Constants.ActivityCompletionTypes.View
                    ? this.props.courses.enrollmentProgressData.find(data => data.activityId === this.props.activity.activityId) ? null
                        : <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => { this.setAsCompleted() }}
                            style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Ionicons name="md-checkmark" size={25} color="black" style={{ marginEnd: 5 }} />
                            <TextView weight="bold" style={{ color: 'black', fontSize: 16 }}>
                                {this.props.main.languageResource.r_activity_complete_button_text || strings('r_activity_complete_button_text')}
                            </TextView>
                        </TouchableOpacity>
                    : null}

            </View>
        )
    }
    _renderCardHeader() {
        return (
            <View style={{ flexDirection: 'row', padding: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="file-document-outline" size={25} color="black" />
                <View style={{ flex: 1, flexDirection: 'column', marginStart: 5 }}>
                    <TextView numberOfLines={2} weight="bold" style={{ color: 'black', fontSize: 18 }}>
                        {this.props.activity.name}
                    </TextView>
                    {this._renderDueDate()}
                </View>
                {this.props.courses.enrollmentProgressData.find(data => data.activityId === this.props.activity.activityId)
                    ? <View style={{ alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
                        <Ionicons name="ios-checkmark" size={styles.marked_completed_activity_icon_size} color="white" />
                    </View>
                    :
                    null
                }
            </View>
        )
    }

    _renderCardContainer() {
        return (
            <View style={{ marginTop: 10, flexDirection: 'column' }}>
                <ActivityCardImage cardImgName={this.props.activity.cardImgName} activityType={this.props.activity.activityType} />
                {this._renderDescription()}
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
                            files={this.props.activity.file.filter(f => f.ownerType === 4)}
                            selectedFile={(file) => {
                                this.props.selectedFile(file)
                                this.setAsCompleted()
                            }} />

                        <View style={{ marginTop: 20, height: 1, backgroundColor: Colors.lineColor }} />

                        {/* Card Action Button */}
                        {/* {this._renderActionButtons()} */}
                    </View>
                </ScrollView>
            </View >
        );
    }
}

//STYLE
const style = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: 0,
        margin: 5
    },
})

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
export default connect(mapStateToProps, mapDispatchToProps)(ActivityDocumentType)