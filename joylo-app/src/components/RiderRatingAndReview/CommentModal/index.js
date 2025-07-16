import React from 'react';
import { Modal, View, TextInput, Pressable } from 'react-native';
import styles from './styles';
import TextDefault from '@/src/components/Text/TextDefault/TextDefault';
import { useLanguage } from '@/src/context/Language';

export default function CommentModal({ visible, value, onChange, onCancel, onDone }) {
    const { getTranslation } = useLanguage();
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.headerRow}>
                        <Pressable onPress={onCancel}><TextDefault style={styles.cancelTxt}>{getTranslation("cancel")}</TextDefault></Pressable>
                        <TextDefault >{getTranslation("add_comment")}</TextDefault>
                        <Pressable onPress={onDone}><TextDefault style={styles.doneTxt}>{getTranslation("done")}</TextDefault></Pressable>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Write your feedback here"
                        multiline
                        value={value}
                        onChangeText={onChange}
                    />
                </View>
            </View>
        </Modal>
    );
}