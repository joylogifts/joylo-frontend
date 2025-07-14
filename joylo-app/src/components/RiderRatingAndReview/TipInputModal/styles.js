import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
    container: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    title: { marginBottom: 12 },
    input: { height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#CCC', paddingHorizontal: 12, marginBottom: 24 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelBtn: { flex: 1, marginRight: 8, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: '#F5A623', alignItems: 'center' },
    cancelText: { color: '#F5A623' },
    addBtn: { flex: 1, marginLeft: 8, paddingVertical: 14, borderRadius: 24, backgroundColor: '#F5A623', alignItems: 'center' },
    addText: { color: '#FFF' },
});