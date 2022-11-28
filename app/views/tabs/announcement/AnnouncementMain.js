import React from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import AnnouncementRouter from '../../../navigation/AnnouncementRouter';

import Colors from '../../../theme/Colors';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';
import Constants from '../../../services/Constants';
import { strings } from '../../../locales/i18n';

class AnnouncementMain extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: params.title,
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    {params.userType === Constants.UserTypes.Instructor &&
                        <Icon name="ios-add-circle" type="ionicon" containerStyle={style.icon} onPress={() => navigation.navigate("AddAnnouncement")} />
                    }
                    <Icon name="ios-search" type="ionicon" containerStyle={style.icon} onPress={() => {
                        navigation.navigate('SearchAnnouncement')
                    }} />
                    <Icon name="md-menu" type="ionicon" containerStyle={style.icon} onPress={() => params.drawer()} />
                </View>
            ),
            headerStyle: {
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
                borderBottomWidth: 0,
            },
        }
    }

    openDrawerMenu = () => {
        this.props.navigation.openDrawer()
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: this.props.main.languageResource.r_page_announcement_title || strings('r_page_announcement_title'),
            userType: this.props.main.userIdentity.userType,
            drawer: this.openDrawerMenu
        });
    }

    static router = AnnouncementRouter.router
    _renderTabBar() {

        return <AnnouncementRouter navigation={this.props.navigation} screenProps={{ languageResource: this.props.main.languageResource }} />
    }



    _composeNewAnnouncement() {
        this.props.navigation.navigate('newAnnouncement')
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
                {this._renderTabBar()}
            </SafeAreaView>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementMain)

const style = StyleSheet.create({
    icon: {
        padding: 10
    }
})
