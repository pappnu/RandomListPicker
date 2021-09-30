import React, {Component} from 'react';
import {View, FlatList} from 'react-native';

import {appContext} from '../context/context';
import {Header} from './header';
import {CheckBoxSetting} from './settingInputs';

export class AppSettings extends Component {
    renderSetting = ({item}) => item;

    render() {
        const flatListItems = [
            <CheckBoxSetting
                text={'Prevent sleep on result screen'}
                onPress={() =>
                    this.context.setSetting(
                        'preventSleep',
                        !this.context.settings.preventSleep,
                    )
                }
                value={this.context.settings.preventSleep}
                styleChecked={this.context.style.settingsStyle.checkBoxChecked}
                styleUnchecked={
                    this.context.style.settingsStyle.checkBoxUnchecked
                }
            />,
        ];

        return (
            <View style={this.context.style.settingsStyle.upperLevelView}>
                <Header
                    showBackButton={true}
                    navigation={this.props.navigation}
                    text="App settings"
                />
                <FlatList
                    data={flatListItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderSetting}
                    getItemLayout={(data, index) => ({
                        length: this.context.style.settingsStyle.text.height,
                        offset:
                            this.context.style.settingsStyle.text.height *
                            index,
                        index,
                    })}
                />
            </View>
        );
    }
}
AppSettings.contextType = appContext;
