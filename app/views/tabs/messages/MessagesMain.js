import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import Colors from '../../../theme/Colors';
import { strings } from '../../../locales/i18n';
import { Icon } from 'react-native-elements';

import MessagesAll from '../messages/MessagesAll';
import MessagesPersonally from '../messages/MessagesPersonally';
import MessagesGroup from '../messages/MessagesGroup';

const MessagesTabRouter = createMaterialTopTabNavigator({
    All: {
        screen: MessagesAll,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: screenProps.languageResource.r_all_text || strings('r_all_text')
            }

        }
    },
    Group: {
        screen: MessagesGroup,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: screenProps.languageResource.r_messages_group || strings('r_messages_group')
            }

        }
    },
    Personal: {
        screen: MessagesPersonally,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: screenProps.languageResource.r_messages_personally || strings('r_messages_personally')
            }

        }
    }
}, {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    backBehavior: 'none',
    tabBarOptions: {

        activeTintColor: Colors.messages_tab_active_text_color,
        inactiveTintColor: Colors.messages_tab_inactive_text_color,
        scrollEnabled: false,
        style: {
            backgroundColor: Colors.messages_tab_background,
        },
        labelStyle: {
            textAlign: 'center',
        },
        indicatorStyle: {
            borderBottomColor: Colors.primary,
            borderBottomWidth: 2,
        },
    },
});

export const MessagesRouter = createAppContainer(createSwitchNavigator({
    messagesTabs: {
        screen: MessagesTabRouter
    }
}))

class MessagesMain extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        refreshing: false
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: params.title,
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    <Icon name="ios-add-circle" type="ionicon" containerStyle={style.icon} onPress={() => navigation.navigate('GroupsPersons')} />
                    {/* <Icon name="ios-search" type="ionicon" containerStyle={style.icon} onPress={() => console.log("clicked")} /> */}
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
            title: this.props.main.languageResource.r_menu_messages,
            drawer: this.openDrawerMenu
        })

    }

    static router = MessagesRouter.router;
    _renderTabs() {
        return <MessagesRouter navigation={this.props.navigation} screenProps={{ languageResource: this.props.main.languageResource }} />
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.messages.messagesPersonel !== this.props.messages.messagesPersonel) {
            this.setState({ refreshing: false })
        }
    }


    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this._renderTabs()}
                </View>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    icon: {
        padding: 10
    }
})

const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => {
    return {
        main: state.main,
        loader: state.loader,
        messages: state.messages,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesMain)