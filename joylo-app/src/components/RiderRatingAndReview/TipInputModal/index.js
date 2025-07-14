import React from 'react';
import { Modal, View, TextInput, Pressable } from 'react-native';
import styles from './styles';
import TextDefault from '@/src/components/Text/TextDefault/TextDefault';
import { useLanguage } from '@/src/context/Language';

export default function TipInputModal({ visible, value, onChange, onCancel, onAdd }) {
    const { getTranslation } = useLanguage();
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TextDefault style={styles.title}>{getTranslation("add_tip")}</TextDefault>
                    <TextInput
                        style={styles.input}
                        placeholder={getTranslation("enter_amount_tip_placeholder")}
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                    />
                    <View style={styles.buttonRow}>
                        <Pressable style={styles.cancelBtn} onPress={onCancel}><TextDefault variant="button" style={styles.cancelText}>{getTranslation("cancel")}</TextDefault></Pressable>
                        <Pressable style={styles.addBtn} onPress={onAdd}><TextDefault variant="button" style={styles.addText}>{getTranslation("add")}</TextDefault></Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}