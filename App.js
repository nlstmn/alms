
import React, { Component } from 'react';
import { createRootNavigator } from './app/navigation/Router'
import { createTabletRootNavigator } from './app/navigation/RouterTablet';
import { ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info'
//store
import { Provider } from 'react-redux';
import { reduxStore, persistor } from './app/redux';
import { PersistGate } from 'redux-persist/integration/react'

import { View } from "react-native";
import Colors from './app/theme/Colors';
import FlashMessage from "react-native-flash-message";
import AppTheme from './app/theme/AppTheme';


// const store = createStore();

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: "false",
      isLoading: true,
      language: '',
    }
  }

  componentWillMount() {
    //await this._bootstrapAsync();
  }
  async componentDidMount() {
    await this._bootstrapAsync();

  }

  componentDidUpdate() {

  }

  _bootstrapAsync = async () => {
    var _isLogin = await AsyncStorage.getItem('isLogin');
    if (_isLogin === null) {
      _isLogin = "false"
    }
    await this.setState({ isLogin: _isLogin, isLoading: false })
  }


  _renderRouter() {
    if (this.state.isLoading) {
      // return <ActivityIndicator style={style.activityIndicator} size="large" color={Colors.activityIndicator} />
      return null
    } else {
      if (DeviceInfo.isTablet()) {
        const TabletRouter = createTabletRootNavigator(this.state.isLogin);
        return (<TabletRouter />)
      } else {
        const PhoneRouter = createRootNavigator(this.state.isLogin);
        return (<PhoneRouter />)
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Provider store={reduxStore}>
          <PersistGate loading={null} persistor={persistor}>
            {this._renderRouter()}
          </PersistGate>
        </Provider>
        <FlashMessage
          position="top"
          duration={3000}
          textStyle={{ fontFamily: AppTheme.fonts.medium, fontSize: 16 }}
          titleStyle={{ fontFamily: AppTheme.fonts.bold, fontSize: 18 }} />
      </View>
    )
  }
}

const style = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    alignItems: 'center'
  }
})
