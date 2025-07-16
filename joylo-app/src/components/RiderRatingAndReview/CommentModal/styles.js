import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
    container: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 12, borderBottomColor: `#CCC`, borderBottomWidth: 1 },
    cancelTxt: { color: '#F5A623', fontSize: 16, fontWeight: '500' },
    doneTxt: { color: '#F5A623', fontSize: 16, fontWeight: '500' },
    input: { height: 120, marginTop: 8, marginBottom: 50, marginHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#CCC', padding: 12, textAlignVertical: 'top' },
});