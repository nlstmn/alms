import React from 'react';
import { View, Text } from 'react-native';
import TextView from '../TextView';
export default class OrganizationItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            organization: props.organization
        })
    }
    render() {
        return (
            <View style={{ padding: 10 }}>
                <TextView weight={"bold"} style={{color:"black",fontSize:15,padding:5}}>
                    {this.state.organization.name}
                </TextView>
            </View>
        );

    }

}