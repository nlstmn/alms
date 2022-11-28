//react libraries
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';

//3.rd libraries
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Moment from 'moment';
import HTML from 'react-native-render-html';

//Component & styles
import TextView from '../TextView';
import Colors from '../../theme/Colors';
import CoursesActions from '../../redux/CoursesRedux';
import styles from '../../theme/Style';

//settings
import { connect } from 'react-redux';
import { strings } from '../../locales/i18n';
import AppTheme from '../../theme/AppTheme';
import ActivityAttachments from '../ActivityAttachments';
import { formatDateType4 } from "../../helpers/DateFormatter"
import ActivityCardImage from '../ActivityCardImage';

class ActivityVirtualClassType extends React.Component {
    
    openVirtualClassDetail() {
        this.props.navigation.navigate('ActivityDetailWebView', { activity: this.props.activity,classId: this.props.classId })
    }

    _renderActionButtons() {
        return (
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'center', margin: 5 }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.openVirtualClassDetail()}
                        style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }} >
                        <TextView weight="bold" style={{ color: 'black', fontSize: 16, marginBottom: 3 }}>{this.props.main.languageResource.r_activity_show_btn_text || strings('r_activity_show_btn_text')}</TextView>
                        <Ionicons name={"ios-arrow-forward"} size={25} color="black" style={{ marginStart: 5, marginEnd: 5 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderCardHeader() {
        return (
            <View style={{ alignItems: "center", flexDirection: 'row', padding: 10 }}>
                <MaterialCommunityIcons name="google-classroom" size={25} color="black" />
                <View style={{ flex: 1, flexDirection: 'column', marginStart: 5 }}>
                    <TextView numberOfLines={2} weight="bold" style={{ color: 'black', fontSize: 18 }}>
                        {this.props.activity.name}
                    </TextView>
                    <TextView style={{ color: "black", fontSize: 12 }}>{Moment(this.props.activity.actualStartTime).format(formatDateType4())} - {Moment(this.props.activity.actualEndTime).format(formatDateType4())}</TextView>
                </View>
                {this.props.courses.enrollmentProgressData.find(data => data.activityId === this.props.activity.activityId)
                    ? <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', height: styles.marked_completed_activity_icon_size, width: 30, borderRadius: 30 / 2, backgroundColor: Colors.primary }}>
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
                {this.props.activity.description != null &&
                    <View style={{ padding: 10 }}>
                        <HTML source={{ html: this.props.activity.description }} baseFontStyle={AppTheme.activityHtmlDescriptionBaseStyle} />
                    </View>}
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
        getEnrollmentProgress: (...args) => dispatch(CoursesActions.getEnrollmentProgressRequest(...args)),
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
export default connect(mapStateToProps, mapDispatchToProps)(ActivityVirtualClassType)