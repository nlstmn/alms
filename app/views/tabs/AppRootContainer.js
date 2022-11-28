import React from 'react';
import { View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { createAppRoot } from '../../navigation/Router';
import AsyncStorage from '@react-native-community/async-storage';
//redux
import { connect } from 'react-redux';
import MenuActions from '../../redux/MenuRedux';
import MainActions from '../../redux/MainRedux';
import LoginActions from '../../redux/LoginRedux';

import I18n from 'react-native-i18n';
import LocalStorageConstants from '../../local/LocalStorageConstants';

import Moment from 'moment';

import 'moment/locale/tr'
import 'moment/locale/en-gb'
import MainLoader from '../../components/MainLoader';

class AppRootContainer extends React.Component {
    constructor(props) {
        super(props);

        this.refreshTokenApiBody = {
            almsPlusAuthUrl: null,
            userName: '',
            password: '',
            apiAddress: null,
            refreshToken: null,
        }
    }


    async componentDidMount() {
        const auth = await AsyncStorage.getItem('auth');
        if (JSON.parse(auth) === null) {
            this.setLogout()
        }
        if (this.props.main.selectedOrganization === null)
            await this.setSelectedOrganization();
        if (this.props.main.authData === null)
            await this.setAuthData(auth);
        if (this.props.main.userIdentity === null)
            await this.setUserIdentity();

        if (this.props.main.selectedOrganization !== null && this.props.main.authData !== null && this.props.main.userIdentity !== null) {
            this.menuApiRequestBody = {
                remote: true,
                almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
                accessToken: this.props.main.authData.access_token,
                // accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkI0Mzg4RUM1QUFBQUY3MkJDMzFEMTRBNjFBNkJFNEVDRTQwREZFQTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJ0RGlPeGFxcTl5dkRIUlNtR212azdPUU5fcUUifQ.eyJuYmYiOjE1Njg2MTQwMTYsImV4cCI6MTU2ODY1MDAxNiwiaXNzIjoiaHR0cHM6Ly9hbG1zcC1hdXRoLmFsbXNjbG91ZC5jb20vIiwiYXVkIjpbImh0dHBzOi8vYWxtc3AtYXV0aC5hbG1zY2xvdWQuY29tL3Jlc291cmNlcyIsImFwaSJdLCJjbGllbnRfaWQiOiJhcGkiLCJzdWIiOiI1MTk1ODk6MTc5IiwiYXV0aF90aW1lIjoxNTY4NjE0MDE2LCJpZHAiOiJsb2NhbCIsImlkIjoiNTE5NTg5IiwibmFtZSI6IkF2bmkiLCJnaXZlbl9uYW1lIjoiYXlhbGNpbi5vZ3JldG1lbiIsImZhbWlseV9uYW1lIjoiWWFsw6fEsW4iLCJlbWFpbCI6ImZha2VfYXlhbGNpbi5vZ3JldG1lbkBhZHYuY29tLnRyIiwicm9sZSI6IjQiLCJwZXJtaXNzaW9uX2NvbnRlbnQiOiI1MTk1ODk6NDo3M0NBOUM1NDE5MjY4RjNFRTU1ODJENjg4MjExNzcxMjoxNjowN0I1MDIxRUM0QjQxMTBERkY2RjZBNzIzNDZDRjZBRSw1MTk1ODk6NDoyMzcyNjRGMTVCMkQ3QUFENTVCQkE0QTU3Mzc2REY3QToxNjoxNkFGRjkxRjY5N0Q5QjdENTU5NDVDN0MyRTk0OTdCQSw1MTk1ODk6NDpDQTVBNTUzOTUxREM2ODhEQjE5MjVGQTg4REY1MTAyRDoxNjo4MDg3RjhFMTMwRDA4QkMzRTE4NDU2MjZBM0ZFODhCQSw1MTk1ODk6NDoyNTk0OEY4QzJCQTlFNUY0NjNERDI2MDgyNTJFRTU1NjoxNjo2NDU2ODMxNUM4QkY4MDdEQzM2RkRGMkMwQTlGNTI0QSw1MTk1ODk6NDpDQkM2QzIxRDYxN0M5NkU3MjQwOUU2NEQyOTRBOTMwNDoxNjo0QkU2ODlGQjBBMDYyMDM5RjBEQUU1RTM0ODAxQzNCNyw1MTk1ODk6NDpBMUE3RTVCMDFCQjYwMDg2RjlDQUNFMERCMkQwNzY4NDoxNjo0Mzk2MTkzMjEzODBFQTlEQTMyRjJCMkYzRkUxMkFBOSw1MTk1ODk6NDpGRkZBQzY5N0UzNzQ4M0U2OEJGODI3ODI4RjYzMDlBODoxNjo0OEZGRTMzNUMzQ0Q2MjU2N0REMzZEQURGQjU3QzhEOCw1MTk1ODk6NDo1REJBRkU5QTkzNzYwRjM2MUJFNzZBODAyRjExMjVGQToxNjoyMDg3M0Y0NTBDQTQwNjFCNjI3OUJGMDM1NTk4MjYyNiw1MTk1ODk6NDowMDFENThGMTczNUQxQUE1MDdGMzdDODlBQzMzNDYzNjoxNjpDQjFEQUUzRjAzNUI0RDE4M0QwQkIwNjA2NjAyN0M5RCw1MTk1ODk6NDpBQ0I5MDk4OTAzNkRDMUMxNDhGREJFREI5ODI0OTA1MToxNjo3MzVCMkU4MEZEQjE3M0M1NzY2M0Q0MzMxM0ExRkZDMiIsImN1c3RvbV9wZXJtaXNzaW9uX2NvbnRlbnQiOiIiLCJvcmdhbml6YXRpb25faWQiOiIxNzkiLCJzY29wZSI6WyJhcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsiY3VzdG9tIl19.KGq9nhvfGNeErElWzQmwo8C_6NaNKrN1FSA62ox8Tw4gyHDMW-kL30TQmgp06V1s_8ptytOgkesPZHlmDAUI49hwpwzpuKDlnJRr31SvuiC2CNwAM1112stf9CWHVsQ1cEsfwHO5VWnQyB4YbkbnTDC7YDsYm1D4rFzQGAGoaQahaA7hOXtXlaqn2lxHfZ-Gr9CLBamVOYlaIa5KXqQ1N3QMu0MXRoiDm9xt6-ZRqeR4IgPczmlEDBu7NbSmnjz64TAVmbEir-oadJMtsUuKc_SYBC8l06HlRbyKFt4t_gfDJOxD4XfB0UHxnOqA22cJOre6LEk5Pw_BrRRqXpEs9Q',
            }

            this.languageResourceApiRequestBody = {
                remote: true,
                version: LocalStorageConstants.LanguageVersion,
                resourceType: null,
                almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            }

            this.callLanguageResourcesApi()
            this.callMenuApi("componentDidMount");
        }


        this.momentSettings()
    }


    async componentWillReceiveProps(props) {
        console.log("app root componentWillReceiveProps",this.props.login.errorMessage);
        if (props.menu.error !== this.props.menu.error && props.menu.error) {
            console.log("menu error: ", props.menu.error);
            if (props.menu.errorMessage.code === 401) {
                const authData = await AsyncStorage.getItem('auth')
                const userName = await AsyncStorage.getItem(LocalStorageConstants.SavedUserName)
                const userPsw = await AsyncStorage.getItem(LocalStorageConstants.SavedPassword)

                if (userName === null || userPsw === null) {
                    this.setLogout()
                    return
                }
                this.refreshTokenApiBody.userName = userName;
                this.refreshTokenApiBody.password = userPsw;
                this.refreshTokenApiBody.almsPlusAuthUrl = this.props.main.selectedOrganization.almsPlusAuthUrl;
                this.refreshTokenApiBody.apiAddress = this.props.main.selectedOrganization.apiAddress;
                this.refreshTokenApiBody.refreshToken = JSON.parse(authData).refresh_token

                // this.props.refreshToken(this.refreshTokenApiBody)
                this.props.getAccessTokenRequest(userName, userPsw, this.props.main.selectedOrganization)
            } else {
                this.props.navigation.navigate('ErrorPage')
            }
        }
        //önceden alınması gereken dataların hazır olmasını bekle.
        if (props.main.organizationIsReady && props.main.authDataIsReady
            && props.main.userIdenetityIsReady && props.menu.menu.length === 0 && !props.menu.error
            && !props.menu.fetching && !props.main.languageResourceFetching) {
            console.log('test 1 : ', this.props.menu.menu)
            this.menuApiRequestBody = {
                remote: true,
                almsPlusApiUrl: props.main.selectedOrganization.almsPlusApiUrl,
                accessToken: props.main.authData.access_token,
            }

            this.languageResourceApiRequestBody = {
                remote: true,
                version: LocalStorageConstants.LanguageVersion,
                resourceType: null,
                almsPlusApiUrl: props.main.selectedOrganization.almsPlusApiUrl,
            }

            this.callLanguageResourcesApi()
            this.callMenuApi("componentWillReceiveProps");
        }

        if (this.props.login.tokenData !== props.login.tokenData) {
            console.log("new access token generated")
            this.props.setAuthData(props.login.tokenData);
            await AsyncStorage.setItem("auth", JSON.stringify(props.login.tokenData))
            this._apiCallsWithNewToken(props.login.tokenData);
        }
        if (this.props.login.error) {
            console.log("redirect error page")
            // this.props.navigation.navigate('ErrorPage')
        }

    }

    async setSelectedOrganization() {
        const organization = await AsyncStorage.getItem('selectedOrganization');
        console.log("AppRootTest: ", JSON.parse(organization));
        await this.props.setSelectedOrganization(JSON.parse(organization));

    }
    async setAuthData(auth) {
        await this.props.setAuthData(JSON.parse(auth));

    }
    async setUserIdentity() {
        const userIdentity = await AsyncStorage.getItem('userIdentity');
        await this.props.setUserIdentity(JSON.parse(userIdentity));

    }


    async setLogout() {
        await AsyncStorage.setItem("isLogin", "false");
        const saveUserName = await AsyncStorage.getItem(LocalStorageConstants.SavedUserName);
        await AsyncStorage.clear();
        await AsyncStorage.setItem(LocalStorageConstants.SavedUserName, saveUserName);
        this.props.userLogout()
        this.props.navigation.navigate('SignedOut');

    }


    callMenuApi(type) {
        console.log('this.props.menu.menu :', this.props.menu.menu)
        if (this.props.menu.menu.length === 0) {
            console.log("callMenuApi type: ", type);
            NetInfo.fetch().then(netstate => {
                if (netstate.isConnected) {
                    this.props.getMenuRequest(this.menuApiRequestBody)
                } else {
                    this.menuApiRequestBody.remote = false
                    this.props.getMenuRequest(this.menuApiRequestBody)
                }
            })
        }
    }

    _apiCallsWithNewToken(tokenData) {
        console.log("_apiCallsWithNewToken");
        this.menuApiRequestBody.accessToken = tokenData.access_token
        if (this.props.menu.menu.length === 0) {
            NetInfo.fetch().then(netstate => {
                if (netstate.isConnected) {
                    this.props.getMenuRequest(this.menuApiRequestBody)
                } else {
                    this.menuApiRequestBody.remote = false
                    this.props.getMenuRequest(this.menuApiRequestBody)
                }
            })
        }
    }


    callLanguageResourcesApi() {
        console.log('this.props.main.languageResource.length: ', this.props.main.languageResource.length)
        if (this.props.main.languageResource.length === 0) {
            console.log("language resource is null, continue with api calls");
            const currentLocale = I18n.currentLocale();

            NetInfo.fetch().then(state => {

                if (!state.isConnected) this.languageResourceApiRequestBody.remote = false

                AsyncStorage.getItem(LocalStorageConstants.Language, (err, result) => {
                    if (result == null) {
                        if (currentLocale.indexOf('tr') === 0) {
                            this.languageResourceApiRequestBody.resourceType = LocalStorageConstants.LanguageTrResource
                            AsyncStorage.setItem(LocalStorageConstants.Language, LocalStorageConstants.LanguageTrResource);
                            this.props.getLanguageResourceRequest(this.languageResourceApiRequestBody);
                        } else {
                            this.languageResourceApiRequestBody.resourceType = LocalStorageConstants.LanguageEnResource
                            AsyncStorage.setItem(LocalStorageConstants.Language, LocalStorageConstants.LanguageEnResource);
                            this.props.getLanguageResourceRequest(this.languageResourceApiRequestBody);
                        }
                    } else {
                        if (result === LocalStorageConstants.LanguageTrResource)
                            I18n.locale = "tr"
                        else
                            I18n.locale = "en"
                        this.languageResourceApiRequestBody.resourceType = result
                        this.props.getLanguageResourceRequest(this.languageResourceApiRequestBody);
                    }
                });
            });
        }
    }

    async momentSettings() {
        const selectedLangResource = await AsyncStorage.getItem(LocalStorageConstants.Language);
        if (selectedLangResource === LocalStorageConstants.LanguageTrResource) {
            Moment.locale('tr')
        } else {
            Moment.locale('en-gb')
        }
    }

    _render() {
        if (this.props.menu.menu.length !== 0 && this.props.main.languageResource.length !== 0) {
            const { navigate } = this.props.navigation;
            const AppRoot = createAppRoot(this.props.menu.menu, this.props.main.languageResource, navigate)
            return <AppRoot />
        } else {
            // return <ActivityIndicator style={{ flex: 1, alignItems: 'center' }} size="large" color={Colors.primary} />
            return null
        }

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MainLoader />
                {this._render()}
            </View>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        getMenuRequest: (...args) => dispatch(MenuActions.getMenuRequest(...args)),
        getLanguageResourceRequest: (...args) => dispatch(MainActions.getLanguageResourceRequest(...args)),
        setSelectedOrganization: (...args) => dispatch(MainActions.setSelectedOrganization(...args)),
        setAuthData: (...args) => dispatch(MainActions.setAuthData(...args)),
        setUserIdentity: (...args) => dispatch(MainActions.setUserIdentity(...args)),
        userLogout: () => dispatch(MainActions.clearRedux()),
        refreshToken: (...args) => dispatch(LoginActions.refreshTokenRequest(...args)),
        getAccessTokenRequest: (...args) => dispatch(LoginActions.getAccessTokenRequest(...args))
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.menu,
        main: state.main,
        login: state.login,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRootContainer)