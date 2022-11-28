import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import Colors from '../../../theme/Colors';
export default class NotesMain extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: Colors.background }}>
                </View>
            </SafeAreaView>
        );
    }
}