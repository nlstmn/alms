//react libraries
import React from 'react';
import { View, SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview';
import { NavigationActions } from 'react-navigation';

//component & styles
import Ionicons from 'react-native-vector-icons/Ionicons';

//settings 
import { connect } from 'react-redux';
import ActivityInteractActions from '../../../redux/ActivityInteractRedux';
import { isUserInstructor } from '../../../helpers/StateControls';

class ActivityDetailWebView extends React.Component {

    state = {
        loader: false,
        uri: null,
        activity: this.props.navigation.getParam("activity"),
        classId: this.props.navigation.getParam("classId")
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            headerLeft: (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" color="black" size={25} onPress={() => {
                        const backActions = NavigationActions.back({
                            key: null
                        });
                        navigation.dispatch(backActions)
                    }} />
                </View>
            ),
            title: params.activity?.name
            // title:"Test"
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.activityInteract.connectToAlmsUrl !== prevProps.activityInteract.connectToAlmsUrl) {
            console.log("uri setting")
            this.setState({ uri: this.props.activityInteract.connectToAlmsUrl })
        }
    }
    componentDidMount() {
        this.setAsShowed()
        this.getUrl()
    }

    setAsShowed() {
        const requestBody = {
            "almsPlusApiUrl": this.props.main.selectedOrganization.almsPlusApiUrl,
            "accessToken": this.props.main.authData.access_token,
            "data": JSON.stringify({
                "activityCompletionType": this.state.activity.completionType,
                "activityId": this.state.activity.activityId,
                "classId": this.state.classId
                    ? this.state.classId
                    : isUserInstructor(this.props.main.userIdentity)
                        ? this.props.addActivityRedux.classInformation[0].value
                        : this.props.courseDetail.course.classId,
            })
        }
        this.props.setAsCompleted(requestBody);
    }

    getUrl() {
        const requestBody = {
            "almsPlusApiUrl": this.props.main.selectedOrganization.almsPlusApiUrl,
            "accessToken": this.props.main.authData.access_token,
            "data": JSON.stringify({
                "host": this.props.main.selectedOrganization.hostAddress,
                "returnType": "Course",
                "scheme":"https:",
                "isReturnUrl": true,
                "courseId": this.state.activity.courseId,
                "classId": this.state.classId
                    ? this.state.classId
                    : isUserInstructor(this.props.main.userIdentity)
                        ? this.props.addActivityRedux.classInformation[0].value
                        : this.props.courseDetail.course.classId,
                "activityId": this.state.activity.activityId
            })
        }
        this.props.connectToAlms(requestBody)
    }

    componentWillUnmount() {
        // this.props.navigation.state.params?.refresh()
    }
    loadStart() {
        this.setState({ loader: true })
    }
    loadEnd() {
        this.setState({ loader: false })
    }
    error(error) {
        console.log('error: ', error)
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <WebView
                    onLoadStart={() => this.loadStart()}
                    onLoadEnd={() => this.loadEnd()}
                    source={{ uri: this.state.uri }}
                    onError={(error) => this.error(error)} />
            </SafeAreaView>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAsCompleted: (...args) => dispatch(ActivityInteractActions.activityCompletionViewCriteriaRequest(...args)),
        connectToAlms: (...args) => dispatch(ActivityInteractActions.connectToAlmsRequest(...args))
    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
        courseDetail: state.courseDetail,
        addActivityRedux: state.addActivity,
        activityInteract: state.activityInteract,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetailWebView)