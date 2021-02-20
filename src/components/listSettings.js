import React, {Component} from 'react';
import {View, ToastAndroid, FlatList} from 'react-native';
import RNFS from 'react-native-fs';

import {appContext} from '../context/context';
import {Header} from './header';
import {TextInputModal} from './modals';
import {
    CheckBoxSetting,
    InfoText,
    TextInputSetting,
    ButtonSetting,
} from './settingInputs';
import {writeFile} from '../fileAccess/fileAccess';

export class ListSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameModal: false,
            newName: '',
        };
    }

    renderSetting = ({item}) => item;

    render() {
        const list = this.context.list.getItem(this.props.route.params.idPath);

        let infoFields = [
            {
                text: 'List name',
                value: list.name,
            },
            {
                text: '# of items and lists',
                value: list.items.length,
            },
            {
                text: '# of active items and lists',
                value: list.countItems(true, false),
            },
            {
                text: '# of items recursively',
                value: list.countItems(false, true),
            },
            {
                text: '# of active items recursively',
                value: list.countItems(true, true),
            },
            {
                text: 'Total weight',
                value: list.countWeight(),
            },
            {
                text: 'Total item weight recursively',
                value: list.countWeight(true),
            },
        ];

        let textInputFields = [
            {
                text: '# of items to pick',
                keyboardType: 'number-pad',
                onChangeText: (text) =>
                    this.context.setListProperty(
                        'numToPick',
                        parseInt(text) ? parseInt(text) : 0,
                        this.props.route.params.idPath,
                    ),
                value: list.numToPick ? list.numToPick.toString() : '0',
            },
        ];

        let checkBoxFields = [
            {
                text: '# is recursive limit',
                textStyle: undefined,
                onPress: () =>
                    this.context.setListProperty(
                        'numToPickRecursive',
                        !list.numToPickRecursive,
                        this.props.route.params.idPath,
                    ),
                value: list.numToPickRecursive,
                styleChecked: undefined,
                styleUnchecked: undefined,
            },
            {
                text: 'Pick unique names',
                textStyle: undefined,
                onPress: () =>
                    this.context.setListProperty(
                        'pickUnique',
                        !list.pickUnique,
                        this.props.route.params.idPath,
                    ),
                value: list.pickUnique,
                styleChecked: undefined,
                styleUnchecked: undefined,
            },
            {
                text: 'Pick unique recursively',
                textStyle: list.pickUnique
                    ? this.context.style.settingsStyle.text
                    : this.context.style.settingsStyle.unactiveText,
                onPress: () =>
                    this.context.setListProperty(
                        'pickUniqueRecursive',
                        !list.pickUniqueRecursive,
                        this.props.route.params.idPath,
                    ),
                value: list.pickUniqueRecursive,
                styleChecked: list.pickUnique
                    ? this.context.style.settingsStyle.checkBoxChecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
                styleUnchecked: list.pickUnique
                    ? this.context.style.settingsStyle.checkBoxUnchecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
            },
            {
                text: 'Combine sublists',
                textStyle: undefined,
                onPress: () =>
                    this.context.setListProperty(
                        'combineLists',
                        !list.combineLists,
                        this.props.route.params.idPath,
                    ),
                value: list.combineLists,
                styleChecked: undefined,
                styleUnchecked: undefined,
            },
            {
                text: 'Combine sublists recursively',
                textStyle: list.combineLists
                    ? this.context.style.settingsStyle.text
                    : this.context.style.settingsStyle.unactiveText,
                onPress: () =>
                    this.context.setListProperty(
                        'combineListsRecursive',
                        !list.combineListsRecursive,
                        this.props.route.params.idPath,
                    ),
                value: list.combineListsRecursive,
                styleChecked: list.combineLists
                    ? this.context.style.settingsStyle.checkBoxChecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
                styleUnchecked: list.combineLists
                    ? this.context.style.settingsStyle.checkBoxUnchecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
            },
            {
                text: 'Ignore empty lists',
                textStyle: undefined,
                onPress: () =>
                    this.context.setListProperty(
                        'ignoreEmptyLists',
                        !list.ignoreEmptyLists,
                        this.props.route.params.idPath,
                    ),
                value: list.ignoreEmptyLists,
                styleChecked: undefined,
                styleUnchecked: undefined,
            },
            {
                text: 'Ignore empty lists recursively',
                textStyle: list.ignoreEmptyLists
                    ? this.context.style.settingsStyle.text
                    : this.context.style.settingsStyle.unactiveText,
                onPress: () =>
                    this.context.setListProperty(
                        'ignoreEmptyListsRecursive',
                        !list.ignoreEmptyListsRecursive,
                        this.props.route.params.idPath,
                    ),
                value: list.ignoreEmptyListsRecursive,
                styleChecked: list.ignoreEmptyLists
                    ? this.context.style.settingsStyle.checkBoxChecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
                styleUnchecked: list.ignoreEmptyLists
                    ? this.context.style.settingsStyle.checkBoxUnchecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
            },
            {
                text: 'Ignore weights',
                textStyle: undefined,
                onPress: () =>
                    this.context.setListProperty(
                        'ignoreWeights',
                        !list.ignoreWeights,
                        this.props.route.params.idPath,
                    ),
                value: list.ignoreWeights,
                styleChecked: undefined,
                styleUnchecked: undefined,
            },
            {
                text: 'Ignore weights recursively',
                textStyle: list.ignoreWeights
                    ? this.context.style.settingsStyle.text
                    : this.context.style.settingsStyle.unactiveText,
                onPress: () =>
                    this.context.setListProperty(
                        'ignoreWeightsRecursive',
                        !list.ignoreWeightsRecursive,
                        this.props.route.params.idPath,
                    ),
                value: list.ignoreWeightsRecursive,
                styleChecked: list.ignoreWeights
                    ? this.context.style.settingsStyle.checkBoxChecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
                styleUnchecked: list.ignoreWeights
                    ? this.context.style.settingsStyle.checkBoxUnchecked
                    : this.context.style.settingsStyle.checkBoxUnactive,
            },
            {
                text: 'Deactivate picked items',
                textStyle: undefined,
                onPress: () =>
                    this.context.setListProperty(
                        'deactivateAfterRandomization',
                        !list.deactivateAfterRandomization,
                        this.props.route.params.idPath,
                    ),
                value: list.deactivateAfterRandomization,
                styleChecked: undefined,
                styleUnchecked: undefined,
            },
        ];

        let buttonFields = [
            {
                text: 'Activate all lists and items',
                onPress: () =>
                    this.context.setPropertyForItems(
                        this.props.route.params.idPath,
                        'active',
                        true,
                        false,
                    ),
            },
            {
                text: 'Activate all lists and items recursively',
                onPress: () =>
                    this.context.setPropertyForItems(
                        this.props.route.params.idPath,
                        'active',
                        true,
                        true,
                    ),
            },
            {
                text: 'Equalize weights',
                onPress: () =>
                    this.context.setPropertyForItems(
                        this.props.route.params.idPath,
                        'weight',
                        1,
                        false,
                    ),
            },
            {
                text: 'Equalize weights recursively',
                onPress: () =>
                    this.context.setPropertyForItems(
                        this.props.route.params.idPath,
                        'weight',
                        1,
                        true,
                    ),
            },
            {
                text: 'Export items and sublists as JSON',
                onPress: () =>
                    this.setState({nameModal: true, newName: list.name}),
            },
            {
                text: 'Randomization history',
                onPress: () => this.props.navigation.navigate('history'),
            },
            {
                text: 'App settings',
                onPress: () => this.props.navigation.navigate('appSettings'),
            },
        ];

        infoFields = infoFields.map((i) => (
            <InfoText text={i.text} value={i.value} />
        ));

        textInputFields = textInputFields.map((i) => (
            <TextInputSetting
                text={i.text}
                keyboardType={i.keyboardType}
                onChangeText={i.onChangeText}
                value={i.value}
            />
        ));

        checkBoxFields = checkBoxFields.map((i) => (
            <CheckBoxSetting
                text={i.text}
                textStyle={i.textStyle}
                onPress={i.onPress}
                value={i.value}
                styleChecked={i.styleChecked}
                styleUnchecked={i.styleUnchecked}
            />
        ));

        buttonFields = buttonFields.map((i) => (
            <ButtonSetting text={i.text} onPress={i.onPress} />
        ));

        let flatListItems = infoFields
            .concat(textInputFields)
            .concat(checkBoxFields)
            .concat(buttonFields);

        return (
            <View style={this.context.style.settingsStyle.upperLevelView}>
                <TextInputModal
                    visible={this.state.nameModal}
                    onRequestClose={() => this.setState({nameModal: false})}
                    headline={'File name'}
                    onChangeText={(text) => this.setState({newName: text})}
                    textInputValue={this.state.newName}
                    selectTextOnFocus={true}
                    submitText={'Export'}
                    onSubmit={() => {
                        writeFile(
                            this.state.newName + '.json',
                            RNFS.DownloadDirectoryPath,
                            JSON.stringify(list.exportJson({space: 2}).items),
                            'File saved to Downloads folder',
                        );
                        this.setState({
                            nameModal: false,
                            newName: '',
                        });
                    }}
                />
                <Header
                    showBackButton={true}
                    navigation={this.props.navigation}
                    text="List settings"
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
ListSettings.contextType = appContext;
