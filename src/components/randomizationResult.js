import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';

import IdleTimerManager from 'react-native-idle-timer';
import RNFS from 'react-native-fs';

import {appContext} from '../context/context';
import {PressableIcon} from './pressableIcon';
import {Header} from './header';
import {OptionModal, TextInputModal} from './modals';
import {writeFile} from '../fileAccess/fileAccess';

export class RandomizationResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortModal: false,
            exportModal: false,
            nameModal: false,
            exportFunction: () => {},
            exportName: 'Result',
        };
        [
            this.parentLists,
            this.shortestPathLength,
        ] = this.extractParentListNames([...props.route.params.result.items]);
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
        let lists = {};
        let shortestPathLength = Number.MAX_SAFE_INTEGER;
        for (let item of list) {
            if (!lists.hasOwnProperty(item.idPath.toString())) {
                lists[item.idPath.toString()] = item.parentName;
                if (item.idPath.length - 1 < shortestPathLength) {
                    shortestPathLength = item.idPath.length - 1;
                }
            }
        }
        return [lists, shortestPathLength];
    }

    listItemsByList(list) {
        let result = [];
        for (let i in this.parentLists) {
            let items = list.filter((item) => item.idPath.toString() === i);
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
                            {this.parentLists[i]}
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
                key: i.toString(),
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
        for (let i in this.parentLists) {
            let items = this.props.route.params.result.items.filter(
                (item) => item.idPath.toString() === i,
            );
            content += this.parentLists[i] + '\n';
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
        let content = this.props.route.params.result.items.map((item) => {
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
        let content = Object.entries(this.parentLists).map(([key, value]) => {
            return {
                name: value,
                items: this.props.route.params.result.items
                    .filter((item) => item.idPath.toString() === key)
                    .map((item) => {
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
        return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
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
            return a.idPath.length - b.idPath.length;
        }
        for (let i = 0; i < a.idPath.length; i++) {
            if (a.idPath[i] !== b.idPath[i]) {
                return a.idPath[i] - b.idPath[i];
            }
        }
        return this.naturalSort(a, b);
    }

    render() {
        let items = [...this.props.route.params.result.items];
        switch (this.context.settings.resultSort) {
            case 'natural':
                items = this.listItems(items.sort(this.naturalSort.bind(this)));
                break;

            case 'byList':
                items = this.listItemsByList(
                    items.sort(this.listSort.bind(this)),
                );
                break;

            case 'byListNatural':
                items = this.listItemsByList(
                    items.sort(this.naturalListSort.bind(this)),
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
                    this.setState({
                        sortModal: false,
                    });
                },
            },
            {
                text: 'Natural',
                onPress: () => {
                    this.context.setSetting('resultSort', 'natural');
                    this.setState({
                        sortModal: false,
                    });
                },
            },
            {
                text: 'By list',
                onPress: () => {
                    this.context.setSetting('resultSort', 'byList');
                    this.setState({
                        sortModal: false,
                    });
                },
            },
            {
                text: 'By list natural',
                onPress: () => {
                    this.context.setSetting('resultSort', 'byListNatural');
                    this.setState({
                        sortModal: false,
                    });
                },
            },
        ];

        const exportOptions = [
            {
                text: 'JSON',
                onPress: () => {
                    this.setState({
                        exportModal: false,
                        nameModal: true,
                        exportFunction: this.exportJson.bind(this),
                    });
                },
            },
            {
                text: 'JSON with parent lists',
                onPress: () => {
                    this.setState({
                        exportModal: false,
                        nameModal: true,
                        exportFunction: this.exportJsonWithParentLists.bind(
                            this,
                        ),
                    });
                },
            },
            {
                text: 'TXT',
                onPress: () => {
                    this.setState({
                        exportModal: false,
                        nameModal: true,
                        exportFunction: this.exportTxt.bind(this),
                    });
                },
            },
            {
                text: 'TXT with parent lists',
                onPress: () => {
                    this.setState({
                        exportModal: false,
                        nameModal: true,
                        exportFunction: this.exportTxtWithParentLists.bind(
                            this,
                        ),
                    });
                },
            },
        ];

        const optionModals = [
            {
                visible: this.state.sortModal,
                onRequestClose: () =>
                    this.setState({
                        sortModal: false,
                    }),
                headline: 'Sort results',
                options: sortOptions,
            },
            {
                visible: this.state.exportModal,
                onRequestClose: () =>
                    this.setState({
                        exportModal: false,
                    }),
                headline: 'Export as',
                options: exportOptions,
            },
        ];

        const optionModalsJsx = optionModals.map((i) => (
            <OptionModal
                key={i.headline}
                visible={i.visible}
                onRequestClose={i.onRequestClose}
                headline={i.headline}
                options={i.options}
            />
        ));

        const additionalComponents = [
            <PressableIcon
                key="export"
                onPress={() => {
                    this.setState({exportModal: true});
                }}
                icon={'file-download'}
                style={this.context.style.headerStyle.icon}
                ripple={this.context.style.rippleStyle.icon}
            />,
            <PressableIcon
                key="sort"
                onPress={() => {
                    this.setState({sortModal: true});
                }}
                icon={'sort'}
                style={this.context.style.headerStyle.icon}
                ripple={this.context.style.rippleStyle.icon}
            />,
        ];

        return (
            <View style={this.context.style.resultStyle.upperLevelView}>
                {optionModalsJsx}
                <TextInputModal
                    visible={this.state.nameModal}
                    onRequestClose={() =>
                        this.setState({
                            nameModal: false,
                            exportFunction: () => {},
                            exportName: 'Result',
                        })
                    }
                    headline={'File name'}
                    onChangeText={(text) => this.setState({exportName: text})}
                    textInputValue={this.state.exportName}
                    selectTextOnFocus={true}
                    submitText={'Export'}
                    onSubmit={() => {
                        this.state.exportFunction(this.state.exportName);
                        this.setState({
                            nameModal: false,
                            exportFunction: () => {},
                            exportName: 'Result',
                        });
                    }}
                />
                <Header
                    showBackButton={true}
                    navigation={this.props.navigation}
                    text={'Randomization result'}
                    additionalComponents={additionalComponents}
                />
                <FlatList data={items} renderItem={this.renderJsx} />
            </View>
        );
    }
}
RandomizationResult.contextType = appContext;
