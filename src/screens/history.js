import React, {Component} from 'react';
import {FlatList, View} from 'react-native';

import {appContext} from '../context/context';
import {Header} from '../components/header';
import {ButtonSetting} from '../components/settingInputs';

export class History extends Component {
    renderHistoryEntry = ({item}) => (
        <ButtonSetting
            text={item.date.split('.').slice(0, 1).toString() + ' ' + item.name}
            onPress={() =>
                this.props.navigation.navigate('randomResult', {
                    result: item,
                })
            }
        />
    );

    render() {
        return (
            <View style={this.context.style.settingsStyle.upperLevelView}>
                <Header
                    showBackButton={true}
                    navigation={this.props.navigation}
                    text="Randomization history"
                />
                <FlatList
                    data={this.context.history.sort(
                        (a, b) => new Date(b.date) - new Date(a.date),
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderHistoryEntry}
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
History.contextType = appContext;
