import React, {Component} from 'react';
import {Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export class PressableIcon extends Component {
    render() {
        return (
            <Pressable
                onPress={this.props.onPress}
                android_ripple={this.props.ripple}>
                <Icon name={this.props.icon} style={this.props.style} />
            </Pressable>
        );
    }
}
