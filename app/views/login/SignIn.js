import React from 'react';
import { View, ImageBackground, Image, StatusBar, TouchableOpacity, SafeAreaView, StyleSheet, Linking, Platform, Alert, NativeModules, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';


import { Button, Icon } from 'react-native-elements'
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

import LocalStorageConstants from '../../local/LocalStorageConstants';
import TextView from '../../components/TextView';
import Colors from '../../theme/Colors';
import FontSize from '../../theme/FontSize';
import Constants from '../../services/Constants';

import UserDataModule from '../../native/UserDataModule';
import AppTheme from '../../theme/AppTheme';

import { showMessage, hideMessage } from "react-native-flash-message";
import { errorMessageData } from '../../helpers/FlashMessageData';


var IOSModule = NativeModules.AppDelegate;


class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: '',
            organizationImage: { uri: this.props.main.selectedOrganization.logoUrl },
            error: this.props.login.error,
            tokenData: this.props.login.tokenData,
            userIdentity: this.props.login.userIdentity
        }
    }

    async componentDidMount() {
        const savedUserName = await AsyncStorage.getItem(LocalStorageConstants.SavedUserName);
        const savedPassword = await AsyncStorage.getItem(LocalStorageConstants.SavedPassword);
        if (savedUserName !== null) {
            this.setState({ userName: savedUserName })
        }
        if (savedPassword !== null) {
            this.setState({ password: savedPassword })
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.login.error !== state.error) {
            return {
                error: props.login.error
            }
        }
        if (props.login.tokenData !== state.tokenData) {
            return {
                tokenData: props.login.tokenData
            }
        }
        if (props.login.userIdentity !== state.userIdentity) {
            return {
                userIdentity: props.login.userIdentity
            }
        }
        return null
    }

    componentDidUpdate(props, state) {
        if (state.error !== this.state.error) {
            if (this.state.error) {
                showMessage(errorMessageData({
                    title: this.props.main.languageResource.r_login_authentication_error_title || strings('r_login_authentication_error_title'),
                    message: this.props.main.languageResource.r_login_authentication_error_message || strings('r_login_authentication_error_message')
                }))
            }
        }

        if (state.tokenData !== this.state.tokenData) {
            AsyncStorage.setItem("auth", JSON.stringify(this.state.tokenData))
            this.props.setAuthData(this.state.tokenData);
            this.props.getUserIdentity(this.state.tokenData.access_token, this.props.main.selectedOrganization)
        }

        if (state.userIdentity !== this.state.userIdentity) {
            AsyncStorage.setItem("userIdentity", JSON.stringify(this.state.userIdentity));
            AsyncStorage.setItem("isLogin", "true");
            this.props.setUserIdentity(this.state.userIdentity);


            if (Platform.OS === 'android') {
                UserDataModule.userData(this.state.userIdentity.userId, this.state.userIdentity.organizationId);
            } else {
                IOSModule.registerPushNotifications(this.state.userIdentity.userId, this.state.userIdentity.organizationId)
            }

            this.props.navigation.navigate('SignedIn')
        }
    }

    login() {
        AsyncStorage.setItem(LocalStorageConstants.SavedUserName, this.state.userName);
        AsyncStorage.setItem(LocalStorageConstants.SavedPassword, this.state.password)
        this.props.getAccessToken(this.state.userName, this.state.password, this.props.main.selectedOrganization);
    }


    redirectToPrivacyPolicy() {
        Linking.openURL(this.props.main.selectedOrganization.almsPlusApiUrl + Constants.PrivacyPolicy)
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps={"handled"}>
                <ImageBackground source={login_bg} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                <SafeAreaView style={styles.mainContainer}>
                    {Platform.OS === "android" ? <StatusBar translucent backgroundColor="transparent" /> : <StatusBar hidden={true} />}

                    <View style={styles.inputContainer}>
                        <Image source={group2} style={{ height: 170, width: '100%', top: 0 }} />

                        <View style={{ padding: 20 }}>
                            <TextView>{this.props.main.languageResource.r_login_step_text || strings('r_login_step_text')} 2/2</TextView>

                            <TextView style={{ fontSize: FontSize.login_header, color: Colors.login_card_text, marginTop: 10 }} weight="bold">
                                {this.props.main.languageResource.r_login_input_title || strings('r_login_input_title')}
                            </TextView>

                            <TextField
                                labelTextStyle={{ fontFamily: AppTheme.fonts.medium }}
                                tintColor={Colors.primary}
                                label={this.props.main.languageResource.r_login_user_name_input || strings('r_login_user_name_input')}
                                returnKeyType="next"
                                onSubmitEditing={() => { this.passwordInput.focus() }}
                                autoCapitalize={"none"}
                                value={this.state.userName}
                                onChangeText={(userName) => this.setState({ userName })}
                                keyboardType='default' />

                            <TextField
                                labelTextStyle={{ fontFamily: AppTheme.fonts.medium }}
                                ref={(input) => { this.passwordInput = input }}
                                tintColor={Colors.primary}
                                label={this.props.main.languageResource.r_login_password_input_text || strings('r_login_password_input_text')}
                                returnKeyType="done"
                                autoCapitalize={"none"}
                                value={this.state.password}
                                onChangeText={(password) => {
                                    this.setState({ password })
                                }}
                                secureTextEntry={true}
                                keyboardType='default' />


                            <TouchableOpacity onPress={() => this.redirectToPrivacyPolicy()}>
                                <TextView style={styles.privacyPolicy}>{strings('r_app_privacy_policy')}</TextView>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigate('OrganizationSelection')} >
                                    <Icon name="md-arrow-back" type="ionicon" size={20} color="black" />
                                    <TextView style={{ paddingStart: 10 }} >{this.props.main.languageResource.r_login_back || strings('r_login_back')}</TextView>
                                </TouchableOpacity>

                                <Button
                                    disabled={this.state.userName.length === 0 || this.state.password.length === 0}
                                    buttonStyle={{ backgroundColor: Colors.primary }}
                                    title={this.props.main.languageResource.r_login_next || strings('r_login_next')}
                                    onPress={() => this.login()}
                                    icon={<Icon name="md-arrow-forward" type="ionicon" size={20} color="white" />}
                                    iconRight
                                    titleStyle={{ marginEnd: 8, marginBottom: 3, fontFamily: AppTheme.fonts.medium }} />

                            </View>

                            <View style={{ marginTop: 20, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL(this.props.main.selectedOrganization.almsPlusApiUrl + Constants.ForgottenPassword).catch(err => console.log("link error:", err))
                                    // this.props.navigation.navigate('LoginForgotPassword')
                                }}>
                                    <TextView >{this.props.main.languageResource.r_login_forgot_password || strings('r_login_forgot_password')}</TextView>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>


                    <View style={styles.company}>
                        <Image containerStyle={{ flex: 1 }} source={app_icon} style={{ width: 100, height: 30 }} />
                        <TextView style={{ fontSize: FontSize.login_alms, flex: 1, textAlign: 'right' }}>2013-{new Date().getFullYear()} {this.props.main.languageResource.r_login_alms || strings('r_login_alms')}</TextView>
                    </View>


                </SafeAreaView>
            </ScrollView>
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
        overflow: Platform.OS == "android" ? "hidden" : 'visible',
        elevation: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1,
    },
    privacyPolicy: {
        marginTop: 10,
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
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)