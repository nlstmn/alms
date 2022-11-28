import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import SignIn from '../../views/login/SignIn'
import LoginForgotPassword from '../../views/login/LoginForgotPassword';
import OrganizationSelection from '../../views/OrganizationSelection';

import { connect } from 'react-redux';
import MenuActions from '../../redux/MenuRedux';
import MainLoader from '../../components/MainLoader';

export const SignedOut = createStackNavigator({
    OrganizationSelection: {
        screen: OrganizationSelection,
        navigationOptions: {
            header: null,
        }
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            header: null,
        }
    },
    LoginForgotPassword: {
        screen: LoginForgotPassword,
        navigationOptions: {
            header: null
        }
    }
});

class AuthenticationRootContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        this.props.setMenu();
    }
    static router = SignedOut.router
    _renderRouting() {

        return <SignedOut navigation={this.props.navigation} />
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MainLoader />
                {this._renderRouting()}
            </View>

        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setMenu: (...args) => dispatch(MenuActions.setMenu(...args))
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.menu,
        main: state.main,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationRootContainer);