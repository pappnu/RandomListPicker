import React, {Component} from 'react';
import {Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export class CheckBox extends Component {
    render() {
        return (
            <Pressable
                onPress={this.props.onPress}
                android_ripple={this.props.ripple}
                disabled={this.props.disabled}>
                <Icon
                    name={
                        this.props.value
                            ? 'check-box'
                            : 'check-box-outline-blank'
                    }
                    style={
                        this.props.value
                            ? this.props.styleChecked
                            : this.props.styleUnchecked
                    }
                />
            </Pressable>
        );
    }
}
CheckBox.defaultProps = {disabled: false};
