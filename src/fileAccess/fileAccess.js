import {ToastAndroid, Alert} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export async function pickAndRead(mimeTypes) {
    const res = await DocumentPicker.pick({
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
}

export async function writeFile(
    name,
    path,
    content,
    successToast,
    encoding = 'utf8',
) {
    const fullPath = path + '/' + name;
    RNFS.writeFile(fullPath, content, 'utf8')
        .then((success) => {
            ToastAndroid.show(successToast, ToastAndroid.SHORT);
        })
        .catch((error) => {
            Alert.alert('Error saving file', error.toString());
        });
}
