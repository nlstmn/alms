//react libraries
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';

//3.rd libraries
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import HTML from 'react-native-render-html';
import PercentageCircle from 'react-native-percentage-circle';

//component &  styles
import Colors from '../../theme/Colors';
import styles from '../../theme/Style';
import TextView from '../TextView';

//settings
import { connect } from 'react-redux';
import { strings } from '../../locales/i18n';
import { template } from '../../locales/StringTemplate';
import Constants from '../../services/Constants';
import AppTheme from '../../theme/AppTheme';
import { formatDateType4 } from '../../helpers/DateFormatter';
import ActivityCardImage from '../ActivityCardImage';

class ActivityExamType extends React.Component {

  _renderCompletionIcon() {
    const enrollmentData = this.props.courses.enrollmentProgressData.find((data) => data.activityId === this.props.activity.activityId);
    if (enrollmentData) {
      if (enrollmentData.status === Constants.ActivityCompletedStatus.Completed) {
        return (
          <View
            style={{
              flex: 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              height: styles.marked_completed_activity_icon_size,
              width: 30,
              borderRadius: 30 / 2,
              backgroundColor: Colors.primary,
            }}
          >
            <Ionicons
              name="ios-checkmark"
              size={styles.marked_completed_activity_icon_size}
              color="white"
            />
          </View>
        );
      } else
        return (
          <View
            style={{
              flex: 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              height: styles.marked_completed_activity_icon_size,
              width: 30,
              borderRadius: 30 / 2,
              backgroundColor: Colors.primary,
            }}
          >
            <PercentageCircle
              radius={17}
              borderWidth={3}
              percent={enrollmentData.progress}
              color={Colors.primary}
            >
              <TextView weight="medium" style={{ fontSize: 11 }}>%{enrollmentData.progress}</TextView>
            </PercentageCircle>
          </View>
        );
    } else return null;
  }

  _renderCardHeader() {
    return (
      <View style={{ alignItems: "center", flexDirection: 'row', padding: 10 }}>
        <Ionicons
          name="ios-list"
          size={25}
          color="black"
        />
        <View style={{ flex: 1, flexDirection: 'column', marginStart: 5 }}>
          <TextView
            numberOfLines={2}
            weight="bold"
            style={{ color: 'black', fontSize: 18 }}
          >
            {this.props.activity.name}
          </TextView>
          <TextView style={{ color: "black",fontSize:12 }}>{Moment(this.props.activity.beginDate).format(formatDateType4())} - {Moment(this.props.activity.endDate).format(formatDateType4())}</TextView>

        </View>
        {this._renderCompletionIcon()}
      </View>
    );
  }
  getAttemptCount() {
    return this.props.activity.exam == null
      ? 0
      : this.props.activity.exam.attemptCount;
  }
  getAllowedCount() {
    return this.props.activity.exam == null
      ? 0
      : this.props.activity.exam.allowedCount;
  }

  _renderCardContainer() {
    return (
      <View >
        <ActivityCardImage cardImgName={this.props.activity.cardImgName} activityType={this.props.activity.activityType} />
        {this.props.activity.description != null &&
          <View style={{ padding: 10 }}>
            <HTML source={{ html: this.props.activity.description }} baseFontStyle={AppTheme.activityHtmlDescriptionBaseStyle} />
          </View>
        }
        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center',padding:10 }}>
          <Ionicons name="ios-information-circle-outline" size={25} color={Colors.warning} />

          <TextView weight="medium" style={{ fontSize: 13, marginStart: 5, color: 'black' }}>
            {this.props.main.languageResource.r_elesson_repeat_counter_text !==
              undefined
              ? template(
                this.props.main.languageResource
                  .r_elesson_repeat_counter_text,
                {
                  attemptCount: this.getAttemptCount(),
                  repeatCount: this.getAllowedCount(),
                }
              )
              : template(strings('r_elesson_repeat_counter_text'), {
                attemptCount: this.getAttemptCount(),
                repeatCount: this.getAllowedCount(),
              })}
          </TextView>
        </View>
      </View>
    );
  }


  openExamDetail() {
    this.props.navigation.navigate('ActivityDetailWebView', { activity: this.props.activity,classId: this.props.classId });
  }

  _renderActionButtons() {
    if (this.getAttemptCount() < this.getAllowedCount())
      return (
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'center', margin: 5 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.openExamDetail()}
              style={{ flexDirection: 'row', padding: 10, justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }} >
              <TextView weight="bold" style={{ color: 'black', fontSize: 16, marginBottom: 3 }}>{this.props.main.languageResource.r_activity_show_btn_text || strings('r_activity_show_btn_text')}</TextView>
              <Ionicons name={"ios-arrow-forward"} size={25} color="black" style={{ marginStart: 5, marginEnd: 5 }} />
            </TouchableOpacity>
          </View>
        </View>
      );
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
            <View style={{ marginTop: 10, height: 1, backgroundColor: Colors.lineColor }} />
            {/* Card Action Buttons */}
            {this._renderActionButtons()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
};

const mapStateToProps = (state) => {
  return {
    main: state.main,
    courseDetail: state.courseDetail,
    activityInteract: state.activityInteract,
    courses: state.courses,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ActivityExamType);
