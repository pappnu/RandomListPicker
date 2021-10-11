import React, {Component} from 'react';
import {Text, FlatList, View, Pressable, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

import {pickAndRead, writeFile} from '../fileAccess/fileAccess';
import {appContext} from '../context/context';
import {Header} from '../components/header';
import {PressableIcon} from '../components/pressableIcon';
import {ListItem} from '../components/listItem';

export class ListView extends Component {
    render() {
        const {navigation, route} = this.props;
        const list = this.context.list.getItem(route.params.idPath);

        const addOptions = [
            {
                text: 'Item',
                onPress: () =>
                    navigation.replace('textInputModal', {
                        headline: 'Item name',
                        submitText: 'Add',
                        onSubmit: text => {
                            this.context.addItem(
                                route.params.idPath,
                                'item',
                                text,
                            );
                            navigation.goBack();
                        },
                        initialTextInputValue: '',
                        selectTextOnFocus: true,
                    }),
            },
            {
                text: 'List',
                onPress: () =>
                    navigation.replace('textInputModal', {
                        headline: 'List name',
                        submitText: 'Add',
                        onSubmit: text => {
                            this.context.addItem(
                                route.params.idPath,
                                'list',
                                text,
                            );
                            navigation.goBack();
                        },
                        initialTextInputValue: '',
                        selectTextOnFocus: true,
                    }),
            },
            {
                text: 'From JSON file',
                onPress: async () => {
                    navigation.goBack();

                    // Pick a single file
                    try {
                        const content = await pickAndRead(['application/json']);

                        if (content) {
                            try {
                                const contentJson = JSON.parse(content);

                                if (
                                    this.context.list.validateJson(contentJson)
                                ) {
                                    this.context.addFromJson(
                                        contentJson,
                                        route.params.idPath,
                                    );
                                } else {
                                    Alert.alert(
                                        'JSON validation error',
                                        "File doesn't have the necessary data fields to form lists from.",
                                    );
                                }
                            } catch (error) {
                                Alert.alert(
                                    'JSON parse error',
                                    "File doesn't include valid JSON data." +
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
                    navigation.goBack();

                    // Pick a single file
                    try {
                        const content = await pickAndRead(['text/plain']);

                        if (content) {
                            const contentList = content.split(/\r?\n/);

                            for (const line of contentList) {
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

        const editOptions = idPath => [
            {
                text: 'Rename',
                onPress: () => {
                    navigation.replace('textInputModal', {
                        headline: 'New name',
                        submitText: 'Rename',
                        onSubmit: text => {
                            this.context.renameItem(text, idPath);
                            navigation.goBack();
                        },
                        initialTextInputValue:
                            this.context.list.getItem(idPath).name,
                        selectTextOnFocus: true,
                    });
                },
            },
            {
                text: 'Delete',
                onPress: () => {
                    this.context.deleteItem(idPath);
                    navigation.goBack();
                },
            },
            {
                text: 'Export as JSON',
                onPress: () => {
                    navigation.replace('textInputModal', {
                        headline: 'JSON name',
                        submitText: 'Export',
                        onSubmit: text => {
                            writeFile(
                                text + '.json',
                                RNFS.DownloadDirectoryPath,
                                JSON.stringify(
                                    list.exportJson({
                                        space: 2,
                                        ids: [
                                            this.context.list.getItem(idPath)
                                                .id,
                                        ],
                                    }).items,
                                ),
                                'File saved to Downloads folder',
                            );
                            navigation.goBack();
                        },
                        initialTextInputValue:
                            this.context.list.getItem(idPath).name,
                        selectTextOnFocus: true,
                    });
                },
            },
        ];

        const additionalComponents = [
            <PressableIcon
                key={'add'}
                onPress={() => {
                    navigation.navigate('optionModal', {
                        headline: 'Add',
                        options: addOptions,
                    });
                }}
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

        const renderListEntry = ({item}) => (
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
                onLongPress={() => {
                    navigation.navigate('optionModal', {
                        headline: 'Edit',
                        options: editOptions(
                            route.params.idPath.concat([item.id]),
                        ),
                    });
                }}
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
                onChangeText={text => {
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
                            let copyItems = randomItems.map(i => {
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
                                    randomItems.map(item =>
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
