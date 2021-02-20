import {StyleSheet} from 'react-native';

export const headerStyle = StyleSheet.create({
    upperLevelView: {
        flexDirection: 'row',
        backgroundColor: 'rgba(80, 80, 80, 1)',
        height: 56,
        alignItems: 'center',
    },
    headline: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 1)',
        paddingLeft: 12,
    },
    backArrow: {
        fontSize: 24,
        height: 48,
        color: 'rgba(255, 255, 255, 1)',
        padding: 12,
    },
    icon: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 1)',
        padding: 12,
    },
});
