import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import PageEmpty from '../../../components/courses/PageEmpty'
import { strings } from '../../../locales/i18n';
import { connect } from 'react-redux'
import MessagesActions from '../../../redux/MessagesRedux';

import MessageListItem from '../../../components/messages/MessageListItem';
import Colors from '../../../theme/Colors';

class MessagesGroup extends React.Component {

    state = {
        refreshing: false,
        groupMessages: this.props.messages.messagesOnlyGroups
    }
    componentDidMount() {
        this.messageGroupApiCall()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.messages.messagesOnlyGroups !== this.props.messages.messagesOnlyGroups) {
            this.setState({ refreshing: false })
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.messages.messagesOnlyGroups != state.messagesOnlyGroups) {
            return {
                groupMessages: props.messages.messagesOnlyGroups
            }
        }

        return null
    }

    messageGroupApiCall(loader = true) {
        const requestBody = {
            remote: true,
            accessToken: this.props.main.authData.access_token,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            take: 1000, //TODO: sonra 5 e cevrilecek
            skip: 0,
            isGroup: true,
            type: 2,
            loader
        }
        this.props.getMessagesGroups(requestBody);
    }

    _renderContent() {
        if (this.state.groupMessages.length === 0) {
            return (
                <PageEmpty text={this.props.main.languageResource.r_messages_empty_group || strings('r_messages_empty_group')} />
            )
        } else {
            return (
                <FlatList
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this.setState({ refreshing: true })
                        this.messageGroupApiCall(false)
                    }} />}
                    contentContainerStyle={{ flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.groupMessages}
                    renderItem={({ item, index }) => (
                        <MessageListItem currentUserId={this.props.main.userIdentity.userId} key={index} data={item} navigation={this.props.navigation} refresh={() => this.messageGroupApiCall(false)} />
                    )} />
            )
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.background, padding: 5 }}>
                {this._renderContent()}
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getMessagesGroups: (...args) => dispatch(MessagesActions.getMessagesGroupsRequest(...args)),
        clearMessageGroups: (...args) => dispatch(MessagesActions.clearMessageGroups(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        main: state.main
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesGroup)