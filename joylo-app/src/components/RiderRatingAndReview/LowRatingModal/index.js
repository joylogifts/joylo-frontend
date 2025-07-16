import React from 'react';
import { Modal, View, Image, Pressable } from 'react-native';
import styles from './styles';
import TextDefault from '@/src/components/Text/TextDefault/TextDefault';
import Spinner from '../../Spinner/Spinner';
import { useLanguage } from '@/src/context/Language';


export default function LowRatingModal({ visible, onCancel, onCreateTicket, onCreateLoading }) {
    const { getTranslation } = useLanguage();
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconWrapper}>
                        <Image source={require('../../../../assets/warning.png')} style={styles.icon} />
                    </View>
                    <TextDefault style={styles.heading}>
                        {getTranslation("we_are_sorry_to_hear_that")}
                    </TextDefault>
                    <TextDefault style={styles.message}>
                        {getTranslation("you_gave_us_a_low_rating_would_you_like_to_create_a_support_ticket")}
                    </TextDefault>
                    <View style={styles.buttonRow}>
                        <Pressable style={styles.cancelBtn} onPress={onCancel}>
                            <TextDefault style={styles.cancelText}>{getTranslation("cancel")}</TextDefault>
                        </Pressable>
                        <Pressable disabled={onCreateLoading} style={styles.createBtn} onPress={onCreateTicket}>
                            <TextDefault style={styles.createText}>{getTranslation("create_ticket")}</TextDefault> {onCreateLoading && <Spinner />}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}