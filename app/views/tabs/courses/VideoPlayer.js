import React from 'react';
import { View, Alert, StatusBar, TouchableOpacity, Platform, PermissionsAndroid, ScrollView, BackHandler } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Orientation from "react-native-orientation"
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';

import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'


import Modal from "react-native-modal";
import TextView from '../../../components/TextView';
import Constants from '../../../services/Constants';
import Colors from '../../../theme/Colors';
import AsyncStorage from '@react-native-community/async-storage';
import LocalStorageConstants from '../../../local/LocalStorageConstants';
import { strings } from '../../../locales/i18n';
import { connect } from 'react-redux';
import ActivityInteractActions from '../../../redux/ActivityInteractRedux';
import { isUserInstructor } from '../../../helpers/StateControls';

class VideoPlayerComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            activity: this.props.navigation.getParam('activity', null),
            questionVisibility: false,
            questionAnswerSuccessVisibility: false,
            questionAnswerFailVisibility: false,
            videoPause: false,
            question: null,
            selectedSingleAnswer: null,
            selectedMultiAnswers: [],
            videoUri: null,
            totalSpentSecond: 0,
            totalWatchedSecond: 0,
            videoDuration: 0,
            viewParts: [],
            seekedSecond: null,
            videoFinished: false,
            videoCurrentTime: null
        }
        this.showedSeconds = []




        this.saveVideoTrackingApiRequestBody = {
            accessToken: this.props.main.authData.access_token,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            classId: null,
            activityId: this.props.navigation.getParam('activity', null)['activityId'],
            trackingData: null

        }
    }
    tick() {
        this.setState({ totalSpentSecond: this.state.totalSpentSecond + 1 });
        if (!this.state.videoPause)
            this.setState({ videoDuration: this.state.videoDuration + 1 })
    }
    async componentDidMount() {
        console.log("Video Player data: ", this.state.activity);
        if (Platform.OS === "android") {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        }

        if (this.state.activity.file.filePath === null) {
            Alert.alert('', this.props.main.languageResource.r_video_error_not_yet_loaded || strings('r_video_error_not_yet_loaded'))
            const backActions = NavigationActions.back({
                key: null
            });
            this.props.navigation.dispatch(backActions)
        }

        this.setAsCompleted(Constants.ActivityCompletionTypes.View)

        this.getVideoDetail()
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.activityInteract.videoDetailResponse !== prevProps.activityInteract.videoDetailResponse) {
            console.log("video player opening")
            this.setState({ videoUri: this.props.activityInteract.videoDetailResponse })
        }
    }

    getVideoDetail() {
        let fileId = ""
        if (isUserInstructor(this.props.main.userIdentity)) {
            fileId = this.state.activity.file[0].fileId + "/" + this.props.addActivity.classInformation[0].value
        } else {
            fileId = this.state.activity.file[0].fileId + "/" + this.props.courseDetail.course.classId
        }
        const requestBody = {
            "almsPlusApiUrl": this.props.main.selectedOrganization.almsPlusApiUrl,
            "accessToken": this.props.main.authData.access_token,
            "fileId": fileId
        }
        this.props.getVideoDetailRequest(requestBody)
    }

    setAsCompleted(completionType) {
        const requestBody = {
            "almsPlusApiUrl": this.props.main.selectedOrganization.almsPlusApiUrl,
            "accessToken": this.props.main.authData.access_token,
            "data": JSON.stringify({
                "activityCompletionType": completionType,
                "activityId": this.state.activity.activityId,
                "classId": this.props.courseDetail.course.classId
            })
        }
        this.props.activityCompletionViewCriteriaRequest(requestBody)
    }

    handleBackPress = () => {
        if (!this.state.videoFinished) {
            // this.saveVideoTrackingApi();
            console.log("handleBackPress");
        }
    }

    async componentWillMount() {
        StatusBar.setHidden(true);
        console.log("VideoPlayer data: ", this.state.activity);
        // const paths = await AsyncStorage.getItem(LocalStorageConstants.DownloadedFilePaths)
        // if (paths !== null) {
        //     let downloadedData = JSON.parse(paths);
        //     let filterDownloadedData = downloadedData.filter(item => item.activityId === this.state.activity.activityId);
        //     if (filterDownloadedData.length !== 0) {
        //         console.log("local video path ", filterDownloadedData[0].downloadedVideoPath)
        //         await this.setState({ videoUri: filterDownloadedData[0].downloadedVideoPath })
        //     } else {
        //         console.log("online video")
        //         await this.setState({ videoUri: this.state.activity.file.filePath })
        //     }
        // } else {
        //     this.setState({ videoUri: this.state.activity.file.filePath })
        // }
    }

    componentWillReceiveProps(props) {
        // if (props.activityInteract.saveVideoTrackingError && props.activityInteract.saveVideoTrackingErrorMessage.code === 600) {
        //     this.setUnSavedVideoTrackingData()
        //     Alert.alert('', this.props.main.languageResource.r_video_offline_tracking_message || strings('r_video_offline_tracking_message'))
        // } else if (props.activityInteract.saveVideoTrackingError) {
        //     Alert.alert('', this.props.main.languageResource.r_video_tracking_error_message || strings('r_video_tracking_error_message'))
        //     this.setUnSavedVideoTrackingData()
        // }

        // if (this.props.activityInteract.saveVideoTrackingData !== props.activityInteract.saveVideoTrackingData && !props.activityInteract.saveVideoTrackingError) {
        //     this.setState({ loader: false })
        // }
    }

    //offline mode'da veya tracking dataları kaydedilirken hata oluşursa veriler sonradan tekrar apiye gönderilmek üzere kaydedilir.
    async setUnSavedVideoTrackingData() {
        const trackingData = await AsyncStorage.getItem(LocalStorageConstants.UnSavedVideoTrackingData);
        if (trackingData !== null) {
            var trackingDatas = [];
            trackingDatas = JSON.parse(trackingData);
            trackingDatas.push(this.saveVideoTrackingApiRequestBody)
            AsyncStorage.setItem(LocalStorageConstants.UnSavedVideoTrackingData, JSON.stringify(trackingDatas))
            console.log("tracking not null, datas: ", trackingDatas);
        } else {
            var trackingDatas = []
            trackingDatas.push(this.saveVideoTrackingApiRequestBody)
            AsyncStorage.setItem(LocalStorageConstants.UnSavedVideoTrackingData, JSON.stringify(trackingDatas))
            console.log("tracking data is null, first data: ", trackingDatas);
        }
    }
    componentWillUnmount() {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
        clearInterval(this.interval)
        if (Platform.OS === "android")
            this.backHandler.remove();
    }
    async _onBack() {
        //Orientation.lockToPortrait();

        // if (!this.state.videoFinished)
        //     this.saveVideoTrackingApi();

        const backActions = NavigationActions.back({
            key: null
        });
        this.props.navigation.dispatch(backActions)
        // navigation.goBack()
    }


    async saveVideoTrackingApi() {
        this.saveVideoTrackingApiRequestBody.classId = this.props.courseDetail.course.classId

        if (this.state.viewParts.length === 0) {
            this.state.viewParts.push("'0-" + this.state.videoDuration + "'")
            await this.setState({ totalWatchedSecond: this.state.videoDuration })
        }
        if (this.state.seekedSecond !== null) {
            var val = parseInt(this.state.seekedSecond) + parseInt(this.state.videoDuration);
            this.state.viewParts.push("'" + this.state.seekedSecond + "-" + val + "'")
            await this.setState({ totalWatchedSecond: this.state.totalWatchedSecond + this.state.videoDuration })
        }
        this.saveVideoTrackingApiRequestBody.trackingData = {
            "viewParts": "[" + this.state.viewParts + "]",
            "totalPartSec": this.state.totalWatchedSecond,
            "duration": this.state.totalWatchedSecond
        }
        this.props.saveVideoTracking(this.saveVideoTrackingApiRequestBody)
    }
    onProgress(times) {
        this.setState({ videoCurrentTime: times.currentTime })
        const second = times.currentTime.toFixed();
        for (let i = 0; i < this.state.activity.videoQuestions.length; i++) {
            if ((parseInt(second) === parseInt(this.state.activity.videoQuestions[i].showOnSecond) && !this.showedSeconds.includes(second))) {
                this.showedSeconds.push(second)
                this.setState({ questionVisibility: true, videoPause: true, question: this.state.activity.videoQuestions[i] })
            }
        }
    }

    onSeek(seek) {
        if (this.state.viewParts.length === 0) {
            this.state.viewParts.push("'0-" + this.state.videoDuration + "'")
            this.setState({ totalWatchedSecond: this.state.videoDuration })

        }
        if (this.state.seekedSecond !== null) {
            var val = parseInt(this.state.seekedSecond) + parseInt(this.state.videoDuration);
            this.state.viewParts.push("'" + this.state.seekedSecond + "-" + val + "'")
            this.setState({ totalWatchedSecond: this.state.totalWatchedSecond + this.state.videoDuration })

        }
        this.setState({ seekedSecond: (seek.currentTime).toFixed() })
        this.setState({ videoDuration: 0 })
    }

    _renderQuestionResultModal() {
        if (this.state.questionAnswerSuccessVisibility) {
            return (
                <Modal isVisible={this.state.questionAnswerSuccessVisibility} style={{ margin: 5, flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', opacity: 0.8, borderRadius: 10, flexDirection: 'column' }}>
                            {/* Context */}
                            <Ionicons name="ios-checkmark-circle-outline" size={60} color="#39b27b" />
                            <TextView style={{ color: '#39b27b', fontSize: 19 }}>
                                {this.props.main.languageResource.r_video_correct_answer || strings('r_video_correct_answer')}
                            </TextView>
                            <TextView style={{ color: 'white', fontSize: 17, marginTop: 20 }}>
                                {this.props.main.languageResource.r_video_correct_answer_description || strings('r_video_correct_answer_description')}
                            </TextView>

                            {/* Action Button */}
                            <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 30, }}>
                                <Button
                                    title={this.props.main.languageResource.r_video_next_step || strings('r_video_next_step')}
                                    iconRight
                                    icon={<Icon name="arrowright" size={20} color="white" style={{ marginStart: 5 }} />}
                                    buttonStyle={{ backgroundColor: Colors.primary }}
                                    onPress={() => this.successAnswerContinue()} />
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            )
        } else if (this.state.questionAnswerFailVisibility) {
            return (
                <Modal isVisible={this.state.questionAnswerFailVisibility} style={{ margin: 5, flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', opacity: 0.8, borderRadius: 10, flexDirection: 'column' }}>
                            {/* Context */}
                            <Ionicons name="ios-close-circle-outline" size={60} color="#ff6f61" />
                            <TextView style={{ color: '#ff6f61', fontSize: 19 }}>
                                {this.props.main.languageResource.r_video_wrong_answer || strings('r_video_wrong_answer')}
                            </TextView>
                            <TextView style={{ color: 'white', fontSize: 17, marginTop: 20 }}>
                                {this.props.main.languageResource.r_video_wrong_answer_description || strings('r_video_wrong_answer_description')}
                            </TextView>

                            {/* Action Button */}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 30, }}>
                                {this._renderWatchContiuneButtons()}
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            )
        } else return null;
    }
    _renderWatchContiuneButtons() {
        if (this.state.question.continueEvenWrong) {
            return (
                <Button
                    containerStyle={{ margin: 5 }}
                    title={this.props.main.languageResource.r_video_next_step || strings('r_video_next_step')}
                    iconRight
                    icon={<Icon name="arrowright" size={20} color="white" style={{ marginStart: 5 }} />}
                    buttonStyle={{ backgroundColor: Colors.primary }}
                    onPress={() => this.wrongAnswerContinue()} />
            )
        } else {
            return (
                <Button
                    containerStyle={{ margin: 5 }}
                    title={this.props.main.languageResource.r_video_watch_again || strings('r_video_watch_again')}
                    icon={<SimpleLineIcons name="refresh" size={20} color="white" style={{ marginEnd: 5 }} />}
                    buttonStyle={{ backgroundColor: '#ff6f61' }}
                    onPress={() => this.wrongAnswerWatchAgain()} />
            )
        }
    }
    _renderQuestionModal() {
        if (this.state.questionVisibility) {
            return (
                <Modal isVisible={this.state.questionVisibility} style={{ margin: 5, flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', opacity: 0.8, borderRadius: 10, flexDirection: 'column' }}>
                            {/* Question Title */}
                            <View style={{ marginTop: 20, marginStart: 20, marginBottom: 10 }}>
                                <TextView style={{ color: 'white', fontSize: 20 }} weight="bold">
                                    {this.state.question.question}
                                </TextView>
                            </View>
                            {/* Question Answers */}
                            {
                                this._renderQuestionAnswers()

                            }
                            {/* Action Button */}
                            <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20, marginStart: 20, marginBottom: 20 }}>
                                <Button
                                    title={this.props.main.languageResource.r_video_question_reply || strings('r_video_question_reply')}
                                    iconRight
                                    disabledStyle={{ backgroundColor: Colors.primary, opacity: 0.5 }}
                                    disabledTitleStyle={{ color: 'white' }}

                                    disabled={this.state.selectedSingleAnswer === null && this.state.selectedMultiAnswers.length == 0}
                                    icon={<Icon name="arrowright" size={20} color="white" style={{ marginStart: 5 }} />}
                                    buttonStyle={{ backgroundColor: Colors.primary }}
                                    onPress={() => this.answerQuestion()} />
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            )
        } else return null
    }

    successAnswerContinue() {
        console.log("successAnswerContinue")
        this.setState({
            questionAnswerSuccessVisibility: false,
            videoPause: false
        })
    }
    wrongAnswerWatchAgain() {
        console.log("wrongAnswerWatchAgain")
        this.setState({
            questionAnswerFailVisibility: false,
            videoPause: false
        })
        this.showedSeconds.pop()
        this.player.seekTo(this.state.question.goBackTo)
    }
    wrongAnswerContinue() {
        console.log("wrongAnswerContinue")
        this.setState({
            questionAnswerFailVisibility: false,
            videoPause: false
        })
    }
    answerQuestion() {
        this.setState({
            questionVisibility: false,
        })
        if (this.state.question.questionType == Constants.ActivityVideoQesutionTypes.SingleChoise) {
            if (this.state.selectedSingleAnswer.isAnswer) {
                this.setState({
                    questionAnswerSuccessVisibility: true
                })
            } else {
                this.setState({
                    questionAnswerFailVisibility: true,
                })
            }
        } else {
            var currectAnswers = this.state.question.videoTestChoices.filter(choice => choice.isAnswer === true);
            if (currectAnswers.length === this.state.selectedMultiAnswers.length) {
                var successAnswer = false;

                for (let i = 0; i < currectAnswers.length; i++) {
                    if (this.state.selectedMultiAnswers.indexOf(currectAnswers[i]) > -1)
                        successAnswer = true;
                    else {
                        successAnswer = false
                        break
                    }
                }
                if (successAnswer)
                    this.setState({ questionAnswerSuccessVisibility: true })
                else
                    this.setState({ questionAnswerFailVisibility: true })
            } else {
                this.setState({ questionAnswerFailVisibility: true })
            }
        }

        this._clearAnswers()
    }
    _clearAnswers() {
        this.setState({
            selectedSingleAnswer: null,
            selectedMultiAnswers: []
        })
    }

    _renderQuestionAnswers() {
        if (this.state.question.questionType == Constants.ActivityVideoQesutionTypes.SingleChoise) {
            return (
                this.state.question.videoTestChoices.map(choice => (
                    <TouchableOpacity activeOpacity={0.7} style={{ marginStart: 10, marginEnd: 10 }} key={choice.testChoiceId}>
                        <CheckBox title={choice.choiceText}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.selectedSingleAnswer === choice}
                            textStyle={{ color: 'white' }}
                            onPress={() => this.setState({ selectedSingleAnswer: choice })}
                            checkedColor={Colors.primary} containerStyle={{ borderWidth: 0, backgroundColor: 'black' }}
                        />
                    </TouchableOpacity>
                ))
            )
        } else {
            return (
                this.state.question.videoTestChoices.map(choice => (
                    <TouchableOpacity activeOpacity={0.7} style={{ marginStart: 10, marginEnd: 10 }} key={choice.testChoiceId}>
                        <CheckBox title={choice.choiceText}
                            checkedIcon='check-square'
                            uncheckedIcon='square'
                            checked={this.state.selectedMultiAnswers.indexOf(choice) > -1}
                            textStyle={{ color: 'white' }}
                            onPress={() => {
                                if (this.state.selectedMultiAnswers.indexOf(choice) > -1) { //already exist
                                    let filteredAnswerArray = this.state.selectedMultiAnswers.filter(answer => answer !== choice)
                                    this.setState({ selectedMultiAnswers: filteredAnswerArray })
                                } else {
                                    this.setState({
                                        selectedMultiAnswers: [...this.state.selectedMultiAnswers, choice]
                                    })
                                }
                            }}
                            checkedColor={Colors.primary} containerStyle={{ borderWidth: 0, backgroundColor: 'black' }}
                        />
                    </TouchableOpacity>
                ))
            )
        }
    }
    _renderVideo() {
        // this locks the view to Landscape Mode
        Orientation.lockToLandscape();
        if (this.state.videoUri !== null) {
            return (
                <VideoPlayer
                    bufferConfig={{
                        minBufferMs: 10000,
                        maxBufferMs: 30000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000
                    }}
                    onBack={() => this._onBack()}
                    source={{ uri: this.state.videoUri }}
                    //source={ require(this.state.videoUri) }
                    style={{ flex: 1 }}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    onReadyForDisplay={() => { //timer starts when video is ready
                        this.interval = setInterval(() => this.tick(), 1000);
                    }}
                    onPause={() => this.setState({ videoPause: true })}
                    onPlay={() => this.setState({ videoPause: false })}
                    onEnd={() => {
                        this.setState({ videoFinished: true })
                        // this.saveVideoTrackingApi()
                    }}
                    paused={this.state.videoPause}
                    onSeek={(seek) => {
                        this.onSeek(seek)
                    }}
                    disableFullscreen="true"
                    onProgress={(times) => this.onProgress(times)}
                    progressUpdateInterval={500.0}
                    onError={(error) => {
                        Alert.alert(this.props.main.languageResource.r_video_error_playing_title || strings('r_video_error_playing_title'),
                            this.props.main.languageResource.r_video_error_playing_desctiption || strings('r_video_error_playing_desctiption'), [
                            {
                                text: 'OK', onPress: () => {
                                    const backActions = NavigationActions.back({
                                        key: null
                                    });
                                    this.props.navigation.dispatch(backActions)
                                }
                            }
                        ]);
                        console.log("video error: ", error)
                    }}
                />
            )
        } else return null
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderVideo()}
                {this._renderQuestionModal()}
                {this._renderQuestionResultModal()}
            </View>

        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveVideoTracking: (...args) => dispatch(ActivityInteractActions.saveVideoTrackingRequest(...args)),
        activityCompletionViewCriteriaRequest: (...args) => dispatch(ActivityInteractActions.activityCompletionViewCriteriaRequest(...args)),
        getVideoDetailRequest: (...args) => dispatch(ActivityInteractActions.getVideoDetailRequest(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
        activityInteract: state.activityInteract,
        courseDetail: state.courseDetail,
        addActivity: state.addActivity
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerComponent)