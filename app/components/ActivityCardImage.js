import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Constants from '../services/Constants';

export default function ActivityCardImage({ cardImgName, activityType, onPress = () => { } }) {

    const [imageSource, setImageSource] = useState({ uri: null })

    useEffect(() => {
        if (cardImgName == "" || cardImgName == null) {
            onError()
        } else {
            setImageSource(cardImgName)
        }
    }, [])

    const onError = () => {
        switch (activityType) {
            case Constants.ActivityType.Document:
                setImageSource(require('../assets/images/document_activity_cover.jpg'))
                break
            case Constants.ActivityType.Assignment:
                setImageSource(require('../assets/images/assignment_activity_cover.jpg'))
                break
            case Constants.ActivityType.Video:
                setImageSource(require('../assets/images/video_activity_cover.jpg'))
                break
            case Constants.ActivityType.Forum:
                setImageSource(require('../assets/images/forum_activity_cover.jpg'))
                break
            case Constants.ActivityType.VirtualClass:
                setImageSource(require('../assets/images/virtualclass_activity_cover.jpg'))
                break
            case Constants.ActivityType.Elesson:
                setImageSource(require('../assets/images/eders_activity_cover.jpg'))
                break
            case Constants.ActivityType.LinkActivity:
                setImageSource(require('../assets/images/link_activity_cover.jpg'))
                break
            case Constants.ActivityType.Exam:
                setImageSource(require('../assets/images/exam_activity_cover.jpg'))
                break
            case Constants.ActivityType.Survey:
                setImageSource(require('../assets/images/survey_activity_cover.jpg'))
                break
            default:
                setImageSource(require('../assets/images/default_activity_cover.jpg'))
                break
        }

    }

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => onPress()}>
            <Image
                style={{ aspectRatio: 16 / 9, width: undefined, height: undefined, alignSelf: 'stretch' }}
                source={imageSource}
                onError={() => onError()}
            />
        </TouchableOpacity>
    )
}
