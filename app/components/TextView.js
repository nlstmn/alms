import React from 'react';
import { Text, StyleSheet } from 'react-native';
import AppTheme from '../theme/AppTheme';
export default class TextView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.weight === 'bold') {
            return (
                <Text  {...this.props} style={[styles.boldStyle, this.props.style]}>
                    {this.props.children}
                </Text>
            );
        } else if (this.props.weight === 'light') {
            return (
                <Text {...this.props} style={[styles.lightStyle, this.props.style]}>
                    {this.props.children}
                </Text>
            );
        } else if (this.props.weight === 'medium') {
            return (
                <Text {...this.props} style={[styles.mediumStyle, this.props.style]}>
                    {this.props.children}
                </Text>
            );
        } else {
            return (
                <Text {...this.props} style={[styles.regularStyle, this.props.style]}>
                    {this.props.children}
                </Text>
            );
        }


    }
}
const styles = StyleSheet.create({
    boldStyle: {
        fontFamily:AppTheme.fonts.bold
    },
    lightStyle: {
        fontFamily: AppTheme.fonts.light
    },
    mediumStyle: {
        fontFamily: AppTheme.fonts.medium
    },
    regularStyle: {
        fontFamily: AppTheme.fonts.regular
    }
});