import React, {Component} from 'react';
import {
    Text,
    FlatList,
    View,
    Pressable,
    Alert,
    ToastAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

import {pickAndRead, writeFile} from '../fileAccess/fileAccess';
import {appContext} from '../context/context';
import {Header} from './header';
import {PressableIcon} from './pressableIcon';
import {ListItem} from './listItem';
import {OptionModal, TextInputModal} from './modals';

export class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionModal: false,
            optionModalHeadline: '',
            optionModalOptions: [],
            nameModal: false,
            nameModalHeadline: '',
            nameModalSubmitText: '',
            nameModalSubmit: () => {},
            selectedIdPath: [],
            newName: '',
        };
    }

    render() {
        const list = this.context.list.getItem(this.props.route.params.idPath);

        const addOptions = [
            {
                text: 'Item',
                onPress: () =>
                    this.setState({
                        optionModal: false,
                        nameModal: true,
                        nameModalHeadline: 'Item name',
                        nameModalSubmitText: 'Add',
                        nameModalSubmit: () =>
                            this.context.addItem(
                                this.props.route.params.idPath,
                                'item',
                                this.state.newName,
                            ),
                    }),
            },
            {
                text: 'List',
                onPress: () =>
                    this.setState({
                        optionModal: false,
                        nameModal: true,
                        nameModalHeadline: 'List name',
                        nameModalSubmitText: 'Add',
                        nameModalSubmit: () =>
                            this.context.addItem(
                                this.props.route.params.idPath,
                                'list',
                                this.state.newName,
                            ),
                    }),
            },
            {
                text: 'From JSON file',
                onPress: async () => {
                    this.setState({
                        optionModal: false,
                    });

                    // Pick a single file
                    try {
                        let content = await pickAndRead(['application/json']);

                        if (content) {
                            try {
                                let contentJson = JSON.parse(content);

                                if (
                                    this.context.list.validateJson(contentJson)
                                ) {
                                    this.context.addFromJson(
                                        contentJson,
                                        this.props.route.params.idPath,
                                    );
                                } else {
                                    Alert.alert(
                                        'JSON validation error',
                                        res.name +
                                            " doesn't have the necessary data fields to form lists from.",
                                    );
                                }
                            } catch (error) {
                                Alert.alert(
                                    'JSON parse error',
                                    res.name +
                                        " doesn't include valid JSON data." +
                                        error,
                                );
                            }
                        }
                    } catch (error) {
                        if (DocumentPicker.isCancel(error)) {
                            // User cancelled the picker
                        } else {
                            Alert.alert('Error', error.toString());
                        }
                    }
                },
            },
            {
                text: 'From TXT file',
                onPress: async () => {
                    this.setState({
                        optionModal: false,
                    });

                    // Pick a single file
                    try {
                        let content = await pickAndRead(['text/plain']);

                        if (content) {
                            let contentList = content.split(/\r?\n/);

                            for (let line of contentList) {
                                this.context.addItem(
                                    this.props.route.params.idPath,
                                    'item',
                                    line,
                                );
                            }
                        }
                    } catch (error) {
                        if (DocumentPicker.isCancel(error)) {
                            // User cancelled the picker
                        } else {
                            Alert.alert('Error', error.toString());
                        }
                    }
                },
            },
        ];

        const editOptions = [
            {
                text: 'Rename',
                onPress: () => {
                    this.setState({
                        optionModal: false,
                        nameModal: true,
                        nameModalHeadline: 'New name',
                        nameModalSubmitText: 'Rename',
                        nameModalSubmit: () =>
                            this.context.renameItem(
                                this.state.newName,
                                this.state.selectedIdPath,
                            ),
                        newName: this.context.list.getItem(
                            this.state.selectedIdPath,
                        ).name,
                    });
                },
            },
            {
                text: 'Delete',
                onPress: () => {
                    this.context.deleteItem(this.state.selectedIdPath);
                    this.setState({
                        optionModal: false,
                        selectedIdPath: [],
                    });
                },
            },
            {
                text: 'Export as JSON',
                onPress: () =>
                    this.setState({
                        optionModal: false,
                        nameModal: true,
                        nameModalHeadline: 'JSON name',
                        nameModalSubmitText: 'Export',
                        nameModalSubmit: () => {
                            writeFile(
                                this.state.newName + '.json',
                                RNFS.DownloadDirectoryPath,
                                JSON.stringify(
                                    list.exportJson({
                                        space: 2,
                                        ids: [
                                            this.context.list.getItem(
                                                this.state.selectedIdPath,
                                            ).id,
                                        ],
                                    }).items,
                                ),
                                'File saved to Downloads folder',
                            );
                        },
                        newName: this.context.list.getItem(
                            this.state.selectedIdPath,
                        ).name,
                    }),
            },
        ];

        const additionalComponents = [
            <PressableIcon
                key={'add'}
                onPress={() =>
                    this.setState({
                        optionModal: true,
                        optionModalHeadline: 'Add',
                        optionModalOptions: addOptions,
                    })
                }
                icon={'add'}
                style={this.context.style.headerStyle.icon}
                ripple={this.context.style.rippleStyle.icon}
            />,
            <PressableIcon
                key={'settings'}
                onPress={() => {
                    this.props.navigation.navigate('listSettings', {
                        idPath: this.props.route.params.idPath,
                    });
                }}
                icon={'settings'}
                style={this.context.style.headerStyle.icon}
                ripple={this.context.style.rippleStyle.icon}
            />,
        ];

        renderListEntry = ({item}) => (
            <ListItem
                onPress={() => {
                    if (item.hasOwnProperty('items')) {
                        this.props.navigation.push('list', {
                            idPath: this.props.route.params.idPath.concat([
                                item.id,
                            ]),
                        });
                    }
                }}
                onLongPress={() =>
                    this.setState({
                        optionModal: true,
                        optionModalHeadline: 'Edit',
                        optionModalOptions: editOptions,
                        selectedIdPath: this.props.route.params.idPath.concat([
                            item.id,
                        ]),
                    })
                }
                text={item.name}
                activate={() => {
                    this.context.setListProperty(
                        'active',
                        !item.active,
                        this.props.route.params.idPath.concat([item.id]),
                    );
                }}
                active={item.active}
                weight={item.weight}
                onChangeText={(text) => {
                    this.context.setListProperty(
                        'weight',
                        parseFloat(text) ? parseFloat(text) : 0,
                        this.props.route.params.idPath.concat([item.id]),
                    );
                }}
                style={this.context.style.listItemStyle}
                icon={item.hasOwnProperty('items') ? 'list' : ''}
                ripple={this.context.style.rippleStyle}
            />
        );

        return (
            <View style={this.context.style.listViewStyle.upperLevelView}>
                <OptionModal
                    visible={this.state.optionModal}
                    onRequestClose={() =>
                        this.setState({
                            optionModal: false,
                            optionModalHeadline: '',
                            optionModalOptions: [],
                            selectedIdPath: [],
                            newName: '',
                        })
                    }
                    headline={this.state.optionModalHeadline}
                    options={this.state.optionModalOptions}
                />
                <TextInputModal
                    visible={this.state.nameModal}
                    onRequestClose={() =>
                        this.setState({
                            nameModal: false,
                            nameModalHeadline: '',
                            nameModalSubmitText: '',
                            nameModalSubmit: () => {},
                            selectedIdPath: [],
                            newName: '',
                        })
                    }
                    headline={this.state.nameModalHeadline}
                    onChangeText={(text) => this.setState({newName: text})}
                    textInputValue={this.state.newName}
                    selectTextOnFocus={true}
                    submitText={this.state.nameModalSubmitText}
                    onSubmit={() => {
                        this.state.nameModalSubmit();
                        this.setState({
                            nameModal: false,
                            newName: '',
                            nameModalHeadline: '',
                            nameModalSubmitText: '',
                            nameModalSubmit: () => {},
                            selectedIdPath: [],
                            newName: '',
                        });
                    }}
                />
                <Header
                    showBackButton={this.props.route.params.idPath.length}
                    navigation={this.props.navigation}
                    text={list.name}
                    additionalComponents={additionalComponents}
                />
                <FlatList
                    data={list.items}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={renderListEntry}
                    getItemLayout={(data, index) => ({
                        length: this.context.style.listItemStyle.text.height,
                        offset:
                            this.context.style.listItemStyle.text.height *
                            index,
                        index,
                    })}
                />
                <View
                    style={
                        this.context.style.listViewStyle.randomizeButtonView
                    }>
                    <Pressable
                        onPress={() => {
                            let randomItems = list.pickRandomItems();

                            // Copy items for archival purposes
                            // Can show old results even if lists are edited/removed
                            let copyItems = randomItems.map((i) => {
                                let tempItem = {};
                                for (let prop in i) {
                                    tempItem[prop] = i[prop];
                                }
                                const parentIds = tempItem.idPath.slice(
                                    this.props.route.params.idPath.length + 1,
                                );
                                tempItem.parentNames = parentIds.map(
                                    (id, index) => {
                                        return list.getItem(
                                            parentIds.slice(0, index + 1),
                                        ).name;
                                    },
                                );
                                return tempItem;
                            });

                            let result = {
                                name: list.name,
                                idPath: this.props.route.params.idPath,
                                items: copyItems,
                                date: new Date().toISOString(),
                            };

                            this.props.navigation.navigate('randomResult', {
                                result: result,
                            });
                            this.context.saveToHistory(result);
                            if (list.deactivateAfterRandomization) {
                                this.context.deactivateItems(
                                    randomItems.map((item) =>
                                        item.idPath.slice(1).concat([item.id]),
                                    ),
                                );
                            }
                        }}
                        android_ripple={this.context.style.rippleStyle.button}>
                        <Text
                            style={
                                this.context.style.listViewStyle.randomizeButton
                            }>
                            RANDOMIZE
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }
}
ListView.contextType = appContext;
