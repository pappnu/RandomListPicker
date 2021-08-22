import 'react-native-gesture-handler'; // This has to be on top for React Navigation

import React, {Component} from 'react';
import {Alert} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

import {ItemList} from '../lists/list';
import {appContext} from '../context/context';
import {ListView} from '../components/listView';
import {ListSettings} from '../components/listSettings';
import {AppSettings} from '../components/appSettings';
import {RandomizationResult} from '../components/randomizationResult';
import {headerStyle} from '../styles/headerStyles';
import {listViewStyle} from '../styles/listViewStyles';
import {listItemStyle} from '../styles/listItemStyles';
import {modalStyle} from '../styles/modalStyles';
import {resultStyle} from '../styles/resultStyles';
import {settingsStyle} from '../styles/settingsStyles';
import {rippleStyle} from '../styles/rippleStyles';
import {History} from '../components/history';

const Stack = createNativeStackNavigator();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: new ItemList(0, 'Random List Picker'),
            style: {
                headerStyle: headerStyle,
                listViewStyle: listViewStyle,
                listItemStyle: listItemStyle,
                modalStyle: modalStyle,
                resultStyle: resultStyle,
                settingsStyle: settingsStyle,
                rippleStyle: rippleStyle,
            },
            settings: {
                resultSort: 'pickOrder',
                preventSleep: false,
            },
            history: [],
        };
        this.listKey = 'list';
        this.historyKey = 'history';
        this.styleKey = 'style';
        this.settingsKey = 'settings';

        this.historyLimit = 100;

        this.readFromLocalStorage(
            this.listKey,
            (result) => {
                let resultJson = JSON.parse(result);
                if (resultJson && this.state.list.validateJson(resultJson)) {
                    let baseList = new ItemList(0, resultJson.name, {
                        items: resultJson.items,
                        numToPick: resultJson.numToPick,
                        numToPickRecursive: resultJson.numToPickRecursive,
                        pickUnique: resultJson.pickUnique,
                        pickUniqueRecursive: resultJson.pickUniqueRecursive,
                        combineLists: resultJson.combineLists,
                        combineListsRecursive: resultJson.combineListsRecursive,
                    });
                    this.setState({list: baseList});
                }
            },
            (error) => {
                if (error.code !== 'ENOENT') {
                    Alert.alert(
                        'Document storage Error',
                        "Couldn't read list data from document storage. " +
                            error,
                    );
                }
            },
        );

        this.readFromLocalStorage(
            this.historyKey,
            (result) => {
                let resultJson = JSON.parse(result);
                if (resultJson) {
                    this.setState({history: resultJson});
                }
            },
            (error) => {
                if (error.code !== 'ENOENT') {
                    Alert.alert(
                        'Document Storage Error',
                        "Couldn't read history data from document storage. " +
                            error,
                    );
                }
            },
        );

        this.readFromAsyncStorage(
            this.settingsKey,
            (result) => {
                let resultJson = JSON.parse(result);
                if (resultJson) {
                    this.setState({settings: resultJson});
                }
            },
            (error) =>
                Alert.alert(
                    'Async Storage Error',
                    "Couldn't read settings from async storage. " + error,
                ),
        );
    }

    saveToAsyncStorage(key, value) {
        AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) => {
            Alert.alert(
                'Async Storage Error',
                "Couldn't save to async storage. " + error,
            );
        });
    }

    readFromAsyncStorage(key, onSuccess = () => {}, onError = () => {}) {
        AsyncStorage.getItem(key).then(onSuccess).catch(onError);
    }

    saveToLocalStorage(
        filename,
        data,
        path = RNFS.DocumentDirectoryPath,
        encoding = 'utf8',
    ) {
        RNFS.writeFile(
            path + '/' + filename,
            JSON.stringify(data),
            encoding,
        ).catch((error) => {
            Alert.alert(
                'File write Error',
                "Couldn't save to document storage. " + error,
            );
        });
    }

    readFromLocalStorage(
        filename,
        onSuccess = () => {},
        onError = () => {},
        path = RNFS.DocumentDirectoryPath,
        encoding = 'utf8',
    ) {
        RNFS.readFile(path + '/' + filename, encoding)
            .then(onSuccess)
            .catch(onError);
    }

    saveToHistory(result, limit = this.historyLimit) {
        let history = this.state.history;
        if (history.length >= limit) {
            history.pop();
        }
        history.push(result);
        this.setState({history: history}, async () =>
            this.saveToLocalStorage(this.historyKey, this.state.history),
        );
    }

    setSetting(setting, newValue) {
        let settings = this.state.settings;
        settings[setting] = newValue;
        this.setState({settings: settings}, async () =>
            this.saveToAsyncStorage(this.settingsKey, this.state.settings),
        );
    }

    addItem(idPath, type, name) {
        let baseList = this.state.list;
        let list = baseList.getItem(idPath);
        switch (type) {
            case 'list':
                list.addList(name);
                break;
            case 'item':
                list.addItem(name);
                break;
            default:
                break;
        }
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    deleteItem(idPath) {
        let baseList = this.state.list;
        baseList.deleteItem(idPath);
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    renameItem(newName, idPath) {
        let baseList = this.state.list;
        baseList.renameItem(newName, idPath);
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    addFromJson(json, idPath) {
        let baseList = this.state.list;
        let list = baseList.getItem(idPath);
        if (!Array.isArray(json)) {
            json = [json];
        }
        list.addItems(json);
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    setPropertyForItems(idPath, property, value, recursive = false) {
        let baseList = this.state.list;
        baseList.getItem(idPath).setPropertyForAll(property, value, recursive);
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    deactivateItems(idPaths) {
        let baseList = this.state.list;
        for (let path of idPaths) {
            baseList.getItem(path).active = false;
        }
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    setListProperty(property, newValue, idPath) {
        let baseList = this.state.list;
        let list = baseList.getItem(idPath);
        list[property] = newValue;
        this.setState({list: baseList}, async () =>
            this.saveToLocalStorage(this.listKey, this.state.list.exportJson()),
        );
    }

    render() {
        return (
            <appContext.Provider
                value={{
                    list: this.state.list,
                    style: this.state.style,
                    settings: this.state.settings,
                    history: this.state.history,
                    addItem: this.addItem.bind(this),
                    deleteItem: this.deleteItem.bind(this),
                    renameItem: this.renameItem.bind(this),
                    addFromJson: this.addFromJson.bind(this),
                    deactivateItems: this.deactivateItems.bind(this),
                    setPropertyForItems: this.setPropertyForItems.bind(this),
                    setListProperty: this.setListProperty.bind(this),
                    setSetting: this.setSetting.bind(this),
                    saveToHistory: this.saveToHistory.bind(this),
                }}>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName={'list'}
                        screenOptions={{animation: 'none'}}>
                        <Stack.Screen
                            name="list"
                            component={ListView}
                            options={{headerShown: false}}
                            initialParams={{
                                idPath: [],
                            }}
                        />
                        <Stack.Screen
                            name="listSettings"
                            component={ListSettings}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="appSettings"
                            component={AppSettings}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="randomResult"
                            component={RandomizationResult}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="history"
                            component={History}
                            options={{headerShown: false}}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </appContext.Provider>
        );
    }
}
