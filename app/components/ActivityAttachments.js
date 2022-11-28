import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TextView from './TextView';
import { strings } from '../locales/i18n';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { bytesToSize } from '../helpers/Calculate';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';


function ActivityAttachments(props) {
    const main = useSelector(state => state.main)
    const [files, setFiles] = useState(props.files)
    var taskRef = useRef(null)
    useEffect(() => {
        setFiles(props.files)
    }, [props.files])

    async function checkFileIsExist(file) {
        let dirs = RNFetchBlob.fs.dirs
        const exist = await RNFetchBlob.fs.exists(dirs.DownloadDir + "/" + file.fileName)
        return exist
    }

    async function openLocalFile(file) {
        let dirs = RNFetchBlob.fs.dirs
        const path = dirs.DownloadDir + "/" + file.fileName
        FileViewer.open(path).then(() => {
            console.log("fileViewer", "success")
        }).catch(error => {
            console.log("fileViewer", "error: ", error)
        })

    }

    const requestStoragePermission = (file) => {
        try {
            PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then((result) => {
                if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                    downloadAttachment(file);
                } else {
                    console.log('Permissions denied');
                }
            })
        } catch (error) {
        }
    }

    const downloadAttachment = (file) => {
        checkFileIsExist(file).then(exist => {
            if (exist) {
                openLocalFile
            } else {
                let dirs = RNFetchBlob.fs.dirs
                const options = {
                    fileCache: true,
                    path: dirs.DownloadDir + "/" + file.fileName
                }
                taskRef = RNFetchBlob.config(options).fetch('GET', file.filePath)

                taskRef.progress((received, total) => {
                    console.log('progress', received / total)
                }).then((res) => {
                    console.log("downloading finished")
                    openLocalFile(file)
                }).catch(error => {
                    console.log("catch error: ", error)
                    RNFetchBlob.fs.unlink(options.path).then(() => {
                        console.log("File deleted")
                    }).catch((error) => {
                        console.log("File deleting error:", error)
                    })
                })

            }
        })
    }

    const attachmentClicked = (file) => {
        // if (Platform.OS === 'android') {
        //     requestStoragePermission(file)
        // } else {
        //     downloadAttachment(file);
        // }

        props.selectedFile({ ...file, path: file.filePath })
    }


    return files.length > 0 && (
        <View style={props.single ? { marginBottom: 5 } : { padding: 10 }}>
            {props.titleEnabled &&
                <TextView weight="bold" style={style.fileAttachmentTitle}>
                    {main.languageResource.r_activity_attached_file_title || strings('r_activity_attached_file_title')}
                </TextView>
            }
            {
                files.map((file, fIndex) => {
                    return (
                        <View key={fIndex} style={props.single ? {} : { marginStart: 10, marginEnd: 10 }}>
                            <TouchableOpacity activeOpacity={0.7} style={style.fileAttachmentContainer}
                                onPress={() => attachmentClicked(file)}>
                                <Ionicons name="ios-attach" size={20} />
                                <TextView style={{ flex: 1, marginStart: 5, color: 'black' }} weight="regular" numberOfLines={1} ellipsizeMode={'middle'}>{file.fileName}</TextView>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextView style={style.fileAttachmentSize} weight="bold">{bytesToSize(file.size)}</TextView>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
        </View>
    )

}
export default ActivityAttachments

const style = StyleSheet.create({
    fileAttachmentTitle: {
        fontSize: 16,
        color: 'black',
        padding: 10
    },
    fileAttachmentContainer: {
        borderRadius: 5,
        borderWidth: 0.3,
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    fileAttachmentSize: {
        fontSize: 12,
        color: 'black',
        textAlign: 'right'
    },
})
