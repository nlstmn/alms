import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import PageEmpty from '../../../components/courses/PageEmpty';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import { strings } from '../../../locales/i18n';
import { connect } from 'react-redux';

class ProfileMain extends React.Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        return {
            title: params.languageResource !== undefined ? params.languageResource.r_menu_profile || strings('r_menu_profile') : strings('r_menu_profile'),

            headerTitleStyle: {
                alignSelf: 'center'
            },
            headerLeft: (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons style={{ paddingLeft: 20, paddingRight: 20, }} name="ios-arrow-back" size={25} onPress={() => {
                        const backActions = NavigationActions.back({
                            key: null
                        });
                        navigation.dispatch(backActions)
                    }} />
                </View>
            ),
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            languageResource: this.props.main.languageResource
        })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <PageEmpty text={""} />
                </View>
            </SafeAreaView>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {}
}

const mapStateToProps = (state) => {
    return {
        main: state.main
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMain)