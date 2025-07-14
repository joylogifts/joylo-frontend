import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        alignItems: 'start',
        width: width,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5A62320',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'start',
    },
    icon: {
        width: 24,
        height: 24,
    },
    heading: {
        textAlign: 'start',
        marginBottom: 12,
    },
    message: {
        textAlign: 'start',
        marginBottom: 24,
        color: '#555',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 8,
        justifyContent: 'space-between',
    },
    cancelBtn: {
        flex: 1,

        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F5A623',
        alignItems: 'center',
    },
    cancelText: {
        color: '#F5A623',
    },
    createBtn: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#F5A623',
        alignItems: 'center',
    },
    createText: {
        color: '#FFF',
    },
});
