import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';

import IdleTimerManager from 'react-native-idle-timer';
import RNFS from 'react-native-fs';

import {appContext} from '../context/context';
import {PressableIcon} from '../components/pressableIcon';
import {Header} from '../components/header';
import {writeFile} from '../fileAccess/fileAccess';

export class RandomizationResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exportFunction: () => {},
        };
        [this.parentLists, this.shortestPathLength] =
            this.extractParentListNames([...props.route.params.result.items]);
    }

    componentDidMount() {
        if (this.context.settings.preventSleep) {
            IdleTimerManager.setIdleTimerDisabled(true);
        }
    }

    componentWillUnmount() {
        IdleTimerManager.setIdleTimerDisabled(false);
    }

    listItems(list) {
        return list.map((item, index) => {
            return {
                jsx: (
                    <Text style={this.context.style.resultStyle.item}>
                        {item.name}
                    </Text>
                ),
                key: index.toString(),
            };
        });
    }

    renderJsx = ({item}) => item.jsx;

    renderResultEntry = ({item}) => (
        <Text
            style={[
                this.context.style.resultStyle.item,
                {
                    paddingLeft:
                        this.context.style.resultStyle.item.paddingLeft +
                        (item.idPath.length - this.shortestPathLength) * 12,
                },
            ]}>
            {item.name}
        </Text>
    );

    extractParentListNames(list) {
        let lists = [];
        let shortestPathLength = Number.MAX_SAFE_INTEGER;
        for (let item of list) {
            const itemIdPath = item.idPath.toString();
            if (!lists.find(i => i.idPath === itemIdPath)) {
                lists.push({
                    name:
                        item.parentNames.length > 0
                            ? '/' + item.parentNames.join('/')
                            : '/',
                    idPath: itemIdPath,
                });
                if (item.idPath.length - 1 < shortestPathLength) {
                    shortestPathLength = item.idPath.length - 1;
                }
            }
        }
        return [lists, shortestPathLength];
    }

    listItemsByList(list, parentLists) {
        let result = [];
        for (let i of parentLists) {
            let items = list.filter(
                item => item.idPath.toString() === i.idPath,
            );
            result.push({
                jsx: (
                    <View>
                        <Text
                            style={[
                                this.context.style.resultStyle.list,
                                {
                                    paddingLeft:
                                        this.context.style.resultStyle.list
                                            .paddingLeft +
                                        (items[0].idPath.length -
                                            this.shortestPathLength) *
                                            12,
                                },
                            ]}>
                            {i.name}
                        </Text>
                        <View style={this.context.style.resultStyle.itemList}>
                            <FlatList
                                data={items}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderResultEntry}
                            />
                        </View>
                    </View>
                ),
                key: i.idPath,
            });
        }
        return result;
    }

    exportTxt(fileName) {
        let content = '';
        for (let item of this.props.route.params.result.items) {
            content += item.name + '\n';
        }

        content = content.replace(/\n$/, ''); // $ means end of input

        writeFile(
            fileName + '.txt',
            RNFS.DownloadDirectoryPath,
            content,
            'File saved to Downloads folder',
        );
    }

    exportTxtWithParentLists(fileName) {
        let content = '';
        for (let i of this.parentLists) {
            let items = this.props.route.params.result.items.filter(
                item => item.idPath.toString() === i.idPath,
            );
            content += i.name + '\n';
            for (let item of items) {
                content += '    ' + item.name + '\n';
            }
        }

        // Remove last line break
        content = content.replace(/\n$/, ''); // $ means end of input

        writeFile(
            fileName + '.txt',
            RNFS.DownloadDirectoryPath,
            content,
            'File saved to Downloads folder',
        );
    }

    exportJson(fileName) {
        let content = this.props.route.params.result.items.map(item => {
            return {name: item.name};
        });

        writeFile(
            fileName + '.json',
            RNFS.DownloadDirectoryPath,
            JSON.stringify(content, undefined, 2),
            'File saved to Downloads folder',
        );
    }

    exportJsonWithParentLists(fileName) {
        let content = this.parentLists.map(i => {
            return {
                name: i.name,
                items: this.props.route.params.result.items
                    .filter(item => item.idPath.toString() === i.idPath)
                    .map(item => {
                        return {name: item.name};
                    }),
            };
        });

        writeFile(
            fileName + '.json',
            RNFS.DownloadDirectoryPath,
            JSON.stringify(content, undefined, 2),
            'File saved to Downloads folder',
        );
    }

    naturalSort(a, b) {
        return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    }

    naturalNameSort(a, b) {
        return this.naturalSort(a.name, b.name);
    }

    listSort(a, b) {
        if (a.idPath.length !== b.idPath.length) {
            return a.idPath.length - b.idPath.length;
        }
        for (let i = 0; i < a.idPath.length; i++) {
            if (a.idPath[i] !== b.idPath[i]) {
                return a.idPath[i] - b.idPath[i];
            }
        }
        return 0;
    }

    naturalListSort(a, b) {
        if (a.idPath.length !== b.idPath.length) {
            const aParents = a.parentNames.join('');
            const bParents = b.parentNames.join('');
            return this.naturalSort(aParents, bParents);
        }
        for (let i = 0; i < a.idPath.length; i++) {
            if (a.idPath[i] !== b.idPath[i]) {
                const aParents = a.parentNames.join('');
                const bParents = b.parentNames.join('');
                return this.naturalSort(aParents, bParents);
            }
        }
        return this.naturalNameSort(a, b);
    }

    render() {
        const {navigation, route} = this.props;

        let items = [...route.params.result.items];
        switch (this.context.settings.resultSort) {
            case 'natural':
                items = this.listItems(
                    items.sort(this.naturalNameSort.bind(this)),
                );
                break;

            case 'byList':
                items = this.listItemsByList(
                    items.sort(this.listSort.bind(this)),
                    this.parentLists,
                );
                break;

            case 'byListNatural':
                const parentLists = [...this.parentLists].sort(
                    this.naturalNameSort.bind(this),
                );
                items = this.listItemsByList(
                    items.sort(this.naturalListSort.bind(this)),
                    parentLists,
                );
                break;

            default:
                items = this.listItems(items);
                break;
        }

        const sortOptions = [
            {
                text: 'Pick order',
                onPress: () => {
                    this.context.setSetting('resultSort', 'pickOrder');
                    navigation.goBack();
                },
            },
            {
                text: 'Natural',
                onPress: () => {
                    this.context.setSetting('resultSort', 'natural');
                    navigation.goBack();
                },
            },
            {
                text: 'By list',
                onPress: () => {
                    this.context.setSetting('resultSort', 'byList');
                    navigation.goBack();
                },
            },
            {
                text: 'By list natural',
                onPress: () => {
                    this.context.setSetting('resultSort', 'byListNatural');
                    navigation.goBack();
                },
            },
        ];

        const exportParams = {
            headline: 'File name',
            initialTextInputValue: 'Result',
            selectTextOnFocus: true,
            submitText: 'Export',
            onSubmit: text => {
                this.state.exportFunction(text);
                navigation.goBack();
            },
        };

        const exportOptions = [
            {
                text: 'JSON',
                onPress: () => {
                    this.setState({
                        exportFunction: this.exportJson.bind(this),
                    });
                    navigation.replace('textInputModal', exportParams);
                },
            },
            {
                text: 'JSON with parent lists',
                onPress: () => {
                    this.setState({
                        exportFunction:
                            this.exportJsonWithParentLists.bind(this),
                    });
                    navigation.replace('textInputModal', exportParams);
                },
            },
            {
                text: 'TXT',
                onPress: () => {
                    this.setState({
                        exportFunction: this.exportTxt.bind(this),
                    });
                    navigation.replace('textInputModal', exportParams);
                },
            },
            {
                text: 'TXT with parent lists',
                onPress: () => {
                    this.setState({
                        exportFunction:
                            this.exportTxtWithParentLists.bind(this),
                    });
                    navigation.replace('textInputModal', exportParams);
                },
            },
        ];

        const additionalComponents = [
            <PressableIcon
                key="export"
                onPress={() => {
                    this.setState({
                        exportFunction: () => {},
                    });
                    navigation.navigate('optionModal', {
                        headline: 'Export as',
                        options: exportOptions,
                    });
                }}
                icon={'file-download'}
                style={this.context.style.headerStyle.icon}
                ripple={this.context.style.rippleStyle.icon}
            />,
            <PressableIcon
                key="sort"
                onPress={() => {
                    navigation.navigate('optionModal', {
                        headline: 'Sort results',
                        options: sortOptions,
                    });
                }}
                icon={'sort'}
                style={this.context.style.headerStyle.icon}
                ripple={this.context.style.rippleStyle.icon}
            />,
        ];

        return (
            <View style={this.context.style.resultStyle.upperLevelView}>
                <Header
                    showBackButton={true}
                    navigation={navigation}
                    text={route.params.result.name}
                    additionalComponents={additionalComponents}
                />
                <FlatList data={items} renderItem={this.renderJsx} />
            </View>
        );
    }
}
RandomizationResult.contextType = appContext;
