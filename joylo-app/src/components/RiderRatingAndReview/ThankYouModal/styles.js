import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    icon: {
        width: 64,
        height: 64,
        marginBottom: 16,
    },
    heading: {
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        color: '#555',
    },
});