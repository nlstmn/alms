import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../../theme/Colors';
import DeviceInfo from 'react-native-device-info';
import TextView from '../../components/TextView';

var PJson = require('../../../package.json')
import { connect } from 'react-redux';
import MainActions from '../../redux/MainRedux';
import LocalStorageConstants from '../../local/LocalStorageConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import Constants from '../../services/Constants';
import { strings } from '../../locales/i18n';
import FontSize from '../../theme/FontSize';

import I18n from 'react-native-i18n';


class DrawerMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: props.menuItems,
            nav: props.nav,
            arrayStack: [],
            languageOptions: [Constants.SupportedLanguage.TR, Constants.SupportedLanguage.EN, this.props.main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')],
            languageIndex: null,
            selecteLanguageIndex: null,
        }

        if (DeviceInfo.isTablet()) {
            for (let i = 4; i < this.state.menuItems.length; i++) {
                this.state.arrayStack.push(this.state.menuItems[i]);
            }
        } else {

            this.state.menuItems.map(item => {
                switch (item.name) {
                    case 'r_menu_surveys':
                        this.state.arrayStack.push(item);
                        break;
                    case 'r_menu_forum':
                        this.state.arrayStack.push(item);
                        break
                    case 'r_menu_profile':
                        this.state.arrayStack.push(item);
                        break
                    case 'r_menu_logout':
                        this.state.arrayStack.push(item);
                        break;
                    case 'r_menu_change_language':
                        this.state.arrayStack.push(item);
                        break;
                }
            })
            // for (let i = 4; i < this.state.menuItems.length; i++) {
            //     this.state.arrayStack.push(this.state.menuItems[i]);
            // }
        }

        this.languageResourceApiRequestBody = {
            remote: true,
            version: LocalStorageConstants.LanguageVersion,
            resourceType: null,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
        }


    }

    async componentDidMount() {
        const langIndex = await AsyncStorage.getItem(LocalStorageConstants.Language);
        this.setState({ languageIndex: langIndex })
    }

    async _logout() {
        await AsyncStorage.setItem("isLogin", "false");
        const saveUserName = await AsyncStorage.getItem(LocalStorageConstants.SavedUserName);
        const savedPassword = await AsyncStorage.getItem(LocalStorageConstants.SavedPassword);
        await AsyncStorage.clear();
        await AsyncStorage.setItem(LocalStorageConstants.SavedUserName, saveUserName);
        await AsyncStorage.setItem(LocalStorageConstants.SavedPassword, savedPassword)
        this.props.userLogout()
        //this.props.navigation.navigate('SignedOut');
        this.state.nav('SignedOut')
    }

    menuClicked(item) {
        switch (item.name) {
            case 'r_menu_my_files':
                this.props.navigation.navigate('files')
                this.props.navigation.closeDrawer();
                break;
            case 'r_menu_profile':
                this.props.navigation.navigate('profile')
                this.props.navigation.closeDrawer();
                break;

            case 'r_menu_change_language':
                this.showWeekActionSheet();
                this.props.navigation.closeDrawer();
                break;
        }

    }

    _renderDrawerMenuItem(item) {
        switch (item.name) {
            // case 'r_menu_my_files':
            //     return (
            //         <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
            //             <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            //                 <Ionicons size={25} name="ios-attach" color={Colors.drawer_menu_item_icon_color} />
            //             </View>

            //             <TextView style={{ marginStart: 10, color: Colors.drawer_menu_item_color, fontSize: FontSize.drawer_menu_item_text }} weight="bold">
            //                 {this.props.main.languageResource.r_menu_my_files || strings('r_menu_my_files')}
            //             </TextView>
            //         </View>
            //     )
            // case 'r_menu_profile':
            //     return (
            //         <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
            //             <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            //                 <Ionicons size={25} name="ios-person" color={Colors.drawer_menu_item_icon_color} />
            //             </View>

            //             <TextView style={{ marginStart: 10, color: Colors.drawer_menu_item_color, fontSize: FontSize.drawer_menu_item_text }} weight="bold">
            //                 {this.props.main.languageResource.r_menu_profile || strings('r_menu_profile')}
            //             </TextView>
            //         </View>
            //     )

            // case 'r_menu_surveys':
            //     return (
            //         <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
            //             <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            //                 <Ionicons size={25} name="ios-list-box" color={Colors.drawer_menu_item_icon_color} />
            //             </View>

            //             <TextView style={{ marginStart: 10, color: Colors.drawer_menu_item_color, fontSize: FontSize.drawer_menu_item_text }} weight="bold">
            //                 Anket
            //             </TextView>
            //         </View>
            //     )
            // case 'r_menu_forum':
            //     return (
            //         <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
            //             <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
            //                 <Ionicons size={25} name="ios-chatbubbles" color={Colors.drawer_menu_item_icon_color} />
            //             </View>

            //             <TextView style={{ marginStart: 10, color: Colors.drawer_menu_item_color, fontSize: FontSize.drawer_menu_item_text }} weight="bold">
            //                 Forum
            //             </TextView>
            //         </View>
            //     )
            case 'r_menu_change_language':
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                        <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome size={25} name="language" color={Colors.drawer_menu_item_icon_color} />
                        </View>

                        <TextView style={{ marginStart: 10, color: Colors.drawer_menu_item_color, fontSize: FontSize.drawer_menu_item_text }} weight="bold">
                            {this.props.main.languageResource.r_menu_change_language || strings('r_menu_change_language')}
                        </TextView>
                    </View>
                )
            default:
                return null
        }
    }
    showWeekActionSheet = () => {
        this.ActionSheet.show()
    }
    renderChangeLanguageActionSheet() {
        const menuOptions = [];
        if (Platform.OS === 'android') {
            menuOptions.push(
                <TextView weight="bold" style={{ color: Colors.course_weeks_menu_item_text_color, fontSize: FontSize.course_weeks_item }}>
                    {this.props.main.languageResource.r_change_language_option_turkish || strings('r_change_language_option_turkish')}
                </TextView>)
            menuOptions.push(
                <TextView weight="bold" style={{ color: Colors.course_weeks_menu_item_text_color, fontSize: FontSize.course_weeks_item }}>
                    {this.props.main.languageResource.r_change_language_option_english || strings('r_change_language_option_english')}
                </TextView>)
            menuOptions.push(
                <TextView weight="bold" style={{ color: 'black', fontSize: 18 }}>
                    {this.props.main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')}
                </TextView>)
        }
        else {
            menuOptions.push(<Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", padding: 10 }} >
                {this.props.main.languageResource.r_change_language_option_turkish || strings('r_change_language_option_turkish')}
            </Text>)
            menuOptions.push(<Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", padding: 10 }} >
                {this.props.main.languageResource.r_change_language_option_english || strings('r_change_language_option_english')}
            </Text>)
            menuOptions.push(<Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", padding: 10 }} >{this.props.main.languageResource.r_actionsheet_menu_close_button_text || strings('r_actionsheet_menu_close_button_text')}</Text>)
        }
        return (
            <ActionSheet ref={o => this.ActionSheet = o}
                options={menuOptions}
                cancelButtonIndex={menuOptions.length - 1}
                onPress={(index) => {
                    if (index == menuOptions.length - 1) return
                    if (index === 0) {
                        if (this.state.languageIndex !== LocalStorageConstants.LanguageTrResource) {
                            this.languageResourceApiRequestBody.resourceType = LocalStorageConstants.LanguageTrResource
                            this.props.getLanguageResourceRequest(this.languageResourceApiRequestBody)
                            this.setState({ languageIndex: LocalStorageConstants.LanguageTrResource })
                            AsyncStorage.setItem(LocalStorageConstants.Language, LocalStorageConstants.LanguageTrResource)
                            I18n.locale = "tr"
                        }
                    }
                    else {
                        if (this.state.languageIndex !== LocalStorageConstants.LanguageEnResource) {
                            this.languageResourceApiRequestBody.resourceType = LocalStorageConstants.LanguageEnResource
                            this.props.getLanguageResourceRequest(this.languageResourceApiRequestBody)
                            this.setState({ languageIndex: LocalStorageConstants.LanguageEnResource })
                            AsyncStorage.setItem(LocalStorageConstants.Language, LocalStorageConstants.LanguageEnResource)
                            I18n.locale = "en"
                        }
                    }
                }}
            />
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.containerMain}>
                    <View>
                        {
                            this.state.arrayStack.map(item => (
                                <TouchableOpacity
                                    onPress={() => this.menuClicked(item)}
                                    key={item.name}
                                >
                                    {this._renderDrawerMenuItem(item)}
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    <View style={styles.bottomView}>
                        <TouchableOpacity onPress={() => this._logout()} style={{ marginBottom: 15, backgroundColor: '#fff', borderColor: Colors.primary, borderWidth: 1, borderRadius: 30, paddingEnd: 50, paddingStart: 50, paddingTop: 7, paddingBottom: 7 }}>
                            <TextView style={{ color: Colors.drawer_menu_item_color, fontSize: 16 }}>{this.props.main.languageResource.r_fileUpload_logOut}</TextView>
                        </TouchableOpacity>

                        <TextView weight="regular" style={{ fontSize: 11 }}>{this.props.main.languageResource.r_app_version || strings('r_app_version')} {PJson.version}</TextView>
                    </View>

                    {this.renderChangeLanguageActionSheet()}
                </View>
            </SafeAreaView>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        userLogout: () => dispatch(MainActions.clearRedux()),
        getLanguageResourceRequest: (...args) => dispatch(MainActions.getLanguageResourceRequest(...args)),

    }
}

const mapStateToProps = (state) => {
    return {
        main: state.main
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu)
const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
    },
    bottomView: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
});