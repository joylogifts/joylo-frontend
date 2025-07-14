import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        gap: 10
    },
    item: {
        alignItems: 'center',
    },
    circle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F5A62320',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    circleSelected: {
        backgroundColor: '#F5A62390',
    },
    emoji: {
        width: 28,
        height: 28,
    },
    label: {
        fontSize: 12,
        color: '#555',
    },
});