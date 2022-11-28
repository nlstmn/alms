import React from 'react';
import { View, Text, Image, Platform } from 'react-native';

//assets
import empty_activity from '../../assets/images/empty_activity.png';
import { strings } from '../../locales/i18n';
import TextView from '../TextView';
import Colors from '../../theme/Colors';

export default class PageEmpty extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: this.props.text
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor:Colors.background }}>
                <Image source={empty_activity} style={{ width: '30%', height: '30%', resizeMode: "contain" }} />
                <TextView style={{fontSize: 15,color:'black'}} weight="bold">{this.state.text}</TextView>
                {/* <Text style={{ fontFamily: Platform.OS === 'ios' ? 'SFProText-Medium' : 'Roboto-Medium' }}>Kısa bir aktivitesi bilgilendirme yazısı burada görünecek.</Text> */}
            </View>
        );
    }
}