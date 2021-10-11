import React, {useCallback, useContext, useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';

import {appContext} from '../context/context';

export function TextInputModal({navigation, route}) {
    const {
        headline,
        onSubmit,
        submitText,
        initialTextInputValue,
        selectTextOnFocus,
    } = route.params;
    const {style} = useContext(appContext);
    const [text, setText] = useState(initialTextInputValue);

    const goBack = useCallback(() => navigation.goBack(), [navigation]);

    return (
        <View style={style.modalStyle.upperLevelView}>
            <View style={style.modalStyle.modalBox}>
                <Text style={style.modalStyle.headline}>{headline}</Text>
                <TextInput
                    onChangeText={setText}
                    value={text}
                    autoFocus={true}
                    selectTextOnFocus={selectTextOnFocus}
                    style={style.modalStyle.textInput}
                />
                <View style={style.modalStyle.horizontal}>
                    <Pressable
                        onPress={goBack}
                        android_ripple={style.rippleStyle.button}>
                        <Text style={style.modalStyle.cancel}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => onSubmit(text)}
                        android_ripple={style.rippleStyle.button}>
                        <Text style={style.modalStyle.cancel}>
                            {submitText}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
