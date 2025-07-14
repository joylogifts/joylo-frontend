import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        marginRight: 18,
        alignItems: 'flex-end',
    },
    skip: {
        color: '#F5A623',
        fontSize: 16,
    },
    commentPreview: { textAlign: "center", marginBottom: 12, color: '#F5A623', },
    content: { padding: 12, flex: 1, justifyContent: 'center' },
    avatarWrapper: { alignItems: 'center', marginBottom: 12 },
    avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F7F1E9' },
    avatarEmoji: { position: 'absolute', bottom: 8, right: width / 2 - 84, width: 40, height: 40 },
    name: { textAlign: 'center', marginBottom: 4, color: '#555' },
    title: { textAlign: 'center', marginBottom: 6 },
    subtitle: { textAlign: 'center', marginBottom: 24, color: '#777' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 },
    chip: { borderRadius: 16, borderWidth: 1, borderColor: '#CCC', paddingHorizontal: 12, paddingVertical: 6, margin: 4 },
    chipSelected: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
    chipText: { color: '#555' },
    chipTextSelected: { color: '#FFF' },
    addCommentBtn: { alignSelf: 'center', marginBottom: 24 },
    addCommentText: { color: '#0A9F84' },
    tipTitle: { marginLeft: 12, marginBottom: 12, textAlign: 'start', },
    tipSubTitle: { textAlign: 'start', marginBottom: 24, color: '#777', paddingHorizontal: 12 },
    tipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 24 },
    tipBtn: { borderRadius: 24, borderWidth: 1, borderColor: '#777', paddingHorizontal: 16, paddingVertical: 8 },
    tipBtnSelected: { borderRadius: 24, borderWidth: 1, borderColor: '#F5A623', paddingHorizontal: 16, paddingVertical: 8 },
    tipText: { color: '#777' },
    tipTextSelected: { color: '#F5A623' },
    submitBtn: { position: 'absolute', bottom: 34, alignSelf: 'center', backgroundColor: '#F5A623', borderRadius: 32, paddingVertical: 14, width: width - 48, alignItems: 'center' },
});
