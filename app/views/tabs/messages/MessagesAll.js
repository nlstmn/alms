import React from 'react';
import { View, TouchableOpacity, RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import { strings } from '../../../locales/i18n';
import MessagesActions from '../../../redux/MessagesRedux';
import { Icon } from 'react-native-elements';


import MessageListItem from '../../../components/messages/MessageListItem';
import Colors from '../../../theme/Colors';
import TextView from '../../../components/TextView';
import MessageListItemPersonally from '../../../components/messages/MessageListItemPersonally';
import EmptyCard from '../../../components/EmptyCard';


class MessagesAll extends React.Component {

    state = {
        refreshing: false,
        scrolled: false,
        personelMessage: this.props.messages.messagesPersonel,
        groupMessage: this.props.messages.messagesGroups
    }

    componentDidMount() {
        this.callApis()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.messages.messagesPersonel !== this.props.messages.messagesPersonel) {
            this.setState({ refreshing: false })
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.messages.messagesGroups !== state.groupMessage) {
            return {
                groupMessage: props.messages.messagesGroups
            }
        }
        if (props.messages.messagesPersonel !== state.personelMessage) {
            return {
                personelMessage: props.messages.messagesPersonel
            }
        }
        return null
    }

    callApis(loader = true) {
        this.messageGroupApiCall(loader);
        this.messagePersonelApiCall(loader);
    }

    messageGroupApiCall(loader) {
        this.setState({ scrolled: false })
        const requestBody = {
            remote: true,
            accessToken: this.props.main.authData.access_token,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            take: 1000, //TODO: sonra 5 e cevrilecek
            skip: 0,
            isGroup: true,
            type: 1,
            loader
        }
        this.props.getMessagesGroups(requestBody);
    }

    messagePersonelApiCall(loader) {
        const requestBody = {
            accessToken: this.props.main.authData.access_token,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            take: 1000, //TODO: sonra 5 e cevrilecek
            skip: 0,
            isGroup: false,
            type: 1,
            loader
        }
        this.props.getMessagesPersonelRequest(requestBody);
    }


    renderGroupMessage() {
        return (
            <View style={style.flatList}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TextView style={style.grupMessageText} weight="bold">{strings('r_messages_group_messages')}</TextView>
                    {this.state.groupMessage.length > 0 &&
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, alignItems: 'center' }} onPress={() => {
                            this.props.navigation.navigate('Group')
                        }}>
                            <TextView style={{ color: 'black', marginEnd: 10 }}>{this.props.main.languageResource.r_all_text || strings('r_all_text')}</TextView>
                            <Icon name="md-arrow-forward" type="ionicon" color="black" />
                        </TouchableOpacity>
                    }
                </View>
                {this.state.groupMessage.length > 0 ?
                    this.state.groupMessage.map((item, index) => {
                        return <MessageListItem currentUserId={this.props.main.userIdentity.userId} data={item} key={index} navigation={this.props.navigation} refresh={() => this.callApis(false)} />
                    })
                    :
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <EmptyCard description={this.props.main.languageResource.r_group_message_empty_text || strings('r_group_message_empty_text')} />
                    </View>
                }

            </View>
        )
    }

    renderPersonMessage() {
        return (
            <View style={style.flatList}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TextView style={style.grupMessageText} weight="bold">{strings('r_messages_personally_messages')}</TextView>

                    {this.state.personelMessage.length > 0 &&
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, alignItems: 'center' }} onPress={() => {
                            this.props.navigation.navigate('Personal')
                        }}>
                            <TextView style={{ color: 'black', marginEnd: 10 }}>{this.props.main.languageResource.r_all_text || strings('r_all_text')}</TextView>
                            <Icon name="md-arrow-forward" type="ionicon" color="black" />
                        </TouchableOpacity>
                    }
                </View>

                {
                    this.state.personelMessage.length > 0 ?
                        this.state.personelMessage.map((item, index) => (
                            <MessageListItemPersonally currentUserId={this.props.main.userIdentity.userId} data={item} key={index} navigation={this.props.navigation} refresh={() => this.callApis(false)} />
                        ))
                        :
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <EmptyCard description={this.props.main.languageResource.r_personel_message_empty_text ||strings('r_personel_message_empty_text')} />
                        </View>
                }
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.background, }}>
                <ScrollView contentContainerStyle={{ padding: 10 }} refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this.callApis(false)
                        this.setState({ refreshing: true })
                    }}
                    />
                } >
                    {this.renderGroupMessage()}
                    {this.renderPersonMessage()}
                </ScrollView>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getMessagesGroups: (...args) => dispatch(MessagesActions.getMessagesGroupsRequest(...args)),
        clearMessageGroups: (...args) => dispatch(MessagesActions.clearMessageGroups(...args)),
        getMessagesPersonelRequest: (...args) => dispatch(MessagesActions.getMessagesPersonelRequest(...args))
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        main: state.main
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesAll)

const style = StyleSheet.create({
    grupMessageText: {
        marginTop: 10,
        marginBottom: 10,
        flex: 1
    },
    flatList: { marginBottom: 10 }
})