import React from 'react';
import { View, ImageBackground, StatusBar, TouchableOpacity, FlatList, SafeAreaView, Alert, Platform, StyleSheet } from 'react-native';
import { Input, Image, Button, Icon } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';

//assets
import app_icon from '../assets/images/app_icon.jpg';
import cloud_bg from '../assets/images/atmosphere-clouds2x.png'
import group from '../assets/images/group.png'
import AsyncStorage from '@react-native-community/async-storage';
import AppTheme from '../theme/AppTheme';
//components
import OrganizationItem from '../components/organization/OrganizationItem';

//redux
import OrganizationActions from '../redux/OrganizationRedux';
import MainActions from '../redux/MainRedux';
import { connect } from 'react-redux';

import I18n from 'react-native-i18n';

import LocalStorageConstants from '../local/LocalStorageConstants';
import Colors from '../theme/Colors';
import { calculateLoginPageWidthPercent } from '../helpers/Calculate';
import TextView from '../components/TextView';
import FontSize from '../theme/FontSize';

import { strings } from '../locales/i18n';
import { showMessage, hideMessage } from "react-native-flash-message";
import { errorMessageData } from '../helpers/FlashMessageData';

class OrganizationSelection extends React.Component {

    onLayout(e) {
        this.setState({
            widthPercent: calculateLoginPageWidthPercent()
        })
    }


    constructor(props) {
        super(props);
        this.state = {
            query: '',
            selectedOrganization: null,
            languageIndex: null,
            languageChanged: false,
            widthPercent: calculateLoginPageWidthPercent(),
        };
        this._languageChange = this._languageChange.bind(this)
    }

    componentWillMount() {
        const currentLocale = I18n.currentLocale();
        if (currentLocale.indexOf('tr') === 0) {
            this.setState({ languageIndex: 0 })
        } else {
            this.setState({ languageIndex: 1 })
        }
    }

    componentDidMount() {
        this.props.getAllOrganizations();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedOrganization !== this.state.selectedOrganization) {
            this.setState({ query: '' })
        }
    }
    componentWillReceiveProps(props) {
        if (props.organizations.error) {
            showMessage(errorMessageData({ message: strings('r_login_instruction_api_error') }))
        }

        if (!props.main.languageResourceFetching && !props.main.languageResourceError && props.main.languageResource !== null && this.state.selectedOrganization !== null) {
            this.props.setLanguageResources(props.main.languageResource)
        }
    }

    findOrganizations = (query) => {
        if (query === '') {
            return [];
        }

        return this.props.organizations.organizationsData.filter(item =>
            item.almsPlusApiUrl !== null &&
            item.almsPlusAuthUrl !== null &&
            this.replaceTurkishCharacter(item.name).toLowerCase()
                .search(this.replaceTurkishCharacter(query).toLowerCase()) >= 0);
    }

    replaceTurkishCharacter(text) {
        return text.replace('İ', 'i')
            .replace('ı', "i")
            .replace('I', 'i')
            .replace('Ç', 'c')
            .replace('ç', 'c')
            .replace('ğ', 'g')
            .replace('ö', 'o')
            .replace('Ö', 'o')
            .replace('ş', 's')
            .replace('Ş', 's')
            .replace('ü', 'u')
            .replace('Ü', 'u')
            .replace('U', 'u')
    }

    inputChange(text) {
        this.setState({ query: text })
        this.clearSelectedData()
    }

    clearSelectedData() {
        this.setState({ selectedOrganization: null })
        AsyncStorage.removeItem('selectedOrganization')
        this.props.setSelectedOrganization(null)
    }

    async organizationSelected(item) {
        await this.setState({ selectedOrganization: item })
        await AsyncStorage.setItem('selectedOrganization', JSON.stringify(item))
        this.props.setSelectedOrganization(item)


        NetInfo.fetch().then(statu => {
            var remote = false;
            if (statu.isConnected) {
                remote = true;
            }

            if (this.state.languageIndex === 0) { //0 index: turkish language resource
                const data = {
                    remote: remote,
                    version: LocalStorageConstants.LanguageVersion,
                    resourceType: LocalStorageConstants.LanguageTrResource,
                    almsPlusApiUrl: this.state.selectedOrganization.almsPlusApiUrl
                }
                this.props.getLanguageResourceRequest(data)
                AsyncStorage.setItem(LocalStorageConstants.Language, LocalStorageConstants.LanguageTrResource);
            } else { //1 index: english language resource
                const data = {
                    remote: remote,
                    version: LocalStorageConstants.LanguageVersion,
                    resourceType: LocalStorageConstants.LanguageEnResource,
                    almsPlusApiUrl: this.state.selectedOrganization.almsPlusApiUrl
                }
                this.props.getLanguageResourceRequest(data)
                AsyncStorage.setItem(LocalStorageConstants.Language, LocalStorageConstants.LanguageEnResource);
            }
        })
    }

    _languageChange(selectedIndex) {
        if (selectedIndex === 0) {
            I18n.locale = 'tr'
        } else {
            I18n.locale = 'en'
        }
        this.setState({
            languageIndex: selectedIndex,
            languageChanged: true,
        })

    }


    _keyExtractor = (item, index) => item.organizationId;

    render() {
        const { query } = this.state;
        const organizations = this.findOrganizations(query);

        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={cloud_bg} style={mStyles.bacgroundImageStyle} />
                <SafeAreaView style={mStyles.mainContainer}>
                    {Platform.OS === "android" ? <StatusBar translucent backgroundColor="transparent" /> : <StatusBar hidden={true} />}

                    <View onLayout={this.onLayout.bind(this)}
                        style={{ flex: 1, flexDirection: 'column', width: this.state.widthPercent, alignSelf: 'center' }}>
                        <View style={mStyles.inputContainer}>
                            <Image source={group} style={{ height: 170, width: '100%', top: 0 }} />
                            <View style={{ padding: 20 }}>
                                <View>
                                    <TextView weight="medium">{this.props.main.languageResource.r_login_step_text || strings('r_login_step_text')} 1/2</TextView>
                                    <TextView style={mStyles.inputCompany} weight="bold">{strings('r_login_select_instruction')}</TextView>
                                    <Input
                                        autoFocus={true}
                                        placeholder={strings('r_login_instruction_input')}
                                        shake={true}
                                        labelStyle={{ fontFamily: AppTheme.fonts.medium }}

                                        containerStyle={{ marginTop: 10 }}
                                        onChangeText={(text) => this.inputChange(text)}>{this.state.selectedOrganization !== null ? this.state.selectedOrganization.name : this.state.query}</Input>
                                </View>

                                <FlatList keyboardShouldPersistTaps={"always"} data={organizations} keyExtractor={this._keyExtractor} renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => this.organizationSelected(item)}>
                                        <OrganizationItem organization={item} />
                                    </TouchableOpacity>
                                )} />


                                <Button
                                    disabled={this.state.selectedOrganization === null}
                                    title={strings('r_login_next')}
                                    titleStyle={{ marginEnd: 10, marginBottom: 5, fontFamily: AppTheme.fonts.medium }}
                                    icon={<Icon name="md-arrow-forward" type="ionicon" size={20} color="white" />}
                                    iconRight
                                    containerStyle={{ padding: 20, marginTop: 20 }}
                                    buttonStyle={{ backgroundColor: Colors.primary }}
                                    onPress={() => {
                                        this.props.navigation.navigate('SignIn')
                                    }}
                                />

                                {/* <View style={mStyles.almsInfo}>
                                    <TextView style={{ fontSize: FontSize.login_alms }}>2013-{new Date().getFullYear()} {this.props.main.languageResource.r_login_alms || strings('r_login_alms')}</TextView>
                                </View> */}
                            </View>
                        </View>
                        <View style={mStyles.company}>
                            <Image containerStyle={{ flex: 1 }} source={app_icon} style={{ width: 100, height: 30 }} />
                            <TextView style={{ fontSize: FontSize.login_alms, flex: 1, textAlign: 'right' }}>2013-{new Date().getFullYear()} {this.props.main.languageResource.r_login_alms || strings('r_login_alms')}</TextView>
                        </View>
                        {/* Language Selector */}
                        {/* <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', borderRadius: 5 }}>
                                <ButtonGroup
                                    buttons={[Constants.SupportedLanguage.TR, Constants.SupportedLanguage.EN]}
                                    onPress={this._languageChange}
                                    selectedIndex={this.state.languageIndex} containerStyle={{ width: 100 }}
                                    selectedButtonStyle={{ backgroundColor: Colors.primary }} />
                            </View>
                        </View> */}
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const mStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    bacgroundImageStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    inputContainer: {
        backgroundColor: Colors.login_card_background,
        margin: 20,
        borderRadius: 10,
        overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 10,
        zIndex: 1,
    },
    inputCompany: {
        fontSize: FontSize.login_header,
        color: Colors.login_card_text,
        marginTop: 10
    },
    almsInfo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
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
        getAllOrganizations: () => dispatch(OrganizationActions.getOrganizationRequest()),
        setLanguageResources: (...args) => dispatch(MainActions.setLanguageResources(...args)),
        setSelectedOrganization: (...args) => dispatch(MainActions.setSelectedOrganization(...args)),
        getLanguageResourceRequest: (...args) => dispatch(MainActions.getLanguageResourceRequest(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        organizations: state.organizations,
        main: state.main,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrganizationSelection)