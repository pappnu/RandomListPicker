import {StyleSheet} from 'react-native';

export const resultStyle = StyleSheet.create({
    upperLevelView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
    },
    list: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,1)',
        paddingLeft: 0,
        paddingTop: 4,
        paddingBottom: 4,
    },
    item: {
        fontSize: 16,
        color: 'rgba(255,255,255,1)',
        paddingLeft: 12,
    },
    itemList: {
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: 'rgba(150, 150, 150, 1)',
    }
});
