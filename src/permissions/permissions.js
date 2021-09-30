import {PermissionsAndroid, Alert} from 'react-native';

export async function requestExternalStorageReadPermission() {
    try {
        return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: 'External Storage Read Permission',
                message:
                    'Random List Picker needs read access to external storage to import files from there.',
                buttonPositive: 'Ok',
            },
        );
    } catch (error) {
        Alert.alert('Error while asking permission', error.toString());
    }
}

export async function externalStorageReadPermissionFlow() {
    const access = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (access) {
        return true;
    }
    const granted = await requestExternalStorageReadPermission();
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    }
    return false;
}

export async function requestExternalStorageWritePermission() {
    try {
        return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'External Storage Write Permission',
                message:
                    'Random List Picker needs write access to external storage to export files.',
                buttonPositive: 'Ok',
            },
        );
    } catch (error) {
        Alert.alert('Error while asking permission', error.toString());
    }
}

export async function externalStorageWritePermissionFlow() {
    const access = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (access) {
        return true;
    }
    const granted = await requestExternalStorageWritePermission();
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    }
    return false;
}
