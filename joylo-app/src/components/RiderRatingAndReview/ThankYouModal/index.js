import React from 'react';
import { Modal, View, Image } from 'react-native';
import styles from './styles';
import TextDefault from '@/src/components/Text/TextDefault/TextDefault';
import { useLanguage } from '@/src/context/Language';

export default function ThankYouModal({ visible }) {
    const { getTranslation } = useLanguage();
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Image source={require('../../../../assets/checkmark.png')} style={styles.icon} />
                    <TextDefault style={styles.heading}>
                        {getTranslation("thank_you")}
                    </TextDefault>
                    <TextDefault style={styles.message}>
                        {getTranslation("your_feedback_is_submitted")}
                    </TextDefault>
                </View>
            </View>
        </Modal>
    );
}