import React, {Component} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';

import {appContext} from '../context/context';
import {CheckBox} from './checkBox';

export class CheckBoxSetting extends Component {
    render() {
        return (
            <View style={this.context.style.settingsStyle.setting}>
                <Text
                    style={
                        this.props.textStyle
                            ? this.props.textStyle
                            : this.context.style.settingsStyle.text
                    }>
                    {this.props.text}
                </Text>
                <CheckBox
                    onPress={this.props.onPress}
                    value={this.props.value}
                    styleChecked={
                        this.props.styleChecked
                            ? this.props.styleChecked
                            : this.context.style.settingsStyle.checkBoxChecked
                    }
                    styleUnchecked={
                        this.props.styleUnchecked
                            ? this.props.styleUnchecked
                            : this.context.style.settingsStyle.checkBoxUnchecked
                    }
                    ripple={this.context.style.rippleStyle.icon}
                />
            </View>
        );
    }
}
CheckBoxSetting.contextType = appContext;

export class InfoText extends Component {
    render() {
        return (
            <View style={this.context.style.settingsStyle.setting}>
                <Text style={this.context.style.settingsStyle.text}>
                    {this.props.text}
                </Text>
                <Text style={this.context.style.settingsStyle.text}>
                    {this.props.value}
                </Text>
            </View>
        );
    }
}
InfoText.contextType = appContext;

export class TextInputSetting extends Component {
    render() {
        return (
            <View style={this.context.style.settingsStyle.setting}>
                <Text style={this.context.style.settingsStyle.text}>
                    {this.props.text}
                </Text>
                <TextInput
                    keyboardType={this.props.keyboardType}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    style={this.context.style.settingsStyle.textInput}
                />
            </View>
        );
    }
}
TextInputSetting.contextType = appContext;

export class ButtonSetting extends Component {
    render() {
        return (
            <View style={this.context.style.settingsStyle.setting}>
                <Pressable
                    onPress={this.props.onPress}
                    android_ripple={this.context.style.rippleStyle.button}
                    style={this.context.style.settingsStyle.pressable}>
                    <Text style={this.context.style.settingsStyle.text}>
                        {this.props.text}
                    </Text>
                </Pressable>
            </View>
        );
    }
}
ButtonSetting.contextType = appContext;
