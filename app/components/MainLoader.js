import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux";

function MainLoader(props) {
    const loader = useSelector(state => state.loader)

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loader.mainLoader}
            onRequestClose={() => { }}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={loader.mainLoader} />
                </View>
            </View>
        </Modal>
    );

}
export default MainLoader

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});