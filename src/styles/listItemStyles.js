import {StyleSheet} from 'react-native';

export const listItemStyle = StyleSheet.create({
    upperLevelView: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'rgba(150, 150, 150, 1)',
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
    pressable: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 12,
    },
    icon: {
        fontSize: 24,
        textAlignVertical: 'center',
        color: 'rgba(255, 255, 255, 1)',
        paddingLeft: 12,
    },
    text: {
        fontSize: 16,
        textAlignVertical: 'center',
        color: 'rgba(255, 255, 255, 1)',
        height: 48,
        paddingLeft: 12,
    },
    textInput: {
        paddingLeft: 12,
        paddingRight: 12,
        color: 'rgba(255,255,255,1)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(150, 150, 150, 1)',
        textAlign: 'center',
    },
});
