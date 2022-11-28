import React from 'react';
import { View, ImageBackground, Image, StatusBar, TouchableOpacity, SafeAreaView, StyleSheet, Platform } from 'react-native'


import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign'
import { TextField } from 'react-native-material-textfield';

import { strings } from '../../locales/i18n'
//assets
import login_bg from '../../assets/images/atmosphere-clouds2x.png';
import group2 from '../../assets/images/group2.png';
import app_icon from '../../assets/images/app_icon.jpg';

//redux
import { connect } from 'react-redux';
import LoginActions from '../../redux/LoginRedux';
import MainActions from '../../redux/MainRedux';

import TextView from '../../components/TextView';
import Colors from '../../theme/Colors';
import FontSize from '../../theme/FontSize';
import AppTheme from '../../theme/AppTheme';



class LoginForgotPassword extends React.Component {

    state = {
        email: ""
    }

    resetPassword(){
        
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={login_bg} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                <SafeAreaView style={styles.mainContainer}>
                    {Platform.OS === "android" ? <StatusBar translucent backgroundColor="transparent" /> : <StatusBar hidden={true} />}

                    <View style={styles.inputContainer}>
                        <Image source={group2} style={{ height: 170, width: '100%', top: 0 }} />

                        <View style={{ padding: 20 }}>
                            <TextView>{this.props.main.languageResource.r_login_forgot_password_reminder || strings('r_login_forgot_password_reminder')}</TextView>

                            <TextView style={{ fontSize: FontSize.login_header, color: Colors.login_card_text, marginTop: 10 }} weight="bold">
                                {this.props.main.languageResource.r_login_forgot_password_enter_email_address || strings('r_login_forgot_password_enter_email_address')}
                            </TextView>


                            <TextField
                                labelTextStyle={{ fontFamily: AppTheme.fonts.medium }}
                                tintColor={Colors.primary}
                                label={this.props.main.languageResource.r_login_forgot_password_input_email_address || strings('r_login_forgot_password_input_email_address')}
                                returnKeyType="done"
                                autoCapitalize={"none"}
                                value={this.state.email}
                                onChangeText={(email) => {
                                    this.setState({ email })
                                }}
                                keyboardType="email-address" />


                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()} >
                                    <Icon name="arrowleft" size={20} color="black" />
                                    <TextView style={{ paddingStart: 10 }} >{this.props.main.languageResource.r_login_back || strings('r_login_back')}</TextView>
                                </TouchableOpacity>

                                <Button
                                    disabled={this.state.email.length === 0}
                                    buttonStyle={{ backgroundColor: Colors.primary }}
                                    title={this.props.main.languageResource.r_login_send_btn_txt || strings('r_login_send_btn_txt')}
                                    onPress={() => this.resetPassword()}
                                    icon={<Icon name="arrowright" size={20} color="white" />}
                                    iconRight
                                    titleStyle={{ marginEnd: 8, fontFamily: AppTheme.fonts.medium }} />

                            </View>
                        </View>
                    </View>


                    <View style={styles.company}>
                        <Image containerStyle={{ flex: 1 }} source={app_icon} style={{ width: 100, height: 30 }} />
                        <TextView style={{ fontSize: FontSize.login_alms, flex: 1, textAlign: 'right' }}>2013-{new Date().getFullYear()} {this.props.main.languageResource.r_login_alms || strings('r_login_alms')}</TextView>
                    </View>


                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,

    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        padding: 5,
        marginBottom: 5,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'white'
    },
    inputContainer: {
        backgroundColor: Colors.login_card_background,
        margin: 20,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 10,
    },
    privacyPolicy: {
        marginTop: 20,
        textAlign: 'center',
        textDecorationLine: "underline"
    },
    company: {
        backgroundColor: Colors.login_card_background,
        borderRadius: 5,
        padding: 10,
        marginTop: -25,
        marginLeft: 50,
        marginRight: 50,
        elevation: 5,
        zIndex: 0,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        getAccessToken: (...args) => dispatch(LoginActions.getAccessTokenRequest(...args)),
        setAuthData: (...args) => dispatch(MainActions.setAuthData(...args)),
        getUserIdentity: (...args) => dispatch(LoginActions.getUserIdentityRequest(...args)),
        setUserIdentity: (...args) => dispatch(MainActions.setUserIdentity(...args)),

    }
}
const mapStateToProps = (state) => {
    return {
        main: state.main,
        login: state.login,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForgotPassword)