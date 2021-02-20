import React, {Component} from 'react';
import {ScrollView, View, Text} from 'react-native';

import {appContext} from '../context/context';
import {PressableIcon} from './pressableIcon';

export class Header extends Component {
    render() {
        return (
            <View style={this.context.style.headerStyle.upperLevelView}>
                {this.props.showBackButton ? (
                    <PressableIcon
                        onPress={() => this.props.navigation.goBack()}
                        icon={'arrow-back'}
                        style={this.context.style.headerStyle.backArrow}
                        ripple={this.context.style.rippleStyle.icon}
                    />
                ) : null}
                <ScrollView horizontal={true}>
                    <Text style={this.context.style.headerStyle.headline}>
                        {this.props.text}
                    </Text>
                </ScrollView>
                {this.props.additionalComponents}
            </View>
        );
    }
}
Header.contextType = appContext;
