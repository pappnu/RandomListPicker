import {StyleSheet} from 'react-native';

export const modalStyle = StyleSheet.create({
    upperLevelView: {
        flex: 1,
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalBox: {
        flexGrow: 0,
        flexDirection: 'column',
        backgroundColor: 'rgba(70,70,70,1)',
    },
    headline: {
        fontSize: 20,
        color: 'rgba(255,255,255,1)',
        padding: 16,
    },
    optionList: {
        flexGrow: 0,
    },
    option: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.95)',
        height: 48,
        paddingLeft: 24,
        paddingRight: 40,
        textAlignVertical: 'center',
    },
    cancel: {
        fontSize: 14,
        color: 'rgba(60,150,233,1)',
        textAlignVertical: 'center',
        textAlign: 'center',
        height: 48,
        padding: 12,
    },
    textInput: {
        width: 300,
        paddingLeft: 24,
        color: 'rgba(255,255,255,0.95)',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 12,
        paddingLeft: 12,
        paddingBottom: 4,
    },
    filler: {
        width: 12,
    }
});
