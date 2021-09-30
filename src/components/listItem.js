import React, {Component} from 'react';
import {Pressable, Text, View, TextInput, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CheckBox} from './checkBox';

export class ListItem extends Component {
    render() {
        return (
            <View style={this.props.style.upperLevelView}>
                <Pressable
                    onPress={this.props.onPress}
                    onLongPress={this.props.onLongPress}
                    style={this.props.style.pressable}
                    android_ripple={this.props.ripple.button}>
                    {this.props.icon ? (
                        <Icon
                            name={this.props.icon}
                            style={this.props.style.icon}
                        />
                    ) : null}
                    <ScrollView horizontal={true}>
                        <Text style={this.props.style.text}>
                            {this.props.text}
                        </Text>
                    </ScrollView>
                </Pressable>
                <TextInput
                    keyboardType="number-pad"
                    onChangeText={text => this.props.onChangeText(text)}
                    value={
                        this.props.weight ? this.props.weight.toString() : '0'
                    }
                    style={this.props.style.textInput}
                />
                <CheckBox
                    onPress={this.props.activate}
                    value={this.props.active}
                    styleChecked={this.props.style.checkBoxChecked}
                    styleUnchecked={this.props.style.checkBoxUnchecked}
                    ripple={this.props.ripple.icon}
                />
            </View>
        );
    }
}
