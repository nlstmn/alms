import React from 'react';
import { Image, ImageBackground, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import TextView from '../../components/TextView';

import cloud_bg from '../../assets/images/atmosphere-clouds2x.png'
import empty from '../../assets/images/empty_activity.png'
import { strings } from '../../locales/i18n';
import { useSelector } from 'react-redux';


function ErrorMainpage(props) {
    const main = useSelector(state => state.main)
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={cloud_bg} style={style.bacgroundImageStyle} />
            <SafeAreaView style={style.safeAreaView}>
                {Platform.OS === "android" ? <StatusBar translucent backgroundColor="transparent" /> : <StatusBar hidden={true} />}

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={empty} style={{ height: 170, resizeMode: 'contain' }} />
                    <TextView style={{ marginTop: 20, textAlign: 'center', color: 'black' }} weight='bold'>{main.languageResource.r_critial_error_page_description || strings('r_critial_error_page_description')}</TextView>
                </View>
            </SafeAreaView>
        </View>
    )
}
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    bacgroundImageStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
})
export default ErrorMainpage