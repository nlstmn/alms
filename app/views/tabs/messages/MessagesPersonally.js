import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import PageEmpty from '../../../components/courses/PageEmpty'
import { strings } from '../../../locales/i18n';
import { connect } from 'react-redux'
import MessagesActions from '../../../redux/MessagesRedux';
import MessageListItemPersonally from '../../../components/messages/MessageListItemPersonally';
import Colors from '../../../theme/Colors';

class MessagesPersonally extends React.Component {

    state = {
        refreshing: false,
        personelMessages: this.props.messages.messagesOnlyPersonel
    }

    componentDidMount() {
        this.messagePersonelApiCall()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.messages.messagesOnlyPersonel !== this.props.messages.messagesOnlyPersonel) {
            this.setState({ refreshing: false })
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.messages.messagesOnlyPersonel !== state.personelMessages) {
            return {
                personelMessages: props.messages.messagesOnlyPersonel
            }
        }
        return null
    }

    messagePersonelApiCall(loader = true) {
        const requestBody = {
            accessToken: this.props.main.authData.access_token,
            almsPlusApiUrl: this.props.main.selectedOrganization.almsPlusApiUrl,
            take: 1000, //TODO: sonra 5 e cevrilecek
            skip: 0,
            isGroup: false,
            type: 2,
            loader
        }
        this.props.getMessagesPersonelRequest(requestBody);
    }



    _renderContent() {
        if (this.state.personelMessages.length === 0) {
            return (
                <PageEmpty text={this.props.main.languageResource.r_messages_empty_personally || strings('r_messages_empty_personally')} />
            )
        } else {
            return (
                <FlatList
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this.setState({ refreshing: true })
                        this.messagePersonelApiCall(false)
                    }} />}
                    contentContainerStyle={{ flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.personelMessages}
                    renderItem={({ item, index }) => (
                        <MessageListItemPersonally currentUserId={this.props.main.userIdentity.userId} key={index} data={item} navigation={this.props.navigation} refresh={() => this.messagePersonelApiCall(false)} />
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
        getMessagesPersonelRequest: (...args) => dispatch(MessagesActions.getMessagesPersonelRequest(...args)),
        clearMessageGroups: (...args) => dispatch(MessagesActions.clearMessageGroups(...args)),
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        main: state.main
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagesPersonally)