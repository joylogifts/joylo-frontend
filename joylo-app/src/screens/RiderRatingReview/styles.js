import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    header: {
        marginRight: 18,
        alignItems: 'flex-end',
    },
    skip: {
        color: '#F5A623',
        fontSize: 16,
    },
    content: {
        alignItems: 'center',
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F7F1E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
    },
    name: {
        marginBottom: 4,
        color: '#555',
    },
    title: {
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        color: '#777',
    },
    nextButton: {
        backgroundColor: '#F5A623',
        borderRadius: 32,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 34,
        width: width - 48,
        alignSelf: 'center',
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
});
