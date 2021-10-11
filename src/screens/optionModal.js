import React, {useCallback, useContext} from 'react';
import {View, Text, Pressable, FlatList} from 'react-native';

import {appContext} from '../context/context';

export function OptionModal({navigation, route}) {
    const {headline, options} = route.params;
    const {style} = useContext(appContext);

    const goBack = useCallback(() => navigation.goBack(), [navigation]);

    const renderOption = ({item}) => (
        <Pressable
            onPress={item.onPress}
            android_ripple={style.rippleStyle.button}>
            <Text style={style.modalStyle.option}>{item.text}</Text>
        </Pressable>
    );

    return (
        <View style={style.modalStyle.upperLevelView}>
            <View style={style.modalStyle.modalBox}>
                <Text style={style.modalStyle.headline}>{headline}</Text>
                <FlatList
                    style={style.modalStyle.optionList}
                    data={options}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderOption}
                    getItemLayout={(data, index) => ({
                        length: style.modalStyle.option.height,
                        offset: style.modalStyle.option.height * index,
                        index,
                    })}
                />
                <View style={style.modalStyle.horizontal}>
                    <Pressable
                        onPress={goBack}
                        android_ripple={style.rippleStyle.button}>
                        <Text style={style.modalStyle.cancel}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
