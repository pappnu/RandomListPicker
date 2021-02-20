import {StyleSheet} from 'react-native';

export const settingsStyle = StyleSheet.create({
    upperLevelView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
    },
    checkBoxChecked: {
        fontSize: 24,
        padding: 12,
        color: 'rgba(60, 107, 233, 1)',
    },
    checkBoxUnchecked: {
        fontSize: 24,
        padding: 12,
        color: 'rgba(150, 150, 150, 1)',
    },
    checkBoxUnactive: {
        fontSize: 24,
        padding: 12,
        color: 'rgba(80, 80, 80, 1)',
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        textAlignVertical: 'center',
        color: 'rgba(255, 255, 255, 1)',
        height: 48,
        paddingLeft: 12,
        paddingRight: 12,
    },
    unactiveText: {
        fontSize: 16,
        textAlignVertical: 'center',
        color: 'rgba(130, 130, 130, 1)',
        height: 48,
        paddingLeft: 12,
        paddingRight: 12,
    },
    textInput: {
        paddingLeft: 12,
        paddingRight: 12,
        color: 'rgba(255,255,255,1)',
        borderWidth: 1,
        borderColor: 'rgba(150, 150, 150, 1)',
        textAlign: 'center',
    },
    pressable: {
        flex: 1,
    },
});
