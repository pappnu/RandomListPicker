import React, {Component} from 'react';
import {View, Text, Modal, Pressable, TextInput, FlatList} from 'react-native';

import {appContext} from '../context/context';

export class OptionModal extends Component {
    renderOption = ({item}) => (
        <Pressable
            onPress={item.onPress}
            android_ripple={this.context.style.rippleStyle.button}>
            <Text style={this.context.style.modalStyle.option}>
                {item.text}
            </Text>
        </Pressable>
    );

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.props.visible}
                onRequestClose={this.props.onRequestClose}>
                <View style={this.context.style.modalStyle.upperLevelView}>
                    <View style={this.context.style.modalStyle.modalBox}>
                        <Text style={this.context.style.modalStyle.headline}>
                            {this.props.headline}
                        </Text>
                        <FlatList
                            style={this.context.style.modalStyle.optionList}
                            data={this.props.options}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderOption}
                            getItemLayout={(data, index) => ({
                                length: this.context.style.modalStyle.option
                                    .height,
                                offset:
                                    this.context.style.modalStyle.option
                                        .height * index,
                                index,
                            })}
                        />
                        <View style={this.context.style.modalStyle.horizontal}>
                            <Pressable
                                onPress={this.props.onRequestClose}
                                android_ripple={
                                    this.context.style.rippleStyle.button
                                }>
                                <Text
                                    style={
                                        this.context.style.modalStyle.cancel
                                    }>
                                    Cancel
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
OptionModal.contextType = appContext;

export class TextInputModal extends Component {
    render() {
        return (
            <Modal
                transparent={true}
                visible={this.props.visible}
                onRequestClose={this.props.onRequestClose}>
                <View style={this.context.style.modalStyle.upperLevelView}>
                    <View style={this.context.style.modalStyle.modalBox}>
                        <Text style={this.context.style.modalStyle.headline}>
                            {this.props.headline}
                        </Text>
                        <TextInput
                            onChangeText={text => this.props.onChangeText(text)}
                            value={this.props.textInputValue}
                            autoFocus={true}
                            selectTextOnFocus={this.props.selectTextOnFocus}
                            style={this.context.style.modalStyle.textInput}
                        />
                        <View style={this.context.style.modalStyle.horizontal}>
                            <Pressable
                                onPress={this.props.onRequestClose}
                                android_ripple={
                                    this.context.style.rippleStyle.button
                                }>
                                <Text
                                    style={
                                        this.context.style.modalStyle.cancel
                                    }>
                                    Cancel
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={this.props.onSubmit}
                                android_ripple={
                                    this.context.style.rippleStyle.button
                                }>
                                <Text
                                    style={
                                        this.context.style.modalStyle.cancel
                                    }>
                                    {this.props.submitText}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
TextInputModal.contextType = appContext;
