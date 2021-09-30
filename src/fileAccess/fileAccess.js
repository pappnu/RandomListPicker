import {ToastAndroid, Alert} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import {
    externalStorageReadPermissionFlow,
    externalStorageWritePermissionFlow,
} from '../permissions/permissions';

export async function pickAndRead(mimeTypes) {
    const permission = await externalStorageReadPermissionFlow();
    if (permission) {
        const res = await DocumentPicker.pickSingle({
            type: mimeTypes,
        });

        /**
        console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size,
        );
        */

        return await RNFS.readFile(res.uri);
    } else {
        Alert.alert(
            'Error importing',
            'External storage read permission not granted.',
        );
        return undefined;
    }
}

export async function writeFile(
    name,
    path,
    content,
    successToast,
    encoding = 'utf8',
) {
    const permission = await externalStorageWritePermissionFlow();
    if (permission) {
        const fullPath = path + '/' + name;
        // TODO: find a non-hacky solution
        // for details see: https://github.com/itinance/react-native-fs/issues/700#issuecomment-570650632
        await RNFS.unlink(fullPath);
        RNFS.writeFile(fullPath, content, encoding)
            .then(success => {
                ToastAndroid.show(successToast, ToastAndroid.SHORT);
            })
            .catch(error => {
                Alert.alert('Error saving file', error.toString());
            });
    } else {
        Alert.alert(
            'Error exporting',
            'External storage write permission not granted.',
        );
    }
}
