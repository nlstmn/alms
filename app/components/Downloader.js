import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import PercentageCircle from 'react-native-percentage-circle';
import TextView from './TextView';
import { Icon } from 'react-native-elements';
import Colors from '../theme/Colors';
import RNFetchBlob from 'rn-fetch-blob';

import FileViewer from 'react-native-file-viewer';



const Declaration = {
    Error: '#8b0000',
    Success: '#008b00',
    Warning: '#ffc107',
}
const DownloadStatus = {
    REQUEST: 0,
    SUCCESS: 1,
    FAILURE: 2,
    CANCELED: 3,
}

function Downloader({ file, accessToken, onclose, onCancel }) {


    const [status, setStatus] = useState(DownloadStatus.REQUEST)
    const [percentage, setPercantage] = useState(0)
    let task = null
    useEffect(() => {
        fetch(file.path, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (response.ok) {
                console.log('response ok : ', response)
                return response.json()
            } else {
                throw { 'error': true, 'code': response.status, 'text': response.statusText }
            }
        }).then(function (result) {
            console.log('result: ', result);
            startDownload(result)
            return result
        }).catch(error => {
            console.log("error: ", error);
        });
    }, [])

    const startDownload = (path) => {
        let dirs = RNFetchBlob.fs.dirs
        const options = {
            fileCache: true,
            path: dirs.DocumentDir + "/" + file.createdDate + file.fileName
        }

        task = RNFetchBlob.config(options).fetch('GET', path)


        task.progress((received, total) => {
            console.log('progress', received / total)
            setPercantage(((received / total) * 100).toFixed(1))
        }).then((res) => {
            console.log("downloading finished")
            setPercantage(100)
            setStatus(DownloadStatus.SUCCESS)

            openLocalFile()
        }).catch(error => {
            /* Not: Dosya indirme iptal edilse dahi depolamaya dosyayı oluşturuyor. Bu yüzden dosyayı silmek gerekiyor. */
            console.log("catch error: ", error)
            RNFetchBlob.fs.unlink(options.path).then(() => {
                console.log("File deleted")
            }).catch((error) => {
                console.log("File deleting error:", error)
            })
        })
    }

    const openLocalFile = () => {
        let dirs = RNFetchBlob.fs.dirs
        const path = dirs.DocumentDir + "/" + file.createdDate + file.fileName

        console.log("openLocalFile=>", path)
        FileViewer.open(path).then(() => {
            console.log("fileViewer", "success")
        }).catch(error => {
            console.log("fileViewer", "error: ", error)
        })
    }

    const actionButtonPressed = () => {
        switch (status) {
            case DownloadStatus.SUCCESS:
                onclose()
                break
            case DownloadStatus.REQUEST:
                task?.cancel()
                onCancel()
                break
            default: onClose()
        }
    }
    return (
        < Modal
            isVisible={true}
            style={style.modal} >
            <View style={style.modalContainer}>
                {/* Modal Content */}
                <View >
                    {status === DownloadStatus.REQUEST
                        ?
                        <View style={style.modalContent}>
                            <PercentageCircle
                                radius={40}
                                borderWidth={5}
                                percent={percentage}
                                color={Colors.primary}>
                                <TextView weight="medium" style={style.downloadPercentageText}>
                                    {percentage}%
                                    </TextView>
                            </PercentageCircle>
                            <TextView style={style.downloadingText}>Dosya indiriliyor...</TextView>
                        </View>
                        : null}
                    {status === DownloadStatus.SUCCESS
                        ? <View style={style.modalContent}>
                            <Icon name="ios-checkmark-circle-outline" type="ionicon" size={80} color={Colors.primary} />
                            <TextView style={style.downloadingText}>Dosya indirildi</TextView>
                        </View>
                        : null}

                </View>

                <View style={{ height: 2, backgroundColor: 'gray' }} />
                {/* Action */}
                <TouchableOpacity activeOpacity={0.5} style={style.actionView} onPress={() => actionButtonPressed()}>
                    <TextView style={[style.downloadCancelText], {
                        color: status === DownloadStatus.SUCCESS
                            ? Colors.primary
                            : Declaration.Warning
                    }} weight="bold">
                        {status === DownloadStatus.SUCCESS
                            ? 'Kapat'
                            : 'Iptal'}
                    </TextView>
                </TouchableOpacity>
            </View>
        </Modal >
    )
}

const style = StyleSheet.create({
    modal: { justifyContent: 'flex-end', margin: 0 },
    modalContainer: {
        backgroundColor: 'white', margin: 10, justifyContent: 'center',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20
    },
    actionView: { alignItems: 'center', padding: 20 },
    modalContent: { padding: 15, justifyContent: 'center', alignItems: 'center' },
    downloadingText: { padding: 5 },
    downloadCancelText: { color: Declaration.Success, fontSize: 15 },
    downloadPercentageText: { fontSize: 15 },
    openFileView: { padding: 5 }
})

export default Downloader