
import React from 'react';
import { View, Image } from 'react-native'
import EmptyAnnouncementImage from '../assets/images/announcement-empty.png'
import EmptyActivityImage from '../assets/images/empty_activity.png'

import TextView from './TextView'
function EmptyPage({ description, activity }) {
    return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Image source={activity ? EmptyActivityImage : EmptyAnnouncementImage} style={{ width: 100, height: 100, resizeMode: "contain" }} />
            <TextView style={{ textAlign: 'center',marginTop:10 }}>{description}</TextView>
        </View>
    )

}
export default EmptyPage