import React from 'react'
import { View, Image } from 'react-native'
import EmptyImage from '../assets/images/announcement-empty.png'
import TextView from './TextView'
function EmptyCard({description}) {
    return (
        <View style={{alignItems:'center'}}>
            <Image source={EmptyImage} style={{ width: 100, height: 100, resizeMode: "contain" }} />
            <TextView style={{textAlign:'center'}}>{description}</TextView>
        </View>
    )
}
export default EmptyCard