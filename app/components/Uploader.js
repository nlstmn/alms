import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import TextView from './TextView';

const { width, height } = Dimensions.get('screen');
import { connect } from 'react-redux';
import { strings } from '../locales/i18n';
import RNFetchBlob from 'rn-fetch-blob'
import Constants from '../services/Constants';
import { showMessage } from "react-native-flash-message";
import { errorMessageData } from '../helpers/FlashMessageData';

class Uploader extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            uploadProgress: 0,
            
        }
    }

    componentDidMount() {
        this.upload();
    }

    componentWillReceiveProps(props) {
    }

    upload() {
        this.task = RNFetchBlob.fetch('POST', this.props.uploadingData.almsPlusApiUrl + Constants.UploadFile, {
            'Authorization': 'Bearer ' + this.props.uploadingData.accessToken,
            'Content-Type': 'multipart/form-data',
        }, [
            {
                name: this.props.uploadingData.selectedFile.name,
                filename: this.props.uploadingData.selectedFile.name,
                type: this.props.uploadingData.selectedFile.type,
                data: RNFetchBlob.wrap(decodeURI(this.props.uploadingData.selectedFile.uri.replace("file://", "")))
            },
            { name: 'fileUploadId', data: this.props.uploadingData.fileUploadId },

        ])

        this.task.uploadProgress((written, total) => {
            console.log('uploaded', written / total)
            this.onUploadingProgress(((written / total) * 100).toFixed(1))
            this.setState({ uploadProgress: ((written / total) * 100).toFixed(1) })
        })
            .then((response) => {
                console.log("Uploader api repsonse: ", response.respInfo.status);
                if (response.respInfo.status === 200) {
                    this.onSuccess();
                } else {
                    this.onError();
                }
            }).catch((error) => {
                this.onError();
                console.log("Uploader api error: ", error);
            })
    }

    componentWillUnmount() {
        console.log("uploader will unmount")
        if (this.task !== null) {
            this.task.cancel();
        }

    }
    onUploadingProgress(percentage) {
        this.props.uplaodingProgress(percentage)
    }
    onCancel = () => {
        this.task.cancel((err) => {
            console.log("cancel error", err);
        })
        this.props.onCancel()
    }
    onSuccess() {
        this.props.onSuccess()
    }
    
    onError() {
        showMessage(errorMessageData({message:this.props.main.languageResource.r_uploading_error_message || strings("r_uploading_error_message")}))
        this.props.onError()
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.visibility}
                onRequestClose={() => { }}>
                <View style={styles.modalBackground}>
                    <View style={{ backgroundColor: 'white', width: width * 0.6, borderRadius: 5, padding: 10 }}>
                        <TextView weight="bold" style={{ color: 'black', fontSize: 18 }}>
                            {this.props.main.languageResource.r_uploading_text_message || strings('r_uploading_text_message')}
                        </TextView>
                        <TextView weight="regular" style={{ color: 'black', fontSize: 17, marginTop: 5 }}>
                            %{this.state.uploadProgress}
                        </TextView>

                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={this.onCancel}>
                                <TextView weight="bold" style={{ color: 'black', fontSize: 16, padding: 10 }}>
                                    {this.props.main.languageResource.r_activity_video_downloading_cancel || strings('r_activity_video_downloading_cancel')}
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
});

const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Uploader)